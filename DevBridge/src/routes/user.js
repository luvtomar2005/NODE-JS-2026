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

// API for getting all requests sent by logged-in user
userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const sentRequests = await ConnectionRequestModel.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "toUserId",
      "firstName lastName photoUrl age gender about skills",
    );

    res.json({
      message: "Sent requests fetched successfully",
      data: sentRequests,
    });
  } catch (err) {
    res.status(500).send("Error is there which is " + err.message);
  }
});



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
        res.status(500).send("Error message is " + err.message);
    }
})


// Creating the feed api and pagination into it
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // 🔥 build hidden users set
    const hiddenUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }) .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);


    res.json({ data: users });

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});



module.exports = userRouter;

