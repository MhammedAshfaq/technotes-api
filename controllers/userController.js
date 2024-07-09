import User from "../models/UserSchema.js";
import {
  failureResponseWithError,
  hashConvertPassword,
  successResponse,
  successResponseWithData,
} from "../utility/commonFunction.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utility/validate.js";

dotenv.config();

//USER UPDATE API
export const updateUser = async (req, res) => {
  const params = req.params.id;
  try {
    const findUser = await User.findById(params);
    if (!findUser) {
      return failureResponseWithError(res, 404, "User not found");
    }

    if (findUser.status !== 1) {
      return failureResponseWithError(res, 404, "User not active");
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: params },
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updateUser) {
      return failureResponseWithError(res, 404, "Failed to update");
    }

    return successResponseWithData(
      res,
      200,
      "Successfully updated",
      updateUser
    );
  } catch (error) {
    console.log("USER UPDATE ERROR", error);
    // return failureResponseWithError(res, 500, "Failed to update");
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const params = req.params.id;

  try {
    const updateUser = await User.findByIdAndUpdate(
      params,
      { $set: { status: 0 } },
      { new: true }
    );

    if (!updateUser) {
      return failureResponseWithError(res, 404, "User not found");
    }

    return successResponse(res, 200, "Successfully deleted");
  } catch (error) {
    console.log("USER UPDATE ERROR", error);
    return failureResponseWithError(res, 500, "Failed to delete");
  }
};

//FIND SINGLE USER
export const findUser = async (req, res) => {
  const params = req.params.id;

  try {
    const findUser = await User.findById(params).select("-password");
    if (!findUser) {
      return failureResponseWithError(res, 404, "User not found");
    }
    if (findUser.status != 1) {
      return failureResponseWithError(res, 400, "User not active");
    }
    const { password, appointments, ...rest } = findUser._doc;
    // console.log(rest)
    return successResponseWithData(
      res,
      200,
      "User data retrieved successfully",
      rest
    );
  } catch (error) {
    console.log("USER UPDATE ERROR", error);
    return failureResponseWithError(res, 500, "Failed to find a user");
  }
};

// Find All Users
export const findUsers = async (req, res) => {
  try {
    const findUser = await User.find({ status: 1 }).select("-password");
    if (findUser.length === 0) {
      return failureResponseWithError(res, 404, "Not Data found");
    }

    return successResponseWithData(
      res,
      200,
      "User data retrieved successfully",
      findUser
    );
  } catch (error) {
    console.log("USER LIST ERROR", error);
    return failureResponseWithError(res, 500, "Failed to find a user");
  }
};

// Find User Profile
export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return failureResponseWithError(res, 404, "User not found");
    }

    if (user.status !== 1) {
      return failureResponseWithError(res, 400, "User not active");
    }

    return successResponseWithData(
      res,
      200,
      "Profile info retrieved successfully",
      user
    );
  } catch (error) {
    console.log("USER PROFILE ERROR", error);
    return failureResponseWithError(res, 500, "Internal server error");
  }
};

export const getUserAppointment = async (req, res) => {
  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // query.createdAt = {
    //   $gte: startOfDay,
    //   $lte: endOfDay,
    // };

    const query = {
      user: req.userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    // step - 1  : retrive appointments from booking
    const booking = await Booking.find(query);
    console.log("--------Bokking", booking.length);
    if (booking.length === 0) {
      return failureResponseWithError(res, 404, "Appointment data not found");
    }

    // step - 2  : extract  doctor ids from appointments bookings
    const doctorIds = booking.map((data) => data.doctor.id);

    // step - 3  : retrive doctor using doctor ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );
    return successResponseWithData(
      res,
      200,
      "Appointment data retrieved successfully",
      booking
    );
  } catch (error) {
    console.log("USER APPOINTMENT ERROR", error);
    return failureResponseWithError(res, 500, "Internal server error");
  }
};

// FORGOT USER PASSWORD
export const forgotUserPassword = async (req, res) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return failureResponseWithError(res, 400, error.details[0].message);
  }
  try {
    let user;
    let patient = await User.findOne({ email: req.body.email });
    let doctor = await Doctor.findOne({ email: req.body.email });

    if (doctor) user = doctor;
    if (patient) user = patient;
    if (!user) {
      return failureResponseWithError(res, 404, "User not found");
    }
    if (user.status != 1) {
      return failureResponseWithError(res, 404, "User not active");
    }
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "5m",
    });

    const link = `/reset-password/${user._id}/${token}`;
    console.log(link);
    return successResponseWithData(res, 200, "You can perform reset password", {
      link,
      token,
    });
  } catch (error) {
    console.log("FORGOR USER ERROR", error);
    return failureResponseWithError(res, 500, "Internal server error");
  }
};

export const resetUserPassword = async (req, res) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) {
    return failureResponseWithError(res, 400, error.details[0].message);
  }

  try {
    const { id, token } = req.params;

    let user;
    let patient = await User.findById(id);
    let doctor = await Doctor.findById(id);

    if (doctor) user = doctor;
    if (patient) user = patient;

    if (!user) {
      return failureResponseWithError(res, 404, "User not found");
    }
    if (user.status != 1) {
      return failureResponseWithError(res, 404, "User not active");
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
    const verify = jwt.verify(token, secret);

    const hashPassword = await hashConvertPassword(req.body.password);
    console.log("____HASH", hashPassword);
    const result = await User.updateOne(
      { _id: id }, // Filter criteria to find the user by ID
      { $set: { password: hashPassword } }, // Update operation to set the new password
      { runValidators: true, new: true } // Options: run validators and return the updated document
    );

    return successResponse(res, 200, "Successfully reset your password");
  } catch (error) {
    console.log("RESET USER ERROR", error);

    if (error.name === "TokenExpiredError") {
      return failureResponseWithError(
        res,
        401,
        "Token expired, Please try again"
      );
    }
    return failureResponseWithError(res, 500, "Internal server error");
  }
};
