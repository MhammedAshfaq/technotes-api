import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import doctorRoute from "./routes/doctorRouter.js";
import reviewRoute from "./routes/reviewRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

import { connect } from "./database/config.js";

dotenv.config();
const PORT = process.env.PORT || 8001;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(
  cors({
    origin: true,
  })
);

//DATABASE
mongoose.set("strictQuery", false);
connect();

// Route
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/review", reviewRoute);
app.use("/api/booking", bookingRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

// App Listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgGreen.bold);
});
app.on("error", (err) => {
  console.error(`Server error: ${err.message}`.bgRed.bold); // Log errors with red color
});
