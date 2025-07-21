import { Kafka } from 'kafkajs';
import {config} from "dotenv";
config();
import {sendEmail} from "./sendOtp.js";

const kafkaBrocker = process.env.KAFKA_BROKER || "localhost:19092";
const kafkaClientId = process.env.KAFKA_CLIENT_ID || "send-otp-producer";
const kafka = new Kafka({
    clientId: `${kafkaClientId}`,
    brokers: [`${kafkaBrocker}`], 
});

const consumer = kafka.consumer({groupId:"my-group"});

(async ()=> {
    try {
        await consumer.connect();
        await consumer.subscribe({topic:"send-otp",fromBeginning:true})
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const jsondata = JSON.parse(message.value.toString());
                await sendEmail(jsondata.to,jsondata.subject,jsondata.data);
            }
        })
    } catch (error) {
        
    }
}
)();