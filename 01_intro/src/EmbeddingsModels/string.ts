// Embeddings via Inference API
import { config } from "../index.js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

if (!config.apiKeyHuggingFace) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

// Requires HUGGING_FACEHUB_API_TOKEN env var
const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2", // Popular embedding model
  apiKey: config.apiKeyHuggingFace,
});

// embedQuery used for signle string only
const res = await embeddings.embedQuery("hello world");

console.log(`single string ${res}`);
console.log("Vector length:", res.length); // ~384 for MiniLM
console.log("First 5 dims:", res.slice(0, 5));
