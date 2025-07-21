import {getAllPersonalDetailMiddleware} from "../middlewares/getAllPersonalDetail.middleware.js";
import {handleGetAllPersonalDetail} from "../controllers/getAllPersonalDetail.controller.js";
import {authenticateApi} from "../utils/autenticate.util.js";

export function getAllPersonalDetailRoute(fastify,opts) {
    fastify.route(
        {
            method:"GET",
            url:"/",
            schema:{},
            preHandler:[getAllPersonalDetailMiddleware,authenticateApi],
            handler:handleGetAllPersonalDetail,
        }
    );
};