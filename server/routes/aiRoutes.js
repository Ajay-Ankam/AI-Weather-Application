import express from "express";
import { chatWithWeatherAI } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply the protect middleware so Gemini knows WHO is asking
router.post("/chat", protect, chatWithWeatherAI);

export default router;
