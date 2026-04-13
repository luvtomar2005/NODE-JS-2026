require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database");
const sendEmail = require("./utils/sendEmail");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

// ---------------- Middleware ----------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://54.226.144.205"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ---------------- Health Route ----------------
app.get("/", (req, res) => {
  res.status(200).send("Backend deployed successfully");
});

// ---------------- SES Test Route ----------------
app.get("/send-test-mail", async (req, res) => {
  try {
    await sendEmail(
      process.env.SES_VERIFIED_EMAIL,
      "DevBridge Test",
      "Amazon SES is working successfully"
    );

    res.send("Mail sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ---------------- Routes ----------------
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ---------------- Server Start ----------------
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });