const amqp = require('amqplib');
const Item = require('../models/item.model');
const pool = require('../modules/db.module');

async function consumeItems() {
  const queueName = 'itemQueue';

  try {
    // Establish connection with RabbitMQ
    const connection = await amqp.connect('amqp://rabbitmq:5672');

    // Create channel
    const channel = await connection.createChannel();

    // Assert queue
    await channel.assertQueue(queueName, { durable: false });
    console.log(
      ` [*] Waiting for messages in ${queueName}. To exit press CTRL+C`
    );

    // Message handler
    channel.consume(queueName, async (message) => {
      if (message !== null) {
        const itemData = JSON.parse(message.content.toString());
        const item = new Item(itemData.item.title, itemData.item.description);

        console.log('Received item: ', item);
        // Process the received item, saving it to database
        try {
          // Establish connection with MariaDB
          const dbConnection = await pool.getConnection();

          // Prepare query statement
          const sql = 'INSERT INTO `item` (title, description) VALUES (?, ?)';

          // Execute query
          await dbConnection.query(sql, [item.title, item.description]);

          // Close database connection
          dbConnection.release();
        } catch (error) {
          console.log('Error while writing item to database: ', error);
        }

        channel.ack(message);
      }
    });
  } catch (error) {
    console.log('Error while consuming message: ', error);
  }
}

// Start the item consumer
consumeItems();
console.log(' [*] RabbitMQ Consumer started');
