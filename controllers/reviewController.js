import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";
import {
  failureResponseWithError,
  successResponse,
  successResponseWithData,
} from "../utility/commonFunction.js";
import { createDoctorReview } from "../utility/validate.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    if (reviews.length === 0) {
      return failureResponseWithError(res, 404, "No Data found");
    }
    return successResponseWithData(
      res,
      200,
      "Reviews data retrieved successfully",
      reviews
    );
  } catch (error) {
    return failureResponseWithError(res, 500, "Internal server error");
  }
};

// Create review
export const createReview = async (req, res) => {
  const { error, value } = createDoctorReview.validate(req.body);
  if (error) {
    return failureResponseWithError(res, 400, error.details[0].message);
  }

  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.userId;

  const newReview = new Review(req.body);
  try {
    const savedReview = await newReview.save();
    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });
    return successResponse(res, 200, "Successfully addded review");
  } catch (error) {
    return failureResponseWithError(res, 500, "Internal serever error");
  }
};
