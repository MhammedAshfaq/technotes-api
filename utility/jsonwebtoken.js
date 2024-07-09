import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { failureResponseWithError } from "./commonFunction.js";
dotenv.config();

export const generateToken = (user, res) => {
  try {
    const defaultOptions = {
      expiresIn: "1h", // Token expiration time
      algorithm: "HS256", // Signing algorithm
    };
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      defaultOptions
    );
  } catch (error) {
    console.log("JWT SIGN ERROR", error);
    return failureResponseWithError(
      res,
      441,
      "Invalid JWT format. Please ensure that iat claim is valid."
    );
  }
};
