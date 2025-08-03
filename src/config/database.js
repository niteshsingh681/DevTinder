const mongoose=require("mongoose"); 
//mongoose.connect("mongodb+srv://niteshkumar789096:cZOALTEGHUVXpNtV@cluster0.txatwgr.mongodb.net/"); 
const connectDB=async()=>{
    // connecting to the atlas cluster
    await mongoose.connect("mongodb+srv://niteshkumar789096:cZOALTEGHUVXpNtV@cluster0.txatwgr.mongodb.net/cluster0"); 

};
module.exports = { connectDB };
