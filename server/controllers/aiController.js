import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { PromptTemplate } from "@langchain/core/prompts";
import City from "../models/City.js";
import axios from "axios";

export const chatWithWeatherAI = async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Initialize Gemini
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "gemini-1.5-flash",
      temperature: 0.7,
    });

    // 2. Define Tools (The Agent's "Eyes")
    const weatherTool = new DynamicTool({
      name: "get_my_weather_dashboard",
      description:
        "Fetches live weather for all cities in the user's dashboard.",
      func: async () => {
        const cities = await City.find({ user: req.user._id });
        // We reuse your logic here to get live data
        const results = await Promise.all(
          cities.map(async (c) => {
            const weather = await axios.get(
              `${process.env.OPENWEATHER_BASE_URL}/weather?q=${c.name}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
            );
            return `${c.name}: ${weather.data.main.temp}°C, ${weather.data.weather[0].description}`;
          }),
        );
        return results.join(", ");
      },
    });

    const tools = [weatherTool];

    // 3. Define the System Prompt (The Agent's "Personality")
    const prompt = PromptTemplate.fromTemplate(`
      You are a Smart Weather Consultant. You have access to the user's saved cities.
      Your goal is to provide:
      1. Natural answers to weather queries.
      2. Activity recommendations (e.g., "Good for a run").
      3. Travel advice based on weather.
      4. Summarized daily briefings.

      Context: {agent_scratchpad}
      User Question: {input}
    `);

    // 4. Execute (Simplified for this example - you can use createReactAgent)
    // For a production-ready assessment, you'd use the AgentExecutor
    const response = await model.invoke([
      [
        "system",
        "You are a helpful weather assistant. Use the provided tools to see the user's weather.",
      ],
      ["human", message],
    ]);

    res.json({ reply: response.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
