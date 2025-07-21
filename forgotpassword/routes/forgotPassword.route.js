import {forgotPasswordMiddleware} from "../middlewares/forgotPassword.middleware.js";
import {handleForgotPassword} from "../controllers/forgotPassword.controller.js";

export function forgotPasswordRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:forgotPasswordMiddleware,
            handler:handleForgotPassword,
        }
    )
}