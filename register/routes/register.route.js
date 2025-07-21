import {registerMiddleware} from "../middleware/register.middleware.js";
import {handleRegister} from "../controller/register.controller.js";


export function registerRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:registerMiddleware,
            handler:handleRegister,
        }
    )
}