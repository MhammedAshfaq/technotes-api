import jwt from "jsonwebtoken";

import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import { failureResponseWithError } from "../utility/commonFunction.js";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = async (req, res, next) => {
  // Get token from headers
  const authToken = req.headers.authorization;
  console.log("USER TOKEN:-", authToken);

  // Check token is exist
  if (!authToken) {
    return failureResponseWithError(
      res,
      401,
      "Authorization header is missing"
    );
  }

  if (!authToken.startsWith("Bearer ")) {
    return failureResponseWithError(res, 401, "Invalid token format");
  }

  try {
    const token = authToken.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return failureResponseWithError(
        res,
        401,
        "Token expired, Please login again"
      );
    }
    return failureResponseWithError(res, 401, "Invalid Token");
  }
};

export const restrict = (role) => async (req, res, next) => {
  const userId = req.userId;

  let user;

  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  }

  if (doctor) {
    user = doctor;
  }
  // console.log("-----",patient)
  if (!role.includes(user.role)) {
    return failureResponseWithError(res, 401, "You're not authorized");
  }
  next();
};
