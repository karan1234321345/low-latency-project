import {registerRoute} from "./register.route.js";
import {verifyOtpRegisterRoute} from "./verifyRegister.route.js";
import {checkUserIdRoute} from "./checkUserId.route.js";


export function masterRoute(fastify,opts) {
    fastify.register(registerRoute,{prefix:"/register"});
    fastify.register(verifyOtpRegisterRoute,{prefix:"/verifyotpregister"});
    fastify.register(checkUserIdRoute,{prefix:"/checkuseridregister"});
};