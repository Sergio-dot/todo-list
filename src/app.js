require('dotenv').config();
const express = require('express');
const pool = require('../modules/db');
const redisClient = require('../modules/redis');

const port = process.env.SERVER_PORT || 4001;

// Init express
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Todo App Project');
});

redisClient.connect();

// Esempio di utilizzo del client Redis
redisClient.set('chiave', 'valore', (err, reply) => {
  if (err) {
    console.error('Errore nella scrittura su Redis:', err);
  } else {
    console.log('Valore scritto su Redis:', reply);
  }
});

app.get('/users', async (req, res) => {
  let conn;
  try {
    // connect to database
    conn = await pool.getConnection();

    // query
    var query = 'select * from user';

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
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
