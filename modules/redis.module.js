require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

console.log(' [-] Connecting to Redis...');

client.connect();

client.on('connect', function () {
  console.log(' [*] Redis client connected at: ', process.env.REDIS_URL);
});

module.exports = client;
