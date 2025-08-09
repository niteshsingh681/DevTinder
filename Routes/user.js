const express=require("express");
const {userAuth}=require("../src/Middleware/Auth.js");
const userRoutes=express.Router();
const User = require("../src/model/user.js");
const ConnectionRequest = require("../src/model/requestUser.js");
userRoutes.get("/user/requests/recieved/:status", userAuth,async(req,res)=>{
      try{
        const status=req.params.status;
        const allowedStatuses=["interested","ignored"];
        if(!allowedStatuses.includes(status)){
            return res.status(400).send("Invalid status type: " + status);
        }
        const loggedInUserId=req.user._id;
        const receivedRequests=await ConnectionRequest.find({
            toUserId:loggedInUserId,
            status:status
        }).populate(
			"fromUserId",
			"firstName lastName photoUrl age gender about skills"
		); 
        res.json({
			message: "Data fetched successfully",
			data: receivedRequests,
		});
        
      }
      catch(err){
        res.status(400).send("ERROR /API: " + err.message);
      }
});
 module.exports=userRoutes;