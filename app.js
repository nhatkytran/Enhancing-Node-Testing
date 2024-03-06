const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: path.join(__dirname, ".env") });

const redis = require("./redis");

const { NODE_ENV } = process.env;

if (NODE_ENV === "development") app.use(morgan("dev"));

app.get("/slow", function (req, res) {
  const start = Date.now();
  while (Date.now() - start <= 5000) {}

  res.send("Slow");
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

const bookStore = {
  user1111: [
    {
      title: "Band of Brothers",
      price: 99,
    },
  ],
  user2222: [
    {
      title: "Master of The Air",
      price: 129,
    },
  ],
};

app.get("/books/:userID", async (req, res, next) => {
  const { userID } = req.params;
  const booksKey = `user${userID}`;
  let isCached = false;
  let books = [];

  const cachedBooks = await redis.get(booksKey);

  if (cachedBooks) {
    books = JSON.parse(cachedBooks);
    isCached = true;
  } else {
    books = bookStore[booksKey];
    await redis.set(booksKey, JSON.stringify(books), "EX", 5);
  }

  res.status(200).json({
    status: "success",
    isCached,
    books,
  });
});

app.listen(3000);
