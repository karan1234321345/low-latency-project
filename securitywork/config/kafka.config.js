import { Kafka } from 'kafkajs';

let kafkaProducerCache;

export async function kafkaConnect(configuration) {
    try {
        if (!Array.isArray(configuration.brokers)) {
            if (typeof configuration.brokers === "string" && configuration.brokers.length > 0) {
                configuration.brokers = [configuration.brokers];
            } else {
                throw new Error("Kafka brokers configuration is invalid or missing");
            }
        }
        const kafkaClient = new Kafka(configuration);
        kafkaProducerCache = kafkaClient.producer();
        await kafkaProducerCache.connect();
        console.log("kafka connected");
    } catch (error) {
        console.log("error in the kafka configurattion", error.message);
        process.exit(-1);
    }
};

export function kafkaProducer() {
    return kafkaProducerCache;
}
