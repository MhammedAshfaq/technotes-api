import express from "express";

import {
  updateDoctor,
  deleteDoctor,
  findDoctor,
  findDoctors,
  getDoctorProfile,
  getDoctorBookings,
} from "../controllers/doctorController.js";
const router = express.Router();
import reviewRouter from "./reviewRoute.js";
import { authenticate, restrict } from "../auth/veriftToken.js";

// GET
// Get Single User
router.get("/:id", /*authenticate, restrict(["doctor"]),*/ findDoctor);

// POST
// Get Users List
router.get("/doctors/list", /*authenticate,*/ /*restrict(["doctor"]),*/ findDoctors);

// PUT
// Update User
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);

// DELETE
// Delete User
router.delete("/:id", authenticate, restrict(["doctor"]), deleteDoctor);

// GET
// Get Doctor Profile
router.get(
  "/profile/details",
  authenticate,
  restrict(["doctor"]),
  getDoctorProfile
);

// GET
// Get Booking Details
router.get(
  "/booking/details",
  authenticate,
  restrict(["doctor"]),
  getDoctorBookings
);

// Nested Route
router.use("/:doctorId/review", reviewRouter);

export default router;
