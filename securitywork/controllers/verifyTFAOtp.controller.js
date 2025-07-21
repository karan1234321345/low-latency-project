import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {dataCache} from "../config/redis.config.js";
import {User} from "../schema/user.modle.js";

export async function handleVerifyTFAOtp(req,reply) {
    try {
        const {userId,otp} = req.body;
        const stringData = await dataCache.get(`twa:${userId}`);
        if (!stringData) {
            return customResponse(reply,200,"otp expired or user not found",{verified:false});
        };
        const data = JSON.parse(stringData);
        if (data.otp !== otp) {
            return customResponse(reply,200,"wrong otp is entered",{verified:false});
        };
        const update = await User.findOneAndUpdate({userId},{$set:{hashedSecurityKey:data.hashedSecurityKey,tfa:data.tfa}},{new:true});
        await dataCache.set(`user:${userId}`,JSON.stringify(update));
        return customResponse(reply,200,"sucess",{verified:true});
    } catch (error) {
        console.log("error in the main middleware function of the verify tfa otp",error.message);
        return errorResponse(reply);
    }
}