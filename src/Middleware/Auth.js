const Auth=(req,res,next)=>{
    const token="ght";
    const isAuth=(token==="gjht");
    if(isAuth){
        console.log("everything will fine");
    }
    else{
        next();
    }
}
   module.exports = { Auth };