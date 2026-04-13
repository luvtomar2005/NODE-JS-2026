const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // Case 1: no token present
        if (!token) {
            return res.status(401).send("Please Login!");
        }

        // Case 2: token exists but verify may fail
        const decodeObj = jwt.verify(token, "DevBridge@14022005");
        const { _id } = decodeObj;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).send("Invalid or expired token");
    }
};

module.exports = {
    userAuth
};