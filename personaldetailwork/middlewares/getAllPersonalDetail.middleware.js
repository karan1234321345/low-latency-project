import {insufficientDataResponse,errorResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";



export function getAllPersonalDetailMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {deviceFingerPrint} = req.body;
        const sanatizedData = {deviceFingerPrint};
        if (!sanatizedData.deviceFingerPrint) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the main middleware functionof the update dob",error.message);
        return errorResponse(reply);
    }
}