import express from "express";
import { authenticate } from "../auth/veriftToken.js";
import { getCheckoutSession } from "../controllers/bookingController.js";

const router = express.Router();

// POST
// BOOKING API
router.post("/checkout-sesstion/:doctorId", authenticate, getCheckoutSession);

export default router;
