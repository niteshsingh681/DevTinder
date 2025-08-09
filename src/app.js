const express = require("express");
const {connectDB }= require("./config/database.js");
const cookieParser = require('cookie-parser');
const validator = require("validator");
//User is model
const app = express(); // Create Express app instance
app.use(cookieParser());
//	Makes req.cookies available and parse
//make a dynamic signup api using middldeware of end user 
app.use(express.json());
const loginAuth=require("../Routes/auth.js");
//login api
app.use("/", loginAuth);

const profile=require("../Routes/profile.js");
//profile api 
app.use("/", profile);
const request=require("../Routes/request.js");
//request api
app.use("/", request);
const user=require("../Routes/user.js");
app.use("/",user);
// const user=new User(useObj);
//creating a new instance of usermodel 
//user.save();
//return a promise
// Connect to DB first, then start the server
connectDB()
  .then(() => {
    console.log("✅ Database successfully connected");
    
    // Start the server after DB connection
    app.listen(100, () => {
      console.log("🚀 Server is listening on port 100");
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to the database", err);
  });
