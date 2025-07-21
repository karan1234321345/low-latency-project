import { Kafka } from 'kafkajs';
import {config} from "dotenv";
config();

const kafkaBrocker = process.env.KAFKA_BROKER || "localhost:19092";
const kafkaClientId = process.env.KAFKA_CLIENT_ID || "send-otp-producer";
const kafka = new Kafka({
    clientId: `${kafkaClientId}`,
    brokers: [`${kafkaBrocker}`], 
});
const topic = "send-otp";

const admin = kafka.admin();



async function sendOtp() {
    try {
        await admin.connect();
        await admin.createTopics({
            topics: [
                {
                    topic: "send-otp",
                    numPartitions: 2,
                    replicationFactor: 1, // Change to 1 if you have only one broker
                }
            ]
        });
        await admin.disconnect();
        console.log("Topic creation attempted.");
    } catch (error) {
        console.error("Error creating topic:", error.message);
    }
};
sendOtp();