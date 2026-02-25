import express from "express";
import {
  getLiveWeather,
  addCity,
  getUserCities, toggleFavorite, deleteCity
} from "../controllers/weatherController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All weather routes require a valid token
router.use(protect);

router.get("/live/:city", getLiveWeather);
router.post("/cities", addCity);
router.get("/cities", getUserCities);
router.patch("/cities/:id/favorite", toggleFavorite);
router.delete("/cities/:id", protect, deleteCity);

export default router;
