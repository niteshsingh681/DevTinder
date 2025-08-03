const express = require("express");
const {connectDB }= require("./config/database.js");
const User=require("./model/user.js")
const app = express(); // Create Express app instance
app.post("/signup",async(req,res)=>{
  const useObj={
    firstName:"ritesh ",
    lastName:"singh",
    emailId:"ritesh@gmail.com",
    password:"hasdjdskjfhfg",
  }
  const user=new User(useObj);
  try{
    await user.save();
//return a promise
   res.send("user added successfully ");
  }
  catch{
    console.log(" you get an error ");
  }
  
});
app.delete("/profile", async (req, res) => {
  try {
    const result = await User.deleteOne({ firstName: "nitesh" });
    
    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }
    
    res.send("User deleted successfully");
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).send("Server error");
  }
});

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
