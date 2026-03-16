const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/helper");

/* GET PROFILE */
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

/* VIEW PROFILE */
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

/* EDIT PROFILE */
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {

    // Validate fields
    if (!validateEditProfileData(req.body)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    // Update fields dynamically
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // Save updated user to database
    await loggedInUser.save();

    res.send({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser
    });

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;