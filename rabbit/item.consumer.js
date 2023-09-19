const amqp = require('amqplib');
const Item = require('../models/item.model');
const pool = require('../modules/db.module');

const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

async function consumeNewItems() {
  const queueName = 'itemQueue';

  try {
    // Establish connection with RabbitMQ
    const connection = await amqp.connect(url);

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
        const messageData = JSON.parse(message.content.toString());

        // If message requests to create a new item
        if (messageData.action === 'add_item') {
          const item = new Item(
            messageData.item.title,
            messageData.item.description,
            messageData.item.completed
          );

          // Process the received item, saving it to database
          try {
            // Establish connection with MariaDB
            const dbConnection = await pool.getConnection();

            // Prepare query statement
            const sql =
              'INSERT INTO `item` (title, description, completed) VALUES (?, ?, ?)';

            // Execute query
            await dbConnection.query(sql, [
              item.title,
              item.description,
              item.completed,
            ]);

            // Close database connection
            dbConnection.release();
          } catch (error) {
            console.log('Error while writing item to database: ', error);
          }
        } else if (messageData.action === 'update_item') {
          try {
            // Establish connection with MariaDB
            const dbConnection = await pool.getConnection();

            // Prepare query statement
            const sql =
              'UPDATE `item` SET title = ?, description = ? WHERE id = ?';

            // Execute query
            await dbConnection.query(sql, [
              messageData.title,
              messageData.description,
              messageData.itemId,
            ]);

            dbConnection.release();
          } catch (error) {
            console.log('Error while updating item completed status: ', error);
          }
        } else if (messageData.action === 'delete_item') {
          try {
            // Establish connection with MariaDB
            const dbConnection = await pool.getConnection();

            // Prepare query statement
            const sql = 'DELETE FROM `item` WHERE `id` = ?';

            // Execute query
            await dbConnection.query(sql, [messageData.itemId]);

            // Close database connection
            dbConnection.release();
          } catch (error) {
            console.log('Error while updating item completed status: ', error);
          }
        } else if (messageData.action === 'mark') {
          try {
            // Establish connection with MariaDB
            const dbConnection = await pool.getConnection();

            // Prepare query statement
            const sql = "UPDATE `item` SET completed='1' WHERE `id`=(?)";

            // Execute query
            await dbConnection.query(sql, [messageData.itemId]);

            // Close database connection
            dbConnection.release();
          } catch (error) {
            console.log('Error while updating item completed status: ', error);
          }
        } else if (messageData.action === 'unmark') {
          try {
            // Establish connection with MariaDB
            const dbConnection = await pool.getConnection();

            // Prepare query statement
            const sql = "UPDATE `item` SET completed='0' WHERE `id`=(?)";

            // Execute query
            await dbConnection.query(sql, [messageData.itemId]);

            // Close database connection
            dbConnection.release();
          } catch (error) {
            console.log('Error while updating item completed status: ', error);
          }
        }
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log('Error while consuming message: ', error);
  }
}

// Start the consumers
if (consumeNewItems()) {
  console.log(' [*] RabbitMQ consumers started');
}
