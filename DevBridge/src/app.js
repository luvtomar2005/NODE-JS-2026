const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/users");
const { validateSignUpData } = require("./utils/helper");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

app.use(express.json());


/* app.use(express.json()) is Express middleware used to parse incoming requests with 
JSON payloads. It converts the JSON data from the 
request body into a JavaScript object and makes it available in req.body. */

app.use(cookieParser());

/* SIGNUP API */
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
    });

    res.send("User login successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


/* PROFILE API */
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR: " + err.message);
  }
});


/* SEND CONNECTION REQUEST */
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log("Sending connection request");

    res.send(user.firstName + " sent the connection request!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});


/* DATABASE CONNECTION */
connectDB()
  .then(() => {
    console.log("Database is connected fine...");
    app.listen(1000, () => {
      console.log("Server is running at port 1000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });