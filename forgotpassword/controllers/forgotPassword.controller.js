import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {User} from "../schema/user.modle.js";
import {getDataCache} from "../config/redis.config.js";
import {generateOtp} from "../helpers/generateOtp.helper.js";
import {sendOtpProduceMessage} from "../utils/sendOtp.util.js";
import {hash} from "../security/hashOnHmac.security.js";
import {variable} from "../env/main.env.js";

export async function handleForgotPassword(req,reply) {
    try {
        const hmacKeys = variable.hmacKeys;
        const dataCache = getDataCache();
        const {userId,deviceFingerPrint} = req.body;
        const userCache = await dataCache.get(`user:${userId}`);
        if (userCache) {
            const data = JSON.parse(userCache);
            const otp = generateOtp();
            const sendOtp = await sendOtpProduceMessage(data.mail,"forgotpassword",otp);
            if (!sendOtp) {
                return errorResponse(reply);
            };
            const devicehash = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
            await dataCache.set(`forgotPassword:${userId}`,JSON.stringify({otp,devicehash:`${hmacKeys.newKeyVersion}:${devicehash}`}),"EX",300)
            return customResponse(reply,200,"userid found",{otpSent:true});
        };
        const findUserInDB = await User.findOne({userId});
        if (!findUserInDB) {
            return customResponse(reply,200,"user not found",{otpSent:false});
        };
        const otp = generateOtp();
        const sendOtp = await sendOtpProduceMessage(findUserInDB.mail,"forgotpassword",otp);
        if (!sendOtp) {
            return errorResponse(reply);
        };
        const devicehash = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
        await dataCache.set(`forgotPassword:${userId}`,JSON.stringify({otp,devicehash:`${hmacKeys.newKeyVersion}:${devicehash}`}));
        return customResponse(reply,200,"userid found",{available:true});
    } catch (error) {
        console.log("error in the main handle function of teh find userid for forgot password",error.message);
        return errorResponse(reply);
    };
};