import {verifyOtpLoginMiddleware} from "../middlewares/verifyOtpLogin.middleware.js";
import {handlerVerifyOtpLogin} from "../controllers/verifyOtpLogin.controller.js";

export function verifyOtpLoginRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:verifyOtpLoginMiddleware,
            handler:handlerVerifyOtpLogin,
        }
    )
}