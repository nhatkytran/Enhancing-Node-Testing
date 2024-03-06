const Redis = require("ioredis");

const redis = new Redis({
  port: 6379,
  host: "redis://red-cnk3o8fsc6pc73f74m20",
});

redis.connect(() => console.log("Redis connected successfully!"));

module.exports = redis;
