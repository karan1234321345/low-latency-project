import { errorResponse, customResponse } from "../helpers/Response.helper.js";
import {dataCache} from "../config/redis.config.js";
import {hash} from "../security/hashOnHmac.security.js";
import {findLocation} from "../utils/findLocation.util.js";
import {config} from "dotenv";
import jwt from "jsonwebtoken";
import {verifyPassword} from "../grpc/worker/verifyPassword.worker.js"
import {LoginDetail} from "../schema/loginDetail.modle.js";
import { verifyHmac } from "../security/verifyOnHmac.security.js";
config();
const hmacKeys = {
    newKeyVersion:"v2",
    oldKeyVersion:"v1",
    v2:"helloBhai",
    v1:"helloBhai",
};

const accessTokenKey = {
    newKeyVersion:"v2",
    oldKeyVersion:"v1",
    v2:"helloBhai",
    v1:"helloBhai",
};

const refreshTokenKey = {
    newKeyVersion:"v2",
    oldKeyVersion:"v1",
    v2:"helloBhai",
    v1:"helloBhai",
};

export async function handleTfa(req, reply) {
    try {
        const {userId,securityKey,deviceFingerPrint} = req.body;
        const stringData = await dataCache.get(`login:${userId}`);
        if (!stringData) {
            return customResponse(reply,404,"login expired or user not found",{loggedIn:false});
        };
        const data = JSON.parse(stringData);
        const deviceData = data.devicehash.split(":");
        const keyVersion = deviceData[0];
        let recivedHmac = deviceData[1];
        let key;
        if (keyVersion !== hmacKeys.newKeyVersion && keyVersion !== hmacKeys.oldKeyVersion) {
            return customResponse(reply,403,"invalid device hash version",{loggedIn:false});
        };
        if (keyVersion === hmacKeys.oldKeyVersion) {
            key = hmacKeys[hmacKeys.oldKeyVersion];
        } else {
            key = hmacKeys[hmacKeys.newKeyVersion];
        };
        const compare = verifyHmac(key,deviceFingerPrint,recivedHmac);
        if (!compare) {
            return customResponse(reply,402,"invalid device",{loggedIn:false});
        };
        const compareSecurityKey = await verifyPassword(data.hashedSecurityKey,securityKey);
        if (!compareSecurityKey) {
            return customResponse(reply,200,"key is invalid",{loggedIn:false});
        };
        if (keyVersion !== hmacKeys.newKeyVersion) {
            recivedHmac = hash(deviceFingerPrint,hmacKeys[hmacKeys.newKeyVersion]);
        }
        const ip = req.ip === '::1' || req.ip === '127.0.0.1' ? '8.8.8.8' : req.ip; // fallback to public IP for local testing
        const location = await findLocation(ip);
        if (!location) {
            return errorResponse(reply);
        };
        const saveLogin = await LoginDetail.create({ userId, ipAddress: req.ip, location, deviceHash: `${hmacKeys.newKeyVersion}:${recivedHmac}` });
        if (!saveLogin) {
            return errorResponse(reply);
        };
        const accessToken = jwt.sign({ devicehash:`${hmacKeys.newKeyVersion}:${recivedHmac}`, userId: userId }, accessTokenKey[accessTokenKey.newKeyVersion], { expiresIn: "30d" });
        const refreshToken = jwt.sign({ devicehash:`${hmacKeys.newKeyVersion}:${recivedHmac}`, name: data.name, profileImage: data.profile, userId: userId }, refreshTokenKey[refreshTokenKey.newKeyVersion], { expiresIn: "180d" });
        return customResponse(reply, 200, "sucessfully logedin", { loggedIn: true, accessToken:`${accessTokenKey.newKeyVersion}:${accessToken}`, refreshToken:`${refreshTokenKey.newKeyVersion}:${refreshToken}` });
    } catch (error) {
        console.log("error in tha main handle function of the handle tfa",error.message);
        return errorResponse(reply);
    }
}