import {mongoDbUrl} from "../grpc/worker/mongoDbUrl.worker.js";
import {preloadHotKeys} from "../grpc/worker/preloadHotKeys.worker.js";
import {redisConfig} from "../grpc/worker/redisConfig.worker.js";
import {kafkaConfig} from "../grpc/worker/kafkaConfig.worker.js";
import {variable} from "./main.env.js";

export async function loadEnv() {
    try {
        const preloadhotkeys = await preloadHotKeys();
        const mongodburl = await mongoDbUrl();
        const redisconfig = await redisConfig();
        const kafkaconfig = await kafkaConfig();
        if (!preloadhotkeys || !mongodburl || !redisconfig || !kafkaconfig) {
            console.log("configuration loading problem");
            process.exit(-1);
        };
        const newrefreshtokenkey = preloadhotkeys.newRefreshTokenKey.split(":");
        const oldrefreshtokenkey = preloadhotkeys.oldRefreshTokenKey.split(":");
        const newaccesstokenkey = preloadhotkeys.newAccessTokenKey.split(":");
        const oldaccesstokenkey = preloadhotkeys.oldAccessTokenKey.split(":");
        const newhmackey = preloadhotkeys.newHmacSecretKey.split(":");
        const oldhmackey = preloadhotkeys.oldHmacSecretKey.split(":");
        variable.accessTokenKeys.newKeyVersion = newaccesstokenkey[0];
        variable.accessTokenKeys.oldKeyVersion = oldaccesstokenkey[0];
        variable.accessTokenKeys[newaccesstokenkey[0]] = newaccesstokenkey[1];
        variable.accessTokenKeys[oldaccesstokenkey[0]] = oldaccesstokenkey[1];
        variable.hmacKeys.newKeyVersion = newhmackey[0];
        variable.hmacKeys.oldKeyVersion = oldhmackey[0];
        variable.hmacKeys[newhmackey[0]] = newhmackey[1];
        variable.hmacKeys[oldhmackey[0]] = oldhmackey[1];
        variable.refreshTokenKeys.newKeyVersion = newrefreshtokenkey[0];
        variable.refreshTokenKeys.oldKeyVersion = oldrefreshtokenkey[0];
        variable.refreshTokenKeys[newrefreshtokenkey[0]] = newrefreshtokenkey[1];
        variable.refreshTokenKeys[oldrefreshtokenkey[0]] = oldrefreshtokenkey[1];
        variable.mongoDbUrl = mongodburl.url;
        variable.redisConfig = redisconfig;
        variable.kafkaConfig = kafkaconfig;
        return true;
    } catch (error) {
        console.log("error in the main handle function of the load enviroment variable", error.message);
        process.exit(-1);
    }
}