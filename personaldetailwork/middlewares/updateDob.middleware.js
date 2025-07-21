import {insufficientDataResponse,errorResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";



export function updateDobMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {dob,deviceFingerPrint} = req.body;
        const sanatizedData = {dob:sanatizeInput(dob),deviceFingerPrint};
        if (!sanatizedData.dob||!sanatizedData.deviceFingerPrint) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the main middleware functionof the update dob",error.message);
        return errorResponse(reply);
    }
}