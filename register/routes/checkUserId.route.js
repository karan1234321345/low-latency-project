import {checkUserIdmiddleware} from "../middleware/checkUserid.middleware.js";
import {handleCheckUserId} from "../controller/checkUserId.controller.js";
export function checkUserIdRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:checkUserIdmiddleware,
            handler:handleCheckUserId
        }
    );
};
