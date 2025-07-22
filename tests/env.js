import {Kafka} from "kafkajs"

const kafka = new Kafka({
  clientId: 'mongo-cdc-consumer',
  brokers: ['localhost:19092'], // 👈 Make sure redpanda exposed this port
});

const consumer = kafka.consumer({ groupId: 'mongo-consumer-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test.users', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(message.value.toString());
    },
  });
}

run().catch(console.error);
