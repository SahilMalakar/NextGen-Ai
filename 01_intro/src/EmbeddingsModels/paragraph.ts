// Embeddings via Inference API
import { config } from "../index.js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

if (!config.apiKeyHuggingFace) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: config.apiKeyHuggingFace,
});

const paraGraph = [
  "Delhi is the capital of India",
  "Kolkata is the capital of West Bengal",
  "Paris is the capital of France",
];

// embedDocuments used for array of string
const res = await embeddings.embedDocuments(paraGraph);


console.log("Embeddings:", res);
console.log("Number of vectors:", res.length);
console.log("Vector length:", res[0]?.length);
console.log("First 5 dims:", res[0]?.slice(0, 5));

