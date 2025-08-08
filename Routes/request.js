//it handle the request from the user
// post/request/:status/:id  =>status is only {"interested","ignore"}

const ConnectionRequest=require("../src/model/requestUser.js");
const express=require("express");
const { userAuth } = require("../src/Middleware/Auth.js");

const requestRoutes=express.Router();
requestRoutes.post("/request/send/:status/:toUserId",
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			const allowedStatus = ["ignored", "interested"];
			if (!allowedStatus.includes(status)) {
				return res
					.status(400)
					.json({ message: "Invalid status type: " + status });
			}

			// check if user exists in the database
			const toUser = await User.findById(toUserId);
			if (!toUser) {
				return res.status(404).json({ message: "User not found!" });
			}

			// check if connection request already exists between the two users
			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{ fromUserId, toUserId }, // { fromUserId: fromUserId, toUserId: toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});
			if (existingConnectionRequest) {
				return res
					.status(400)
					.send({ message: "Connection Request Already Exists!!" });
			}

			// create a new connection request and save it to the database
			const connectionRequest = new ConnectionRequest({
				fromUserId,
				toUserId,
				status,
			});
			const data = await connectionRequest.save();
			res.json({
				message:
					req.user.firstName + " " + status + " " + toUser.firstName,
				data,
			});
		} catch (err) {
			res.status(400).send("ERROR: " + err.message);
		}
	}
);


requestRoutes.post("/request/review/:status/:requestId",
	userAuth,
	async(req,res)=>{
	/* login through =>touserId(compare to previous) 
	  get the informatiion about the sent connection that is interested  
	  now  change the status of the fromuserId to interested =>accepted || rejected*/
		try{
		//loginUserId
		 	const fromUserId=req.user._id;
          const{status,requestId}=req.params;
		const allowedStatus=["accepted","rejected"];
	       if(!allowedStatus.includes(status))	
			return res.status(400).json({message:"Invalid status type: "+status});
		// check if connection request exists
      const connectionRequest=await ConnectionRequest.findById(requestId);
	  		if(!connectionRequest)
			return res.status(404).json({message:"Connection Request not found!"});
          const newData=await ConnectionRequest.find({
			 status:"interested",
			 fromUserId:fromUserId
		  });
		  if(!newData){
			res.status(404).json({message: "no user found"+ Error});
		  }
		  const data=newData.status="accepted";
		  res.status(200).json({message: `${data.firstName } is  matches`,
		data});

		}
		catch(err){
			res.status(400)
			.json({message:"ERROR: "+err.message});
		}
	}
);
module.exports=requestRoutes;