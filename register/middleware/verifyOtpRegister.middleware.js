import {errorResponse,insufficientDataResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";


export function verifyOtpRegisterMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {userId,otp,deviceFingerPrint} = req.body;
        const sanatizedData = {
            userId: sanatizeInput(userId),
            otp: sanatizeInput(otp),
            deviceFingerPrint: deviceFingerPrint,
        };
        if (!sanatizedData.deviceFingerPrint || !sanatizedData.otp || !sanatizedData.userId) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the middleware function of thr verify otp register",error.message);
        return errorResponse(reply);
    }
}