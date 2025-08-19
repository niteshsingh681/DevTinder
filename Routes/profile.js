const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../src/model/user");
const { userAuth ,profileAuth} = require("../src/Middleware/Auth.js");
const profileRoutes=express.Router();




profileRoutes.delete("/profile/delete",userAuth, async (req, res) => {
  try {

    const result =await User.deleteOne({ _id: req.user._id });
     
    
    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }
    
    res.send("User deleted successfully");
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).send("Server error");
  }
});

profileRoutes.patch("/profile/update", userAuth,async (req, res) => {

  try {
//console.log(req.body);
  //  if(!profileAuth(req.body)){
  //   throw new Error("Invalid update request");
  //  }
   const updatedData=req.user;
    Object.keys(req.body).forEach((key) => {
      updatedData[key] = req.body[key];
    });
    // // Hash the password if it is being updated
    // if (req.body.password) {
    //   const salt = await bcrypt.genSalt(10);
    //   updatedData.password = await bcrypt.hash(req.body.password, salt);
    // }
    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });

   res.status(200)
   .send({
  message: `${updatedUser.firstName}, you updated your profile successfully`,
  updatedUser
});

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Internal server error");
  }
});
profileRoutes.get("/profile/view",userAuth,async(req,res)=>{
   try{
    // const { firstName } = req.user;
    // const user=await User.find({firstName:firstName});
    // if(!user) return res.status(404).send("User not found");
    res.status(200).send(req.user);
   }
    catch(err){
      console.error("Error fetching user:", err);
      res.status(500).send("Internal server error");
    }
});
profileRoutes.patch("/profile/update/password/forget",async(req,res)=>{
  try {
    const { emailId, newPassword } = req.body;
    if (!emailId || !newPassword) {
      return res.status(400).send("Email and new password are required.");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user
    await user.save();
    
    res.status(200).send("Password updated successfully.");
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).send("Internal server error");
  }
})
module.exports=profileRoutes;