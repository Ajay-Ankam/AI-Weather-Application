import axios from "axios";
import City from "../models/City.js";

// @desc    Get live weather for a specific city name
// @route   GET /api/weather/live/:city
export const getLiveWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${process.env.OPENWEATHER_BASE_URL}/weather`,
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric", // Use 'imperial' for Fahrenheit
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Weather data fetch failed",
    });
  }
};

// @desc    Save city to user dashboard
// @route   POST /api/weather/cities
export const addCity = async (req, res) => {
  const { name, lat, lon } = req.body;

  try {
    // Prevent duplicate cities for the SAME user
    const existingCity = await City.findOne({ user: req.user._id, name });
    if (existingCity)
      return res.status(400).json({ message: "City already added" });

    const newCity = await City.create({
      user: req.user._id,
      name,
      lat,
      lon,
    });

    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all saved cities for logged-in user
// @route   GET /api/weather/cities
export const getUserCities = async (req, res) => {
  try {
    const cities = await City.find({ user: req.user._id });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
