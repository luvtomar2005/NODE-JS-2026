require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ---------------- Middleware ----------------
app.use(cors({
  origin: [
    "http://localhost:5173",     // local frontend
    "http://3.88.107.114",       // deployed frontend IP (replace if different)
    "http://18.213.2.133"        // backend IP if testing directly
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ---------------- Test Route ----------------
app.get("/", (req, res) => {
  res.status(200).send("Backend deployed successfully");
});

// ---------------- Routes ----------------
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const PORT = 1000;

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is ACTUALLY listening on port ${PORT}`);
      console.log(server.address());
    });

    server.on("error", (err) => {
      console.error("Listen failed:", err);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });