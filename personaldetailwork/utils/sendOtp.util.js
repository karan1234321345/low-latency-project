// import { kafka } from "../config/kafka.config.js";

// const producer = kafka.producer();

// export async function sendOtpProduceMessage(to, subject, data) {
//     try {
//         await producer.connect();
//         await producer.send({
//             topic: 'send-otp',
//             messages: [
//                 { value: JSON.stringify({to, subject, data}) }
//             ],
//         });
//         return true;
//     } catch (error) {
//         console.log("error in the send otp produce message functionm", error.message);
//         return false;
//     }
// }