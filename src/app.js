//Modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('../modules/db');
const redisClient = require('../modules/redis');

const port = process.env.SERVER_PORT || 4001;

// Init express
const app = express();

// View engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(cors());

let refreshTokens = [];

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'sergio' && password === 'password') {
    const access_token = jwt.sign(
      { sub: username },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_TIME,
      }
    );
    const refresh_token = generateRefreshToken(username);

    return res.status(200).json({
      status: true,
      message: 'Logged in',
      data: { access_token, refresh_token },
    });
  }
  return res.status(401).json({ status: false, message: 'Failed logging in' });
});

// Token (refresh)
app.post('/token', verifyRefreshToken, (req, res) => {
  const username = req.userData.sub;
  const access_token = jwt.sign(
    { sub: username },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TIME,
    }
  );
  const refresh_token = generateRefreshToken(username);

  return res.status(200).json({
    status: true,
    message: 'Success',
    data: { access_token, refresh_token },
  });
});

// Dashboard
app.get('/dashboard', verifyToken, (req, res) => {
  return res
    .status(200)
    .json({ status: true, message: 'This is your dashboard' });
});

// Logout
app.get('/logout', verifyToken, (req, res) => {
  const username = req.userData.sub;

  // remove refresh token
  refreshTokens = refreshTokens.filter((x) => x.username !== username);

  return res.status(200).json({ status: true, message: 'Logged out' });
});

// Users - only for dev purpose
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

// Custom Middlewares
function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userData = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: 'Invalid session', data: error });
  }
}

function verifyRefreshToken(req, res, next) {
  const token = req.body.token;

  if (token === null) {
    return res.status(401).json({ status: false, message: 'Invalid request' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userData = decoded;

    // check if token is in store or not
    let storedRefreshToken = refreshTokens.find(
      (x) => x.username === decoded.sub
    );

    if (storedRefreshToken === undefined) {
      return res.status(401).json({
        status: false,
        message: 'Invalid request. Token is not stored',
      });
    }

    if (storedRefreshToken.token != token) {
      return res.status(401).json({
        status: false,
        message: 'Invalid request. Token is outdated',
      });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: 'Invalid session', data: error });
  }
}

function generateRefreshToken(username) {
  const refresh_token = jwt.sign(
    { sub: username },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TIME,
    }
  );

  let storedRefreshToken = refreshTokens.find((x) => x.username === username);

  if (storedRefreshToken === undefined) {
    // add it
    refreshTokens.push({
      username: username,
      token: refresh_token,
    });
  } else {
    // update it
    refreshTokens[
      refreshTokens.findIndex((x) => x.username === username)
    ].token = refresh_token;
  }

  return refresh_token;
}
