import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config()

// apiKey: process.env.GOOGLE_API_KEY 
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function generateWeatherResponse(prompt, context) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      // This sets the permanent 'rules' for the AI
      systemInstruction: `
        You are a Weather AI Assistant. 
        User Context: ${context}
        
        Goals:
        - Summarize saved cities in 2 sentences (Daily Briefing).
        - Recommend health/outdoor activities based on temp/humidity.
        - Advise on travel/packing if multi-city trips are mentioned.
        - If no cities are saved, invite the user to add some.
      `,
      temperature: 0.7,
    },
  });

  return response.text;
}

export default generateWeatherResponse;
