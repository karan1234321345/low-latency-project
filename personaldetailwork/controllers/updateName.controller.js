import { errorResponse, customResponse } from "../helpers/Response.helper.js";
import { User } from "../schema/user.modle.js";
import {getDataCache} from "../config/redis.config.js";
export async function handleUpdateName(req, reply) {
    try {
        const dataCache = getDataCache();
        const { userId, name } = req.body;
        const userIndb = await User.findOneAndUpdate({ userId }, { $set: { name: name } }, { new: true });
        if (!userIndb) {
            return customResponse(reply, 404, "user not found", { updated: false });
        };
        await dataCache.set(`user:${userId}`, JSON.stringify(userIndb));
        return customResponse(reply, 200, "updated", { updated: true });
    } catch (error) {
        console.log("error in teh main function of the update dob", error.message);
        return errorResponse(reply);
    }
}