import {verifyTWAOtpMiddleware} from "../middlewares/verifyTFAOtp.middleware.js";
import {handleVerifyTFAOtp} from "../controllers/verifyTFAOtp.controller.js";
import {authenticateApi} from "../utils/autenticate.util.js";

export function verifyTFAOtpRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:[verifyTWAOtpMiddleware,authenticateApi],
            handler:handleVerifyTFAOtp,
        }
    );
};