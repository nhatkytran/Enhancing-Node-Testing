const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");

const Book = require("./bookModel");

const app = express();

dotenv.config({ path: path.join(__dirname, ".env") });

const redis = require("./redis");
require("./cache");

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

app.get("/createBook", async (req, res, next) => {
  await Book.create([
    {
      title: "Band of Brothers",
      price: 99,
    },
    {
      title: "Master of The Air",
      price: 129,
    },
  ]);

  res.status(200).json({ status: "success" });
});

app.get("/oneBook/:bookID/:userID", async (req, res, next) => {
  const { bookID, userID } = req.params;
  const book = await Book.findById(bookID).cache({ key: userID });

  res.status(200).json({ status: "success", book });
});

app.get("/oneBook2/:bookID", async (req, res, next) => {
  const { bookID } = req.params;
  const book = await Book.findById(bookID);

  res.status(200).json({ status: "success", book });
});

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://nhatkytran:Icutes3M@cluster0.wttvcu4.mongodb.net/redis?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Database connection - Successful");

    app.listen(3000, "127.0.0.1", () =>
      console.log(`App running on port ${3000}...`)
    );
  });
