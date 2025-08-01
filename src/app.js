const express = require("express");
const app = express(); // instance of server

// request handler for the root path "/"
app.get("/", (req, res) => {
  res.send("hello from the server ...");
});
//only execute that code if the request is a GET request and the path matches exactly.

// request handler for the "/test" path
app.get("/test", (req, res) => {
  res.send("hello from the test...");
});

// request handler for the "/home" path
app.get("/home", (req, res) => {
  res.send("hello from the home ...");
});

app.listen(100, () => {
  console.log("hello, i am listening");
});