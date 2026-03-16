import dotenv from "dotenv";
dotenv.config();

console.log(`WelCome to GenAi !!`);

export const config = {
  apiKeyGroq: process.env.GROQ_API_KEY,
  apiKeyGemini: process.env.GEMINI_API_KEY,
  apiKeyHuggingFace: process.env.HUGGING_FACE_API_KEY,
  apiKeyTavily: process.env.TAVILY_API_KEY,
  apikeyExchange: process.env.exchange_api_key,
};
