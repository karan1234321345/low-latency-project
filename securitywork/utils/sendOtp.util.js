import { kafkaProducer } from "../config/kafka.config.js";


export async function sendOtpProduceMessage(to, subject, data) {
    try {
        const producer = kafkaProducer();
        await producer.send({
            topic: 'send-otp',
            messages: [
                { value: JSON.stringify({to, subject, data}) }
            ],
        });
        return true;
    } catch (error) {
        console.log("error in the send otp produce message functionm", error.message);
        return false;
    }
}