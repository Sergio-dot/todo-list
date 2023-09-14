const pool = require('../modules/db.module');
const Item = require('../models/item.model');
const { publishItemToQueue } = require('../rabbit/item.producer');

async function GetItems(req, res) {
  try {
    // Attempt database connection
    const connection = await pool.getConnection();

    // Prepare query statement
    const sql = 'SELECT * FROM `item`';

    // Execute query
    results = await connection.query(sql);

    // Close the connection
    connection.release();

    res.render('index', { items: results });
  } catch (error) {
    console.log('Error while retrieving items: ', error);
  }
}

async function AddItem(req, res) {
  const title = req.body.title;
  const desc = req.body.description;

  // Check if description is provided in the request body
  const description = desc || null;

  try {
    // Create new Item instance
    const newItem = new Item(title, description);

    // Create message object to be published
    const item = {
      action: 'add_item',
      item: newItem,
    };

    // Publish message to RabbitMQ
    await publishItemToQueue(item);

    res
      .status(200)
      .json({ message: 'Item added successfully', redirectTo: '/v1/user' });
  } catch (error) {
    console.log('Failed to add item: ', error);
    res.redirect('/v1/user');
  }
}

module.exports = {
  GetItems,
  AddItem,
};
