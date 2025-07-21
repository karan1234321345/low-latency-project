import {startTFAMiddleware} from "../middlewares/startTFA.middleware.js";
import {handleStartTFA} from "../controllers/startTFA.controller.js";
import {authenticateApi} from "../utils/autenticate.util.js";

export function startTFARoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:[startTFAMiddleware,authenticateApi],
            handler:handleStartTFA,
        }
    );
};