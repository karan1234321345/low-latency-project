import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {dataCache} from "../config/redis.config.js";
import {sendOtpProduceMessage} from "../utils/sendOtp.util.js";
import {generateOtp} from "../helpers/generateOtp.helper.js";
import {verifyPassword} from "../grpc/worker/verifyPassword.worker.js";
import {User} from "../schema/user.modle.js";
import {hash} from "../security/hashOnHmac.security.js";


const hmacKeys = {
    newKeyVersion:"v2",
    oldKeyVersion:"v1",
    v2:"helloBhai",
    v1:"helloBhai",
};

export async function handleLogin(req,reply) {
    try {
        const {userId,password,deviceFingerPrint} = req.body;
        const data = await dataCache.get(`user:${userId}`);
        if (data) {
            const parsedData = JSON.parse(data);
            const compare = await verifyPassword(parsedData.hashedPassword,password);
            if (!compare||Object.keys(compare).length === 0) {
                return errorResponse(reply);
            };
            if (!compare.matched) {
                return customResponse(reply,200,"wrong password entered",{otpSent:false});
            };
            const otp = generateOtp();
            const sendOtp = await sendOtpProduceMessage(parsedData.mail,"login",otp);
            if (!sendOtp) {
                return errorResponse(reply);
            };
            const devicehash = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
            console.log("here is error");
            await dataCache.set(`login:${userId}`,JSON.stringify({otp,name:parsedData.name,profileImage:parsedData.profileImage,tfa:parsedData.tfa,securityKey:parsedData.hashedSecurityKey,devicehash:`${hmacKeys.newKeyVersion}:${devicehash}`}),"EX",300);
            return customResponse(reply,200,"otp sent",{otpSent:true})
        };
        const checkInDB = await User.findOne({userId});
        if (!checkInDB) {
            return customResponse(reply,404,"user not found",{otpSent:false});
        };
        const compare = await verifyPassword(checkInDB.hashedPassword,password);
        if (!compare) {
            return customResponse(reply,200,"wrong password entered",{otpSent:false});
        };
        const otp = generateOtp();
        const sendOtp = await sendOtpProduceMessage(checkInDB.mail,"login",otp);
        if (!sendOtp) {
            return errorResponse(reply);
        };
        const devicehash = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
        await dataCache.set(`login:${userId}`,JSON.stringify({otp,name:checkInDB.name,profileImage:checkInDB.profileImage,tfa:checkInDB.tfa,securityKey:checkInDB.hashedSecurityKey,devicehash:`${hmacKeys.newKeyVersion}:${devicehash}`}),"EX",300);
        return customResponse(reply,200,"otp sent",{otpSent:true});
    } catch (error) {
        console.log("error in the main handle function of the login",error.message,error.stack);
        return errorResponse(reply);
    };
};