import {updateDobMiddleware} from "../middlewares/updateDob.middleware.js";
import {handleUpdateDob} from "../controllers/updateDob.controller.js";
import {authenticateApi} from "../utils/autenticate.util.js";

export function updateDobRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:[updateDobMiddleware,authenticateApi],
            handler:handleUpdateDob,
        }
    )
}