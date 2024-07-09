import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// POST
// Register
router.post("/register", register);

// POST
// Login
router.post("/login", login);

export default router;
