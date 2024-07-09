import express from "express";

import {
  deleteUser,
  findUser,
  findUsers,
  updateUser,
  getUserAppointment,
  getUserProfile,
  forgotUserPassword,
  resetUserPassword,
} from "../controllers/userController.js";
import { authenticate, restrict } from "../auth/veriftToken.js";
const router = express.Router();

// GET
// Get Single User
router.get("/:id", authenticate, restrict(["patient"]), findUser);

// GET
// Get Users List
router.post("/list", authenticate, restrict(["admin"]), findUsers);

// PUT
// Update User
router.put("/:id", authenticate, restrict(["patient"]), updateUser);

// DELETE
// Delete User
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

// POST
// Forgot User Password
router.post("/forgot-password", forgotUserPassword);

// POST
// Reset User Password
router.post("/reset-password/:id/:token", resetUserPassword);

// GET
// Get User Profile
router.get(
  "/profile/details",
  authenticate,
  restrict(["patient"]),
  getUserProfile
);

//GET
// Get User Appointment
router.get(
  "/appointments/find",
  authenticate,
  restrict(["patient"]),
  getUserAppointment
);

export default router;
