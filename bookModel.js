const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  price: Number,
});

const Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;
