const express = require("express");
const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

const { userAuth } = require("../middleware/auth");
requestRouter.post(
  "/request/send/:status/:toUserId",
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
      //Important for checking whether we are sending request to existing user or not..
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }
      /* THE BELOW LINE IS THE USAGE OF MONGOOSE or OPERATOR FOR CHECKING WHETHER
     THE DUPLICATE REQUEST HAS BEEN SENT OR NOT */

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // const emailRes = await sendEmail.run(
      //   "A new friend request from " + req.user.firstName,
      //   req.user.firstName + " is " + status + " in " + toUser.firstName
      // );
      // console.log(emailRes);

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = requestRouter;
