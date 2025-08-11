const express=require("express");
const User=require("../src/model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRoutes=express.Router();
const {validateSignupData}=require("../src/utils/validate");
const cookieParser = require('cookie-parser');

authRoutes.use(cookieParser());

authRoutes.post("/login", async (req, res) => {
  console.log("Login request received:", req.body); 
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).send("Please provide both email and password.");
    }

    // 1. Find the user and explicitly select the 'password' field
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    // 2. Validate the password using bcrypt.compare()
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password.");
    }

    // 3. Create a JWT token
    const jwtSecret = "999@Akshad"; 
    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "1d" });

    // 4. Set the JWT token as a secure, httpOnly cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000), 
      httpOnly: true,
      
    });

    // 5. Send a success response
    res.status(200).json({mesaage:"Welcome to the dating app! You are now logged in.he",user});

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error during login.");
  }
});


authRoutes.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    // Correctly destructure all properties from req.body
    const { password, emailId, ...rest } = req.body;
    //console.log(req.body.emailId);
    //console.log("Request body:", req.body);
    const existingUser = await User.findOne({ emailId: emailId });
    // if (existingUser) {
    //   return res.status(400).send("Already registered account");
    // }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user with hashed password and all other 'rest' properties
    const user = new User({
      ...rest,
      emailId: emailId, // It's good practice to explicitly include `emailId` here
      password: passwordHash
    });

    // Save the user
    await user.save();
    res.send("User added successfully");

  }
  catch (err) {
    console.error("You got an error: " + err);

    if (err.code === 11000) {
      return res.status(400).send("Email already exists");
    }

    res.status(500).send("Failed to add user");
  }
});
authRoutes.post("/logout", (req, res) => {
  res.cookie("token", null,{expires:new Date(Date.now())} );
  res.status(200).send("You are logged out successfully");
});
module.exports = authRoutes;