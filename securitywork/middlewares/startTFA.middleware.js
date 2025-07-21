import {errorResponse,insufficientDataResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";


export function startTFAMiddleware(req,reply,done) {
    try {
        if (!checkBody(reply)) {
            return insufficientDataResponse(reply);
        };
        const {securityKey,deviceFingerPrint} = req.body;
        const sanatizedData = {securityKey,deviceFingerPrint};
        if (!sanatizedData.securityKey|| !sanatizedData.deviceFingerPrint) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the main middleware function of the start two factor authentication",error.message);
        return errorResponse(reply);
    };
};