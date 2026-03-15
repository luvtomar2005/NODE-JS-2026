const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userAuth = async (req , res , next) => {
    try{
        const {token}  = req.cookies;
        if(!token){
            throw new Error("Token is not valid !!!");
        }
        const decodeObj = await jwt.verify(token , "DevBridge@14022005");
        const { _id} = decodeObj;
        const user = await User.findById( _id);
        if(!user){
            throw new Error("User not found");
        }
        next();
        req.user = user;
    }
    catch(err){
        res.status(400).send("ERROR" , err.message);
    }
}

module.exports = {
    userAuth
}