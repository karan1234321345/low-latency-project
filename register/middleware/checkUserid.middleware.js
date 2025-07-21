import {errorResponse,insufficientDataResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";


export async function checkUserIdmiddleware(req, reply, done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const { userId,deviceFingerPrint} = req.body;
        const sanitizedData = {userId: sanatizeInput(userId),deviceFingerPrint};
        if (!sanitizedData.userId || !sanitizedData.deviceFingerPrint) {
            return insufficientDataResponse(reply);
        };
        req.body = sanitizedData;
        done();
    } catch (error) {
        console.log("error in the check user id midleware", error.message);
        return errorResponse(reply);
    };
};