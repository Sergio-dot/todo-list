const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const pool = require('../modules/db.module');
const redisClient = require('../modules/redis.module');

async function Register(req, res) {
  try {
    // Attempt database connection
    const connection = await pool.getConnection();

    // Parse body
    const newUser = new User(req.body.username, req.body.password);

    // Prepare query statement
    const sql = 'INSERT INTO `user` (username, password) VALUES (?, ?)';

    // Execute query
    await connection.query(sql, [newUser.username, newUser.password]);

    // Send successful response
    res.status(200).json({
      status: true,
      message: 'Registered successfully',
      data: newUser,
    });

    // Close the connection
    connection.release();
  } catch (error) {
    // Send error response
    res.status(500).json({
      status: false,
      message: 'Error while performing operation.',
      data: error,
    });
  }
}

async function Login(req, res) {
  try {
    // Attempt database connection
    const connection = await pool.getConnection();

    // Parse body
    const username = req.body.username;
    const password = req.body.password;

    // Prepare query statement
    const sql = 'SELECT * FROM `user` WHERE username = ? AND password = ?';

    // Execute query
    const user = await connection.query(sql, [username, password]);

    // Check if user was found
    if (user.length > 0) {
      // Get user ID
      const userId = user[0].id;
      console.log('[LOGIN] User found:', user);

      const access_token = jwt.sign(
        { sub: userId },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: process.env.JWT_ACCESS_TIME,
        }
      );
      const refresh_token = GenerateRefreshToken(userId);
      console.log('[LOGIN] Access Token: ', access_token);
      console.log('[LOGIN] Refresh Token: ', refresh_token);

      return res.status(200).json({
        status: true,
        message: 'Logged in',
        data: { access_token, refresh_token },
      });
    } else {
      // No user found with provided credentials
      res.status(401).json({
        status: false,
        message: 'Invalid username and/or password',
      });
    }

    // Close the connection
    connection.release();
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({
      status: false,
      message: 'An internal server error occurred. Please try again later',
    });
  }
}

async function Logout(req, res) {
  const userId = req.userData.sub;
  const token = req.token;

  console.log('[LOGOUT] Token:', token);

  // Remove refresh token
  await redisClient.del(userId.toString());

  // Blacklist current access token
  await redisClient.set('BL_' + userId.toString(), token);

  return res.status(200).json({ status: true, message: 'Logged out' });
}

function GetAccessToken(req, res) {
  const userId = req.userData.sub;
  console.log('[GET_ACCESS_TOKEN] User ID: ', userId);
  const access_token = jwt.sign(
    { sub: userId },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TIME,
    }
  );
  const refresh_token = GenerateRefreshToken(userId);

  return res.status(200).json({
    status: true,
    message: 'Logged in',
    data: { access_token, refresh_token },
  });
}

function GenerateRefreshToken(userId) {
  console.log('[GENERATE_REFRESH_TOKEN] User ID: ', userId);
  const refresh_token = jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TIME,
    }
  );

  redisClient.get(userId.toString(), (err, data) => {
    if (err) {
      throw err;
    }

    redisClient.set(
      userId.toString(),
      JSON.stringify({ token: refresh_token })
    );
  });

  return refresh_token;
}

module.exports = {
  Register,
  Login,
  Logout,
  GetAccessToken,
};
