import {errorResponse,insufficientDataResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";


export function verifyOtpForgotPasswordMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {userId,otp,password,deviceFingerPrint} = req.body;
        const sanatizedData = {
            userId: sanatizeInput(userId),
            password: password.trim(),
            otp: sanatizeInput(otp),
            deviceFingerPrint: deviceFingerPrint,
        };
        if (!sanatizedData.password || !sanatizedData.userId || !sanatizedData.otp) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the middleware function of the forgot password",error.message);
        return errorResponse(reply);
    };
};