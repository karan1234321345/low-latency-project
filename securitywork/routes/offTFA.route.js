import {offTFAMiddleware} from "../middlewares/offTFA.middleware.js";
import {handleOffTFA} from "../controllers/offTFA.controller.js";
import {authenticateApi} from "../utils/autenticate.util.js";

export function offTFARoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:[offTFAMiddleware,authenticateApi],
            handler:handleOffTFA,
        }
    );
};