import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {hash} from "../security/hashOnHmac.security.js";
import {verifyHmac} from "../security/verifyOnHmac.security.js";
import {findLocation} from "../utils/findLocation.util.js";
import {LoginDetail} from "../schema/loginDetail.modle.js";
import {getDataCache} from "../config/redis.config.js";
import jwt from "jsonwebtoken";
import {variable} from "../env/main.env.js";
export async function handlerVerifyOtpLogin(req,reply) {
    try {
        const dataCache = getDataCache();
        const hmacKeys = variable.hmacKeys;
        const accessTokenKey = variable.accessTokenKeys;
        const refreshTokenKey = variable.refreshTokenKeys;
        const {userId,otp,deviceFingerPrint} = req.body;
        const cache = await dataCache.get(`login:${userId}`);
        if (!cache) {
            return customResponse(reply,200,"otp is expired or user is invalid",{logedIn:false});
        };
        const data = JSON.parse(cache);
        if (data.otp !== otp) {
            return customResponse(reply,200,"wrong otp entered",{loggedIn:false});
        };
        if (data.tfa) {
            return customResponse(reply,200,"tfa is applied",{loggedIn:false,tfa:true})
        };
        const deviceData = data.devicehash.split(":");
        let keyVersion = deviceData[0];
        let recivedHmac = deviceData[1];
        let key;
        if (keyVersion !== hmacKeys.newKeyVersion && keyVersion !== hmacKeys.oldKeyVersion) {
            return customResponse(reply,403,"invalid device hash version",{loggedIn:false});
        };
        if (keyVersion === hmacKeys.oldKeyVersion) {
            key = hmacKeys[hmacKeys.oldKeyVersion]
        } else {
            key = hmacKeys[hmacKeys.newKeyVersion];
        };
        const compare = verifyHmac(key,deviceFingerPrint,recivedHmac);
        if (!compare) {
            return customResponse(reply,402,"device is invalid",{loggedIn:false});
        }
        const ip = req.ip === '::1' || req.ip === '127.0.0.1' ? '8.8.8.8' : req.ip; // fallback to public IP for local testing
        const location = await findLocation(ip);
        if (!location) {
            return errorResponse(reply);
        };
        if (keyVersion !== hmacKeys.newKeyVersion) {
            recivedHmac = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion])
        }
        const saveLogin = await LoginDetail.create({userId,ipAddress:req.ip,location,deviceHash:`${hmacKeys.newKeyVersion}:${recivedHmac}`});
        if (!saveLogin) {
            return errorResponse(reply);
        };
        const accessToken = jwt.sign({devicehash:`${hmacKeys.newKeyVersion}:${recivedHmac}`,userId:userId},accessTokenKey[accessTokenKey.newKeyVersion],{expiresIn:"30d"});
        const refreshToken = jwt.sign({devicehash:`${hmacKeys.newKeyVersion}:${recivedHmac}`,name:data.name,profileImage:data.profile,userId:userId},refreshTokenKey[refreshTokenKey.newKeyVersion],{expiresIn:"180d"});
        return customResponse(reply,200,"sucessfully logedin",{loggedIn:true,accessToken:`${accessTokenKey.newKeyVersion}:${accessToken}`,refreshToken:`${refreshTokenKey.newKeyVersion}:${refreshToken}`});
    } catch (error) {
        console.log("error in the main handle function of the verify otp login",error.message);
        return errorResponse(reply);
    }
}