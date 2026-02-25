import axios from "axios";
import City from "../models/City.js";

// @desc    Get live weather for a specific city name (on-the-fly search)
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
          units: "metric",
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
  const { name } = req.body;

  try {
    // 1. Check if city already exists for this specific user
    const existingCity = await City.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCity) {
      return res
        .status(400)
        .json({ message: "City already in your dashboard" });
    }

    // 2. Fetch live data to verify the city exists and get official names/coords
    const weatherRes = await axios.get(
      `${process.env.OPENWEATHER_BASE_URL}/weather`,
      {
        params: {
          q: name,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      },
    );

    const weatherData = weatherRes.data;

    // 3. Save to Database
    const newCity = await City.create({
      user: req.user._id,
      name: weatherData.name,
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
    });

    // 4. Return combined result
    res.status(201).json({
      message: "City added successfully",
      savedCity: newCity,
      liveWeather: {
        temp: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all saved cities with LIVE weather for logged-in user
// @route   GET /api/weather/cities
export const getUserCities = async (req, res) => {
  try {
    // 1. Fetch the user's saved cities from MongoDB
    const cities = await City.find({ user: req.user._id });

    // 2. Create parallel API calls for each saved city
    const weatherPromises = cities.map(async (city) => {
      try {
        const response = await axios.get(
          `${process.env.OPENWEATHER_BASE_URL}/weather`,
          {
            params: {
              q: city.name,
              appid: process.env.OPENWEATHER_API_KEY,
              units: "metric",
            },
          },
        );

        const data = response.data;

        // Merge DB data with real-time API data
        return {
          _id: city._id,
          name: city.name,
          isFavorite: city.isFavorite,
          coordinates: { lat: city.lat, lon: city.lon },
          currentWeather: {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
          },
        };
      } catch (err) {
        // Handle individual city failure gracefully
        return {
          _id: city._id,
          name: city.name,
          isFavorite: city.isFavorite,
          error: "Live data currently unavailable",
        };
      }
    });

    // 3. Execute all requests at once
    const weatherResults = await Promise.all(weatherPromises);

    res.status(200).json(weatherResults);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error: Could not retrieve dashboard data" });
  }
};


// @desc    Toggle favorite status of a city
// @route   PATCH /api/weather/cities/:id/favorite
export const toggleFavorite = async (req, res) => {
  try {
    // 1. Find the city by ID
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // 2. Data Isolation: Ensure this city belongs to the logged-in user
    if (city.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to modify this city" });
    }

    // 3. Toggle the boolean value
    city.isFavorite = !city.isFavorite;
    await city.save();

    res.status(200).json({
      message: `City ${city.isFavorite ? 'added to' : 'removed from'} favorites`,
      city
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};