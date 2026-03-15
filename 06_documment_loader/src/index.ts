import dotenv from "dotenv";
dotenv.config();

console.log(`WelCome to GenAi !!`);

export const config = {
  apiKeyGroq: process.env.GROQ_API_KEY,
  apiKeyGemini: process.env.GEMINI_API_KEY,
  apiKeyHuggingFace: process.env.HUGGING_FACE_API_KEY,
  apiKeyUnstructured: process.env.UNSTRUCTURED_API_KEY,
};
