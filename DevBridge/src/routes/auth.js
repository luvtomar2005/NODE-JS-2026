const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/helper");
const User = require("../models/users");
const bcrypt = require("bcrypt");

/* SIGNUP API */
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, passWord } = req.body;

    // hash password
    const passWordHash = await bcrypt.hash(passWord, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      passWord: passWordHash,
    });

    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* LOGIN API */
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, passWord } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // validate password using schema method
    const isPasswordValid = await user.validatePassword(passWord);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // generate JWT using schema method
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      sameSite: "LAX",
      secure: false, // true ONLY if using HTTPS
    });

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

/* LOGOUT API */
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send();
});

module.exports = authRouter;
