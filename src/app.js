const express = require("express");
const {connectDB }= require("./config/database.js");
const User=require("./model/user.js");

//User is model
const app = express(); // Create Express app instance
//make a dynamic signup api using middldeware of end user 
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    // Attempt to save the new user
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    // Handle validation, duplicate, or DB errors
    console.error("You got an error: " + err);

    if (err.code === 11000) {
      // Duplicate email error (unique constraint)
      return res.status(400).send("Email already exists");
    }

    res.status(500).send("Failed to add user");
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
// Route to fetch user by email
app.get("/user", async (req, res) => {
  // Extracting emailId from request body
  const userEmail = req.body.emailId;

  try {
    // Find user(s) matching the emailId
    const target = await User.find({ emailId: userEmail });

    // If no user found, send appropriate response
    if (target.length === 0) {
      return res.status(404).send("User not found");
    }

    // If user found, send the user data
    res.status(200).send(target);
    console.log("User retrieved successfully");
  } catch (err) {
    // Catch any server/database error
    console.error("Error fetching user:", err);
    res.status(500).send("Internal server error");
  }
});
//route to fetch feed
// Route to fetch user by email
app.get("/feed", async (req, res) => {
  

  try {
    // Find user(s) feed
    const target = await User.find({ });

    // If no user found, send appropriate response
    if (target.length === 0) {
      return res.status(404).send("User not found");
    }

    // If user found, send the user data
    res.status(200).send(target);
    console.log("User retrieved successfully");
  } catch (err) {
    // Catch any server/database error
    console.error("Error fetching user:", err);
    res.status(500).send("Internal server error");
  }
});
//update the profile by id
// Update data of the user
app.patch("/user/:userId", async (req, res) => {

//  made on postman  and url is http://localhost:100/user/userId 
// {
    
//   "age":52
// }
  const userId = req.params.userId;
  const data = req.body;

  try {
    // Only allow certain fields to be updated
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills","firstName"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
//isUpdateAllowed becomes true only if all keys in data are valid.
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    // Skills should not be more than 10
    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    // Update the user with validators
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      data,
      // {
      //   returnDocument: "after", // returns updated doc
      //   runValidators: true       // runs schema validators
      // }
    );

    console.log(user);
    res.status(200).send(user);

  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

// Route to update user profile (e.g., firstName)
app.patch("/profile", async (req, res) => {
  const userId = req.body._id;

  try {
    // Find user by _id and update firstName to "Alia"
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },                    // Filter
      { firstName: "Alia" },             // Update
      { new: true }                      // Return updated document
    );

    // If user not found
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    console.log("firstName updated successfully");
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Internal server error");
  }
});
// Route to update user profile  using email id  (e.g., firstName)
app.patch("/profileEmail", async (req, res) => {
  const userEmailId = req.body.emailID;

  try {
    // Find user by _id and update firstName to "Alia"
    const updatedUser = await User.findOneAndUpdate(
      { emailID: userEmailId },                    // Filter
      { firstName: "Alia through email" },             // Update
      { new: true }                      // Return updated document
    );

    // If user not found
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    console.log("eamilid updated successfully");
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Internal server error");
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
