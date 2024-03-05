const express = require("express");
const app = express();

app.get("/slow", function (req, res) {
  const start = Date.now();
  while (Date.now() - start <= 5000) {}

  res.send("Slow");
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3000);
