import generateWeatherResponse from "../config/gemini.js";
import City from "../models/City.js";
import axios from "axios";

export const chatWithWeatherAI = async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Gather User Context (MongoDB + OpenWeather)
    const userCities = await City.find({ user: req.user._id });

    const weatherDetails = await Promise.all(
      userCities.map(async (city) => {
        try {
          const res = await axios.get(
            `${process.env.OPENWEATHER_BASE_URL}/weather`,
            {
              params: {
                q: city.name,
                appid: process.env.OPENWEATHER_API_KEY,
                units: "metric",
              },
            },
          );
          return `${city.name}: ${Math.round(res.data.main.temp)}°C, ${res.data.weather[0].description}, ${res.data.main.humidity}% humidity.`;
        } catch (e) {
          return `${city.name}: (Live data currently unavailable)`;
        }
      }),
    );

    const context =
      weatherDetails.length > 0
        ? weatherDetails.join(" | ")
        : "No cities currently saved in the user's dashboard.";

    // 2. Call the Gemini Agent
    const aiReply = await generateWeatherResponse(message, context);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Gemini Integration Error:", error);
    res
      .status(500)
      .json({ message: "AI Assistant is resting. Try again later." });
  }
};
