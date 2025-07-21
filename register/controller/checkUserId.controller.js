import {customResponse,errorResponse, successResponse} from "../helpers/Response.helper.js";
import {User} from "../schema/user.modle.js";
import {getDataCache} from "../config/redis.config.js";
import {hash} from "../security/hashOnHmac.security.js";
import {verifyHmac} from "../security/verifyOnHmac.security.js";
import {variable} from "../env/main.env.js";
export async function handleCheckUserId(req,reply) {
    try {
        let hmacKeys = variable.hmacKeys;
        const dataCache = getDataCache();
        const {userId,deviceFingerPrint} = req.body;
        const tempData = await dataCache.get(`temp:${userId}`);
        const registerData = await dataCache.get(`register:${userId}`);
        const userData = await dataCache.get(`user:${userId}`);
        const stringData = tempData || registerData;
        let devicehash;
        if (userData) {
            return customResponse(reply,200,"userId is unavailable",{available:false});
        };
        if (stringData) {
            const data = JSON.parse(stringData);
            const deviceData = data.devicehash.split(":");
            const keyVersion = deviceData[0];
            const recivedHmac = deviceData[1];
            let key;
            if (keyVersion !== hmacKeys.newKeyVersion && keyVersion !== hmacKeys.oldKeyVersion) {
                return customResponse(reply,402,"device hash version is invalid",{});                
            };
            if (keyVersion === hmacKeys.newKeyVersion) {
                key = hmacKeys[hmacKeys.newKeyVersion];
            };
            if (keyVersion === hmacKeys.oldKeyVersion) {
                key = hmacKeys[hmacKeys.oldKeyVersion]
            };
            const compare = verifyHmac(key,deviceFingerPrint,recivedHmac);
            if (!compare) {
                return customResponse(reply,200,"userid is unavailable",{available:false})
            };
            if (registerData) {
                dataCache.del(`register:${userId}`);
            };
            if (keyVersion !== hmacKeys.newKeyVersion) {
              devicehash = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);  
            };
            await dataCache.set(`temp:${userId}`,JSON.stringify({userId,devicehash: `${hmacKeys.newKeyVersion}:${devicehash}`}),"EX",300);
        };
        const user = await User.findOne({userId});
        if (user) {
            return customResponse(reply,200,"userId is unavailable",{available:false});
        };
        devicehash = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
        await dataCache.set(`temp:${userId}`,JSON.stringify({devicehash:`${hmacKeys.newKeyVersion}:${devicehash}`}),"EX",300);
        return customResponse(reply,200,"userId is available",{available:true});
    } catch (error) {
        console.log("error in the main handle function of the check user id",error.message);
        return errorResponse(reply);
    }
};