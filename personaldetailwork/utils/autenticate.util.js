import {checkToken} from "../helpers/checkToken.helper.js";
import {verifyToken} from "../helpers/verifyToken.helper.js";
import {errorResponse,customResponse} from "../helpers/Response.helper.js";
import {config} from "dotenv";
import {verifyHmac} from "../security/verifyOnHmac.security.js";
config();
const accessTokenKey = process.env.ACCESS_TOKEN_KEY || "helloBhai";
const hmacSecretKey = process.env.HMAC_SECRET_KEY || "helloBhai";

export function authenticateApi(req,reply,done) {
    try {
        const token = checkToken(req);
        if (!token) {
            return customResponse(reply,401,"invalid token or token not found",{});
        };
        const data = verifyToken(token,accessTokenKey);
        if (!data) {
            return customResponse(reply,403,"token is invalid");
        };
        const compare = verifyHmac(hmacSecretKey,req.body.deviceFingerPrint,data.devicehash);
        if (!compare) {
            return customResponse(reply,402,"unauthorized",{});
        };
        req.body.userId = data.userId;
        return done();        
    } catch (error) {
        console.log("error in teh authenticateApi middleware function",error.message);
        return errorResponse(reply);
    };
};