require('dotenv').config();
const express = require('express');
const pool = require('../modules/db');

const port = process.env.PORT || 4001;

// Init express
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Todo App Project');
});

app.get('/users', async (req, res) => {
  let conn;
  try {
    // connect to database
    conn = await pool.getConnection();

    // query
    var query = 'select * from users';

    // execute the query
    var rows = await conn.query(query);

    // show results
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

// Start web server
app.listen(port, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
