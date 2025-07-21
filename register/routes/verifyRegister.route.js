import {verifyOtpRegisterMiddleware} from "../middleware/verifyOtpRegister.middleware.js";
import {handleVerifyOtpRegister} from "../controller/verifyOtpRegister.controller.js";


export function verifyOtpRegisterRoute(fastify,opts) {
    fastify.route(
        {
            method:"POST",
            url:"/",
            schema:{},
            preHandler:verifyOtpRegisterMiddleware,
            handler:handleVerifyOtpRegister,
        }
    );
};