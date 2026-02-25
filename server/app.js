import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import { protect } from "./middleware/authMiddleware.js";

// dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

// Basic Health Check Route

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/test-auth", protect, (req, res) => {
  res.json({ message: `Access granted for ${req.user.name}` });
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port http://localhost:${PORT}`,
  );
});
