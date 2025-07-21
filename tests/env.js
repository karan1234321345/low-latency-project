import {Kafka} from "kafkajs"

const kafka = new Kafka({
  clientId: 'mongo-cdc-consumer',
  brokers: ['localhost:19092'], // 👈 Make sure redpanda exposed this port
});

const consumer = kafka.consumer({ groupId: 'mongo-consumer-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'chilandu.users', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(JSON.parse(message.value));
    },
  });
}

run().catch(console.error);
