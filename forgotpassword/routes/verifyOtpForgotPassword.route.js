import {verifyOtpForgotPasswordMiddleware} from "../middlewares/verifyOtpForgotPassword.midleware.js";
import {handleVerifyOtpForgotPassword} from "../controllers/verifyOtpForgotPassword.controller.js";

export function verifyOtpForgotPasswordRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:verifyOtpForgotPasswordMiddleware,
            handler:handleVerifyOtpForgotPassword,
        }
    );
};