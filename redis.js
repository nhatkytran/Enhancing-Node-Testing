const Redis = require("ioredis");

// const { REDIS_PORT, REDIS_HOST, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  // port: REDIS_PORT,
  // host: REDIS_HOST,
  // username: REDIS_USERNAME,
  // password: REDIS_PASSWORD,
  port: 6379,
  host: "127.0.0.1",
});

redis.connect(() => console.log("Redis connected successfully!"));

module.exports = redis;
