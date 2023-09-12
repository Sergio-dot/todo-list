require('dotenv').config();
const redis = require('redis');

console.log(process.env.REDIS_URL);

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
});

module.exports = client;
