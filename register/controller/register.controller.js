import {successResponse,errorResponse,customResponse} from "../helpers/Response.helper.js";
import {getDataCache} from "../config/redis.config.js";
import {verifyHmac} from "../security/verifyOnHmac.security.js";
import {sendOtpProduceMessage} from "../utils/sendOtp.util.js";
import {generateOtp} from "../helpers/generateOtp.helper.js";
import { hash } from "../security/hashOnHmac.security.js";
import { variable } from "../env/main.env.js";
export async function handleRegister(req,reply) {
    try {
        let hmacKeys = variable.hmacKeys;
        const dataCache = getDataCache();
        const {userId,name,mail,password,dob,deviceFingerPrint} = req.body;
        const stringData = await dataCache.get(`temp:${userId}`);
        if (!stringData) {
            return customResponse(reply,404,"user not found",{otpSent:false});
        };
        const data = JSON.parse(stringData);
        const deviceData = data.devicehash.split(":");
        const keyVersion = deviceData[0];
        let recivedHmac = deviceData[1];
        let hmacSecretKey;
        if (keyVersion !== hmacKeys.newKeyVersion && keyVersion !== hmacKeys.oldKeyVersion) {
            return customResponse(reply,403,"token version is invalid",{});
        };
        if (keyVersion === hmacKeys.newKeyVersion) {
            hmacSecretKey = hmacKeys[hmacKeys.newKeyVersion];
        } else {
            hmacSecretKey = hmacKeys[hmacKeys.oldKeyVersion];
        };
        const compare = verifyHmac(hmacSecretKey,deviceFingerPrint,recivedHmac);
        if (!compare) {
            return customResponse(reply,402,"unauthorized to register",{otpSent:false});
        };
        const otp = generateOtp();
        const subject = "register";
        const sendOtp = await sendOtpProduceMessage(mail,subject,otp);
        if (!sendOtp) {
            return errorResponse(reply);
        };
        if (keyVersion !== hmacKeys.newKeyVersion) {
            recivedHmac = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
        };
        const saveDataCache = await dataCache.set(`register:${userId}`,JSON.stringify({name,password,dob,devicehash:`${hmacKeys.newKeyVersion}:${recivedHmac}`,otp,mail}),"EX",300);
        if (!saveDataCache) {
            return errorResponse(reply);
        };
        return successResponse(reply,{otpSent:true});
    } catch (error) {
        console.log("error in the main handle function of the register",error.message);
        return errorResponse(reply);
    };
};