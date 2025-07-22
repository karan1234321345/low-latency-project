import {User} from "../schema/user.modle.js";
import {LoginDetail} from "../schema/loginDetail.modle.js";
import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {getDataCache} from "../config/redis.config.js";

export async function handleGetAllPersonalDetail(req,reply) {
    try {
        const dataCache = getDataCache();
        const {userId} = req.body;
        let user = await dataCache.get(`user:${userId}`);
        if (!user) {
            user = await User.findOne({userId});
            if (!user) {
                return customResponse(reply,404,"user not found",{userDetail:{}});
            };
        };
        if (typeof user === "string") {
            user = JSON.parse(user);
        };
        const login = await LoginDetail.find({userId});
        const userData = {
            userId:userId,
            name: user.name,
            mail:user.mail,
            dob:user.dob,
        };
        let loginData;
        if (login.length !== 0) {
            loginData = login.map((detail)=>{return{loggedInAt:detail.createdAt,location:detail.location}});
        }

        return customResponse(reply,200,"sucess",{userData,loginData});
    } catch (error) {
        console.log("error in the main handle function of the get all personal detail",error.message);
        return errorResponse(reply);
    }
}