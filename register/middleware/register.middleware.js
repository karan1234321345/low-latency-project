import {errorResponse,insufficientDataResponse} from "../helpers/Response.helper.js";
import {checkBody} from "../helpers/checkBody.helper.js";
import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";


export function registerMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {userId,name,mail,password,dob,deviceFingerPrint} = req.body;
        if (!password) {
            return insufficientDataResponse(reply)
        }
        const sanatizedData = {
            userId: sanatizeInput(userId),
            name: sanatizeInput(name),
            mail: sanatizeInput(mail),
            password: password.trim(),
            dob: sanatizeInput(dob),
            deviceFingerPrint: deviceFingerPrint,
        };
        if (
            !sanatizedData.dob ||
            !sanatizedData.mail ||
            !sanatizedData.name ||
            !sanatizedData.password ||
            !sanatizedData.userId ||
            !sanatizedData.deviceFingerPrint
        ) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the register middleware",error.message);
        return errorResponse(reply);
    };
};