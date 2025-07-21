import {insufficientDataResponse,errorResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";



export function verifyTWAOtpMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {otp,deviceFingerPrint} = req.body;
        const sanatizedData = {otp:sanatizeInput(otp),deviceFingerPrint};
        if (!sanatizedData.otp||!sanatizedData.deviceFingerPrint) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the main middleware functionof the update dob",error.message);
        return errorResponse(reply);
    }
}