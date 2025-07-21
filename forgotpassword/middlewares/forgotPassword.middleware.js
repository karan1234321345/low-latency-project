import {errorResponse,insufficientDataResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";


export function forgotPasswordMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {userId,deviceFingerPrint} = req.body;
        const sanatizedData = {userId: sanatizeInput(userId),deviceFingerPrint};
        if (!sanatizedData.userId || !sanatizedData.deviceFingerPrint) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the middleware function of the find user id",error.message);
        return errorResponse(reply);
    }
}