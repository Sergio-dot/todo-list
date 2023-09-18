const pool = require('../modules/db.module');
const Item = require('../models/item.model');
const producer = require('../rabbit/item.producer');

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

async function GetItemById(req, res) {
  const itemId = req.params.itemId;

  try {
    // Attempt database connection
    const connection = await pool.getConnection();

    // Prepare query statement
    const sql = 'SELECT * FROM `item` WHERE id = ?';

    // Execute query
    result = await connection.query(sql, [itemId]);

    // Close the connection
    connection.release();

    res.render('edit', { item: result[0] });
  } catch (error) {
    res.status(401).json({
      message: 'Error while searching for item',
      redirectTo: '/v1/user',
    });
  }
}

async function AddItem(req, res) {
  const title = req.body.title;
  const desc = req.body.description;
  const completed = 0;

  // Check if description is provided in the request body
  const description = desc || null;

  try {
    // Create new Item instance
    const newItem = new Item(title, description, completed);

    // Create message object to be published
    const item = {
      action: 'add_item',
      item: newItem,
    };

    // Publish message to RabbitMQ
    await producer.publishItemToQueue(item);

    res
      .status(200)
      .json({ message: 'Item added successfully', redirectTo: '/v1/user' });
  } catch (error) {
    console.log('Failed to add item: ', error);
    res
      .status(401)
      .json({ message: 'Error while adding new item', redirectTo: '/v1/user' });
  }
}

async function UpdateItem(req, res) {
  const itemId = req.params.itemId;
  const newTitle = req.body.newTitle;
  const newDescription = req.body.newDescription;

  try {
    // Create message object for RabbitMQ
    const message = {
      action: 'update_item',
      itemId: itemId,
      title: newTitle,
      description: newDescription,
    };

    // Publish message to RabbitMQ
    await producer.publishUpdateToQueue(message);

    res.redirect('/v1/user/');
  } catch (error) {
    console.log('Error while updating item: ', error);
    res.redirect('/v1/user/');
  }
}

async function DeleteItem(req, res) {
  const itemId = req.params.itemId;

  try {
    // Create message object for RabbitMQ
    const message = {
      action: 'delete_item',
      itemId: itemId,
    };

    // Publish message to RabbitMQ
    await producer.publishDeleteToQueue(message);

    res
      .status(200)
      .json({ message: 'Item deleted successfully', redirectTo: '/v1/user' });
  } catch (error) {
    console.log('Error while deleting item: ', error);
    res.status(401).json({
      message: 'Error while deleting item from database',
      redirectTo: '/v1/user',
    });
  }
}

async function MarkItem(req, res) {
  const itemId = req.params.itemId;
  const action = req.query.action;

  try {
    // Create message object for RabbitMQ
    const message = {
      action: action,
      itemId: itemId,
    };

    // Publish message to RabbitMQ
    await producer.publishMarkToQueue(message);

    console.log(
      `Item ${action === 'mark' ? 'marked' : 'unmarked'} successfully`
    );

    res
      .status(200)
      .json({ message: 'Item marked successfully', redirectTo: '/v1/user' });
  } catch (error) {
    console.log("Error updating item's status: ", error);
    res.status(401).json({
      message: "Error while changing item's completed status",
      redirectTo: '/v1/user',
    });
  }
}

module.exports = {
  GetItems,
  GetItemById,
  AddItem,
  UpdateItem,
  DeleteItem,
  MarkItem,
};
