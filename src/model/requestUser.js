const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User", // Reference to the User model
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ["ignored", "interested", "accepted", "rejected"],
				message: `{VALUE} is incorrect status type`,
			},
		},
	},
	{
		timestamps: true,
	}
);


// Pre hook to validate if fromUserId and toUserId are not the same.
connectionRequestSchema.pre("save", function (next) {
	const connectionRequest = this;
	// Check if the fromUserId is same as toUserId
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
		throw new Error("Cannot send connection request to yourself!");
	}
	next();
});
module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);