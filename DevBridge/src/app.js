require("dotenv").config();
require("./utils/cronJob");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

const connectDB = require("./config/database");
const sendEmail = require("./utils/sendEmail");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ---------------- Middleware ----------------
app.use(
  cors({
    origin: allowedOrigins,
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
app.use("/", chatRouter);

// ---------------- Server Start ----------------
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });