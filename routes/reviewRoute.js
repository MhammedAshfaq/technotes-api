import express from "express";
import {
  createReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import { authenticate, restrict } from "../auth/veriftToken.js";

const router = express.Router({ mergeParams: true }); // This mergeParams is for merge route

// POST
// Create Review
router.post("/create", authenticate, restrict(["patient"]), createReview);

// POST
// Get All Review
router.post("/list", authenticate, getAllReviews);

export default router;
