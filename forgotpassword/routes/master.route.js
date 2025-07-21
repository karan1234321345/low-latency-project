import {forgotPasswordRoute} from "./forgotPassword.route.js";
import {verifyOtpForgotPasswordRoute} from "./verifyOtpForgotPassword.route.js";


export function masterRoute(fastify,opts) {
    fastify.register(forgotPasswordRoute,{prefix:"/forgotpassword"});
    fastify.register(verifyOtpForgotPasswordRoute,{prefix:"/verifyotpforgotpassword"});
};