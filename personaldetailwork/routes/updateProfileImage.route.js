import {upateProfileImageMiddleware} from "../middlewares/updateProfileImage.middleware.js";
import {handleUpdateProfileImageUrl} from "../controllers/updateProfileImage.controller.js";
import {authenticateApi} from "../utils/autenticate.util.js";

export function upateProfileImageRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:[upateProfileImageMiddleware,authenticateApi],
            handler:handleUpdateProfileImageUrl,
        }
    );
};