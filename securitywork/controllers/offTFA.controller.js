import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {getDataCache} from "../config/redis.config.js";
import {generateOtp} from "../helpers/generateOtp.helper.js";
import {sendOtpProduceMessage} from "../utils/sendOtp.util.js";
import {User} from "../schema/user.modle.js";

export async function handleOffTFA(req,reply) {
    try {
        const dataCache = getDataCache();
        const {userId} = req.body;
        let data = await dataCache.get(`user:${userId}`);
        if (!data) {
            data = await User.findOne({userId});
            if (!data) {
                return customResponse(reply,404,"user not found",{updated:false});
            };
        };
        if (typeof data !== "object") {
            data = JSON.parse(data);
        }
        const otp = generateOtp();
        const sendOtp = sendOtpProduceMessage(data.mail,"twa",otp);
        if (!sendOtp) {
            return errorResponse(reply);
        };
        await dataCache.set(`tfa:${userId}`,JSON.stringify({tfa:true,hashedSecurityKey:null}),"EX",300);
        return customResponse(reply,200,"sucess",{otpSent:true});
    } catch (error) {
        console.log("error in the main handle function of the start two factor authentication",error.message);
        return errorResponse(reply);
    };
};