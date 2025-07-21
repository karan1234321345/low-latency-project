import {updateNameMiddleware} from "../middlewares/updateName.middleware.js";
import {handleUpdateName} from "../controllers/updateName.controller.js";
import {authenticateApi} from "../utils/autenticate.util.js";

export function updateNameRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:[updateNameMiddleware,authenticateApi],
            handler:handleUpdateName,
        }
    )
}