const express = require("express");
const connect=require("./config/database");
const app = express(); // instance of server
const connect();

app.listen(100, () => {
  console.log("hello, i am listening");
});