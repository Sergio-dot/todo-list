require('dotenv').config();
const amqp = require('amqplib');

const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

async function publishItemToQueue(item) {
  const queueName = 'itemQueue';

  try {
    // Establish connection with RabbitMQ
    const connection = await amqp.connect(url);

    // Create channel
    const channel = await connection.createChannel();

    // Assert queue
    await channel.assertQueue(queueName, { durable: false });

    // Send the item object as JSON to the queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(item)));
    console.log(`Item sent to RabbitMQ: ${JSON.stringify(item)}`);

    // Close connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error while sending item to queue: ', error);
  }
}

async function publishUpdateToQueue(message) {
  const queueName = 'itemQueue';

  try {
    // Establish connection with RabbitMQ
    const connection = await amqp.connect(url);

    // Create channel
    const channel = await connection.createChannel();

    // Assert queue
    await channel.assertQueue(queueName, { durable: false });

    // Send message as JSON to the queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Item sent to RabbitMQ: ${JSON.stringify(message)}`);

    // Close connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error while sending message to queue: ', error);
  }
}

async function publishDeleteToQueue(message) {
  const queueName = 'itemQueue';

  try {
    // Establish connection with RabbitMQ
    const connection = await amqp.connect(url);

    // Create channel
    const channel = await connection.createChannel();

    // Assert queue
    await channel.assertQueue(queueName, { durable: false });

    // Send message as JSON to the queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Item sent to RabbitMQ: ${JSON.stringify(message)}`);

    // Close connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error while sending message to queue: ', error);
  }
}

async function publishMarkToQueue(message) {
  const queueName = 'itemQueue';

  try {
    // Establish connection with RabbitMQ
    const connection = await amqp.connect(url);

    // Create channel
    const channel = await connection.createChannel();

    // Assert queue
    await channel.assertQueue(queueName, { durable: false });

    // Send message as JSON to the queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Item sent to RabbitMQ: ${JSON.stringify(message)}`);

    // Close connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error while sending message to queue: ', error);
  }
}

module.exports = {
  publishItemToQueue,
  publishUpdateToQueue,
  publishDeleteToQueue,
  publishMarkToQueue,
};
