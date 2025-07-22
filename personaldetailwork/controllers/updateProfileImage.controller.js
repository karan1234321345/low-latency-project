import { errorResponse, customResponse } from "../helpers/Response.helper.js";
import { User } from "../schema/user.modle.js";
import {getDataCache} from "../config/redis.config.js";
export async function handleUpdateProfileImageUrl(req, reply) {
    try {
        const dataCache = getDataCache();
        const { userId, profileImageUrl } = req.body;
        const userIndb = await User.findOneAndUpdate({ userId }, { $set: { profileImage: profileImageUrl } }, { new: true });
        if (!userIndb) {
            return customResponse(reply, 404, "user not found", { updated: false });
        };
        await dataCache.set(`user:${userId}`, JSON.stringify(userIndb));
        return customResponse(reply, 200, "updated", { updated: true });
    } catch (error) {
        console.log("error in teh main function of the update dob", error.message);
        return errorResponse(reply);
    };
};