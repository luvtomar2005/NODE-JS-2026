const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter  = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);

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