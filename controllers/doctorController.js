import Doctor from "../models/DoctorSchema.js";
import {
  failureResponseWithError,
  successResponse,
  successResponseWithData,
} from "../utility/commonFunction.js";
import Booking from "../models/BookingSchema.js";
import { updateDoctorProfile } from "../utility/validate.js";

// DOCTOR UPDATE API
export const updateDoctor = async (req, res) => {
  const params = req.params.id;
  try {
    // const { error, value } = updateDoctorProfile.validate(req.body);
    // if (error) {
    //   return failureResponseWithError(res, 400, error.details[0].message);
    // }
    const updateDoctor = await Doctor.findByIdAndUpdate(
      params,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updateDoctor) {
      return failureResponseWithError(res, 404, "Doctor not found");
    }

    return successResponseWithData(
      res,
      200,
      "Successfully updated",
      updateDoctor
    );
  } catch (error) {
    console.log("DOCOTR UPDATE ERROR", error);
    return failureResponseWithError(res, 500, "Failed to update");
  }
};

// DELETE DOCTOR API
export const deleteDoctor = async (req, res) => {
  const params = req.params.id;

  try {
    const updateDoctor = await Doctor.findByIdAndUpdate(
      params,
      { $set: { status: 0 } },
      { new: true }
    );

    if (!updateDoctor) {
      return failureResponseWithError(res, 404, "Doctor not found");
    }

    return successResponse(res, 200, "Successfully deleted");
  } catch (error) {
    console.log("DOCTOR DELETE ERROR", error);
    return failureResponseWithError(res, 500, "Failed to delete");
  }
};

//FIND SINGLE DOCTOR
export const findDoctor = async (req, res) => {
  const params = req.params.id;

  try {
    const findDoctor = await Doctor.findById(params)
      .populate("reviews")
      .select("-password");
    if (!findDoctor) {
      return failureResponseWithError(res, 404, "Doctor not found");
    }
    if (findDoctor.status != 1) {
      return failureResponseWithError(res, 400, "Doctor not active");
    }
    const { password, appointments, ...rest } = findDoctor._doc;
    return successResponseWithData(
      res,
      200,
      "Doctor data retrieved successfully",
      rest
    );
  } catch (error) {
    console.log("DOCOTOR UPDATE ERROR", error);
    return failureResponseWithError(res, 500, "Failed to find a doctor");
  }
};

// Find All Doctors
export const findDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let findDoctors;

    if (query) {
      console.log("API HAVE QUERY");
      findDoctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      console.log("API HAVE NOT QUERY");
      findDoctors = await Doctor.find({
        status: 1,
        isApproved: "approved",
      }).select("-password");
    }

    if (findDoctors.length === 0) {
      return failureResponseWithError(res, 404, "Not Data found");
    }

    return successResponseWithData(
      res,
      200,
      "Doctors data retrieved successfully",
      findDoctors
    );
  } catch (error) {
    console.log("DOCTORS LIST ERROR", error);
    return failureResponseWithError(res, 500, "Failed to find a doctors");
  }
};

//Get Doctor Profile
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  // console.log("=======", doctorId);

  try {
    const doctor = await Doctor.findById(doctorId).select("-password");

    if (!doctor) {
      return failureResponseWithError(res, 404, "Doctor not found");
    }

    if (doctor.status !== 1) {
      return failureResponseWithError(res, 400, "Doctor not active");
    }

    const doctorAppointment = await Booking.find({ doctor: doctorId });
    console.log("------", doctorAppointment);

    return successResponseWithData(
      res,
      200,
      "Doctor data retrieved successfully",
      doctorAppointment
    );
  } catch (error) {
    console.log("DOCTORS PROFILE ERROR", error);
    return failureResponseWithError(res, 500, "Internal server error");
  }
};

//Get Doctor Booking details
export const getDoctorBookings = async (req, res) => {
  const doctorId = req.userId;

  try {
    const query = {};

    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    if (doctorId) {
      query.doctor = doctorId;
    }

    query.createdAt = {
      $gte: startOfDay,
      $lte: endOfDay,
    };

    const appointments = await Booking.find(query)
      .populate("doctor", "name email photo")
      .populate("user", "name email");

    return successResponseWithData(
      res,
      200,
      "Appointments fetched successfully",
      appointments
    );
  } catch (error) {
    console.log("DOCTORS BOOKING TOKEN ERROR", error);
    return failureResponseWithError(res, 500, "Internal server error");
  }
};
