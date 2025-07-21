import {updateDobRoute} from "./updateDob.route.js";
import {updateNameRoute} from "./updateName.route.js";
import {upateProfileImageRoute} from "./updateProfileImage.route.js";


export function masterRoute(fastify,opts) {
    fastify.register(updateDobRoute,{prefix:"/updatedob"});
    fastify.register(updateNameRoute,{prefix:"/updatename"});
    fastify.register(upateProfileImageRoute,{prefix:"/updateprofileimage"});
};