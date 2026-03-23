const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/users");
const ConnectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Now building the api for getting the request for all pending users
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills",
    );
     res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(404).send("Error is there which is " + err.message);
  }
});

module.exports = userRouter;

// Creating api for getting all the connections
userRouter.get("/user/connections" , userAuth , async(req  , res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                {toUserId : loggedInUser._id ,status : "accepted"},
                {fromUserId : loggedInUser._id , status : "accepted"},
            ],
        }).populate("fromUserId" , USER_SAFE_DATA).populate("toUserId" , USER_SAFE_DATA)
        console.log(connectionRequests);
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                // If YOU are sender → return the other person (receiver)
                return row.toUserId;
            }
            // Else → YOU are receiver → return sender
            return row.fromUserId;
        })
        res.json({data});

    }
    catch(err){
        res.status(404).send("Error message is " + err.message);
    }
})


