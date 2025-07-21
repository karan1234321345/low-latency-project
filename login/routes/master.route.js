import {loginRoute} from "./login.route.js";
import {verifyOtpLoginRoute} from "./verifyOtpLogin.route.js";

export function masterRoute(fastify,opts) {
    fastify.register(loginRoute,{prefix:"/login"});
    fastify.register(verifyOtpLoginRoute,{prefix:"/verifyotplogin"})
};