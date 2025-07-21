import { errorResponse ,insufficientDataResponse} from "../helpers/Response.helper.js";
import { checkBody } from "../helpers/checkBody.helper.js";


export function upateProfileImageMiddleware(req,reply,done) {
    try {
        if (!checkBody(req)) {
            return insufficientDataResponse(reply);
        };
        const {profileImageUrl,deviceFingerPrint} = req.body;
        const sanatizedData = {profileImageUrl,deviceFingerPrint};
        if (!sanatizedData.deviceFingerPrint || !sanatizedData.profileImageUrl) {
            return insufficientDataResponse(reply);
        };
        req.body = sanatizedData;
        return done();
    } catch (error) {
        console.log("error in the middleware function of the update profile image middleware",error.message);
        return errorResponse(reply);
    }
}