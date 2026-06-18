import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey || 'mock_key');

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Chat request received:", message);
    fs.appendFileSync('chat_log.txt', `Req: ${message}\n`);

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful, encouraging, and highly knowledgeable Eco-friendly Carbon Tracker Assistant.
Your goal is to help users understand their carbon footprint, give actionable sustainability tips, and answer questions about the Carbon Footprint Tracker app.
The app allows users to log travel, energy, diet, and shopping activities to track their CO2e (carbon dioxide equivalent) emissions. It uses gamification (badges, levels) to encourage green choices.

The user asks: "${message}"

Keep your response concise, friendly, and structured. Use emojis occasionally. Provide practical advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Chat error:", error);
    fs.appendFileSync('chat_log.txt', `Err: ${error.message}\n`);
    res.status(500).json({ message: "Error communicating with AI service" });
  }
};
