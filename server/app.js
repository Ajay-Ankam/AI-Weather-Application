import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Basic Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port http://localhost:${PORT}`,
  );
});
