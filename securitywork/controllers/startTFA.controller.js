import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {dataCache} from "../config/redis.config.js";
import {generateOtp} from "../helpers/generateOtp.helper.js";
import {sendOtpProduceMessage} from "../utils/sendOtp.util.js";
import argon2 from "argon2";
import {User} from "../schema/user.modle.js";

export async function handleStartTFA(req,reply) {
    try {
        const {userId,securityKey} = req.body;
        let data = await dataCache.get(`user:${userId}`);
        if (!data) {
            data = await User.findOne({userId});
            if (!data) {
                return customResponse(reply,404,"user not found",{updated:false});
            };
        };
        data = JSON.parse(data);
        const otp = generateOtp();
        const hashedSecurityKey = await argon2.hash(securityKey);
        const sendOtp = sendOtpProduceMessage(data.mail,"twa",otp);
        if (!sendOtp) {
            return errorResponse(reply);
        };
        await dataCache.set(`tfa:${userId}`,JSON.stringify({tfa:true,hashedSecurityKey:hashedSecurityKey}),"EX",300);
        return customResponse(reply,200,"sucess",{otpSent:true});
    } catch (error) {
        console.log("error in the main handle function of the start two factor authentication",error.message);
        return errorResponse(reply);
    }
}