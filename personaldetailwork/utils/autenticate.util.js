import {extractTokenFromBearer} from "./extractToken.util.js";
import {verifyToken} from "../helpers/verifyToken.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {errorResponse,customResponse,insufficientDataResponse} from "../helpers/Response.helper.js";
import {variable} from "../env/main.env.js";
import {verifyDevicehash} from "../helpers/verifyDevicehash.helper.js";

export function authenticateApi(req,reply,done) {
    try {
        const accessTokenKeys = variable.accessTokenKeys;
        const hmacKeys = variable.hmacKeys;
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {deviceFingerPrint} = req.body;
        if (!deviceFingerPrint) {
            return insufficientDataResponse(reply);
        };
        const bearerToken = req.headers.authorization;
        const token = extractTokenFromBearer(bearerToken);
        if (!token) {
            return customResponse(reply,400,"token not found",{});
        };
        const tokenData = verifyToken(token,accessTokenKeys);
        if (!tokenData.status) {
            return customResponse(reply,400,tokenData.message,{});
        };
        const data = tokenData.data;
        const verifyDevice = verifyDevicehash(deviceFingerPrint,tokenData.devicehash,hmacKeys);
        if (!verifyDevice.status) {
            return customResponse(reply,400,verifyDevice.message,{})
        };
        req.body.userId = data.userId;
        return done();        
    } catch (error) {
        console.log("error in teh authenticateApi middleware function",error.message);
        return errorResponse(reply);
    };
};