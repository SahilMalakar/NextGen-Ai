// config file usually loads environment variables like API keys
// Example: GOOGLE_API_KEY, GROQ_API_KEY
// Keeping secrets in a config layer avoids hardcoding them in code.
import { config } from "../index.js";

// LangChain provider integrations
import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";

async function main() {
  // Validate required API keys
  if (!config.apiKeyGemini || !config.apiKeyGroq) {
    console.log("API key is missing");
    throw new Error("API key not configured");
  }

  // -----------------------------
  // Groq Model Initialization
  // -----------------------------
  const modelGroq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.9,
    maxRetries: 2,
  });

  // -----------------------------
  // Gemini Model Initialization
  // -----------------------------
  const modelGemini = new ChatGoogle({
    model: "gemini-2.5-flash",
    apiKey: config.apiKeyGemini,
  });

  // Choose which model to use
  const model = modelGemini;
  // const model = modelGroq;

  // -----------------------------
  // LLM Invocation
  // -----------------------------
  const aiMsg = await model.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant that provides answers based on your knowledge.",
    },
    {
      role: "user",
      content: "Write a poem of toxic love",
    },
  ]);

  console.log(`ai msg: ${aiMsg.content}`);
}

main();
