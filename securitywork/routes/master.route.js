import {offTFARoute} from "./offTFA.route.js";
import {startTFARoute} from "./startTWF.route.js";
import {verifyTFAOtpRoute} from "./verifyTFAOtp.route.js";


export function masterRoute(fastify,opts) {
    fastify.register(offTFARoute,{prefix:"/offtwf"});
    fastify.register(startTFARoute,{prefix:"/starttfa"});
    fastify.register(verifyTFAOtpRoute,{prefix:"/verifytfa"});
};