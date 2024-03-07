const mongoose = require("mongoose");
const redis = require("./redis");

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ""); // hset not work, find out later

  return this;
};

mongoose.Query.prototype.exec = async function () {
  console.log("--- RUN QUERY ---");
  if (this.useCache) console.log("use cache");
  else return await exec.apply(this, arguments);

  const key = JSON.stringify(
    Object.assign({}, structuredClone(this.getQuery()), {
      collection: this.mongooseCollection.name,
    })
  );

  const cachedResult = await redis.get(key);

  if (cachedResult) {
    console.log("--- Cached Version ---");
    const result = JSON.parse(cachedResult);

    if (!Array.isArray(result)) return new this.model(result);
    return result.map((item) => new this.model(item));
  }

  const result = await exec.apply(this, arguments);
  await redis.set(key, JSON.stringify(result), "EX", 5);

  return result;
};
