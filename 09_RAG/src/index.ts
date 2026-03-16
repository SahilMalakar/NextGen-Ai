import dotenv from "dotenv";
dotenv.config();

console.log(`WelCome to GenAi !!`);

export const config = {
  apiKeyGroq: process.env.GROQ_API_KEY,
  apiKeyGemini: process.env.GEMINI_API_KEY,
  apiKeyHuggingFace: process.env.HUGGING_FACE_API_KEY,
  apikeyChroma: process.env.CHROMA_API_KEY,
  ChromaTenent: process.env.CHROMA_TENANT,
  chromaDb: process.env.CHROMA_DATABASE,
};
