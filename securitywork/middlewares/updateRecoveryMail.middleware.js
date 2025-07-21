// import {insufficientDataResponse,errorResponse} from "../helpers/Response.helper.js";
// import {checkBody} from "../helpers/checkBody.helper.js";
// import {sanatizeInput} from "../helpers/sanatizeInput.helper.js";



// export function updateRecoveryMailMiddleware(req,reply,done) {
//     try {
//         if (!checkBody(req)) {
//             return insufficientDataResponse(reply);
//         };
//         const {recoveryMail} = req.body;
//         const sanatizedData = {recoveryMail:sanatizeInput(recoveryMail)};
//         if (!sanatizedData.recoveryMail) {
//             return insufficientDataResponse(reply);
//         };
//         req.body = sanatizedData;
//         return done();
//     } catch (error) {
//         console.log("error in the main middleware functionof the update dob",error.message);
//         return errorResponse(reply);
//     };
// };