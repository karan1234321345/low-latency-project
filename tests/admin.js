// admin.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'admin-client',
  brokers: ['localhost:19092'], // Use 'redpanda:9092' if running inside a container
});

const admin = kafka.admin();

const run = async () => {
  try {
    await admin.connect();

    const topics = await admin.listTopics();
    console.log(`🧠 Topics in cluster:\n`, topics);

    await admin.disconnect();
  } catch (error) {
    console.error('❌ Error listing topics:', error);
  }
};

run();
