const express = require("express");

const requestRouter  = express.Router();
const { userAuth } = require('../middleware/auth');


/* SEND CONNECTION REQUEST */
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log("Sending connection request");

    res.send(user.firstName + " sent the connection request!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});


module.exports = requestRouter;