const express=require("express");
const app=express();
// defining the route handler
// app.get("/route",[r1,r2],r5,r6);
app.get("/user",(req,res,next)=>{
    console.log("1 response");
   // next();
    //res.end("1 response");
    next();
},
// another routing 
(req,res,next)=>{
    console.log("2 response");
   // next();
    res.end("2 response");
    next();//it is given by express and at the end it require any type of response 
    // no routing handler so it give an error 

},
);
app.listen(120,()=>{
    console.log("i am listening");
})