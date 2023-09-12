require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
});

module.exports = client;
