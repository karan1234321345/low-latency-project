import { Kafka } from 'kafkajs';
import {config} from "dotenv";
config();

const kafkaBrocker = process.env.KAFKA_BROKER || "localhost:19092";
const kafkaClientId = process.env.KAFKA_CLIENT_ID || "send-otp-producer";
export const kafka = new Kafka({
    clientId: `${kafkaClientId}`,
    brokers: [`${kafkaBrocker}`], 
});

