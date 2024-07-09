import {
  convertPassword,
  failureResponseWithError,
  hashConvertPassword,
  successResponse,
  successResponseWithData,
} from "../utility/commonFunction.js";
import { registrationSchema, userLoginSchema } from "../utility/validate.js";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import { generateToken } from "../utility/jsonwebtoken.js";

//SIGN-UP
export const register = async (req, res) => {
  try {
    const { role, email, name, password, gender, photo } = req.body;
    const { error, value } = registrationSchema.validate(req.body);
    if (error) {
      return failureResponseWithError(res, 400, error.details[0].message);
    }

    let user = null;

    let patient = await User.findOne({ email });

    let doctor = await Doctor.findOne({ email });

    if (patient) user = patient;
    if (doctor) user = doctor;

    // Check if user exist or not
    if (user) {
      return failureResponseWithError(res, 400, "User already exist.");
    }
    const hashPassword = await hashConvertPassword(password);
    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        role,
        gender,
        photo,
        status: 1,
      });
    }

    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        role,
        gender,
        photo,
        status: 1,
      });
    }
    await user.save();

    return successResponse(res, 201, "User created successfully.");
  } catch (error) {
    console.log("ERROR", error);
    return failureResponseWithError(res, 500, "Internal server error.");
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error, value } = userLoginSchema.validate(req.body);
    if (error) {
      return failureResponseWithError(res, 400, error.details[0].message);
    }

    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
      if (user.status != 1) {
        return failureResponseWithError(res, 400, "Patient not active");
      }
    }
    if (doctor) {
      user = doctor;
      if (user.status != 1) {
        return failureResponseWithError(res, 400, "Doctor not active");
      }
    }

    if (!user) {
      return failureResponseWithError(res, 400, "User not found");
    }

    const comparePassword = await convertPassword(password, user.password);
    if (!comparePassword) {
      return failureResponseWithError(res, 400, "Invalid password");
    }

    const token = await generateToken(user, res);
    const { password: hashPassword, ...rest } = user._doc;

    return successResponseWithData(res, 200, "Successfully login", {
      ...rest,
      token,
    });
  } catch (error) {
    console.log("ERROR", error);
    return failureResponseWithError(res, 500, "Internal server error.");
  }
};
