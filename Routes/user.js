const express=require("express");
const {userAuth}=require("../src/Middleware/Auth.js");
const userRoutes=express.Router();
const User = require("../src/model/user.js");
const ConnectionRequest = require("../src/model/requestUser.js");
// Get the all pending/rejected  connection requests for the loggedIn user
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
			"firstName lastName photo age gender about skills"
      // second parameter is a string inside fields

		// .pupulate("fromUserId",
		// ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]
		// ); // second parameter is array inside fields

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
// Get the all my connection(accepted ) requests
userRoutes.get("/user/connections", userAuth, async (req, res) => {
	try {
		const USER_SAFE_DATA =
			"firstName lastName photo age gender about skills";
		const allConnections = await ConnectionRequest.find({
			$or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
			status: "accepted",
		})
			.populate("fromUserId", USER_SAFE_DATA)
			.populate("toUserId", USER_SAFE_DATA);

		const data = allConnections.map((row) => {
			if (row.fromUserId._id.toString() == req.user._id.toString()) {
				return row.toUserId;
			}
			return row.fromUserId;
		});
		res.json({
			message: "Data fetched successfully",
			data,
		});
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});


// Get the all users cards except(not my connection requests and my own card)=>not single entity from connection request table
// 1. His own card
// 2. His connection -> accepted
// 3. Ignored users -> ignored
// 4. Already send the connection request -> interested
// 5. Rejected users -> rejected
   userRoutes.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const USER_SAFE_DATA =
			"firstName lastName photo age gender about skills";
    const page = parseInt(req.query.page || 1);
    let limit = parseInt(req.query.limit || 10);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});




 module.exports=userRoutes;