const jwt = require("jsonwebtoken");
const User = require("../model/user");
// Middleware to authenticate user based on JWT token
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
          //  throw new Error("Not a Vaid token !!")
          res.status(401).send("Not a valid token");
        }

        const deocodedObj = await jwt.verify(token, "999@Akshad")
        const { _id } = deocodedObj;
        //returns the decoded payload=>data that was stored inside the token (i.e., the original object encoded inside the token).

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User Not Found")
        }
        req.user= user;
        // Attach user to request object
        // This allows the next middleware or route handler to access the user information
        next();
    } catch (err) {
        res.status(400).send("ERR/AUTH : " + err.message)
    }
}
// middleware to check the profileauthentication
const profileAuth = (reqBody) => {
  const isAllowedToUpdate = ["firstName", "lastName", "age", "photo", "skills","about"];
  return Object.keys(reqBody).every((key) => isAllowedToUpdate.includes(key));
};


module.exports = {
    userAuth,profileAuth
}