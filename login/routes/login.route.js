import {loginMidleware} from "../middlewares/login.middleware.js";
import {handleLogin} from "../controllers/login.controller.js";


export function loginRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:loginMidleware,
            handler:handleLogin,
        },
    );
};