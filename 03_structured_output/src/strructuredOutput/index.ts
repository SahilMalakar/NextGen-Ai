import { z } from "zod";
import { ChatGoogle } from "@langchain/google";
import { config } from "../index.js";

if (!config.apiKeyGemini) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

// Zod Schema
const schema = z.object({
  name: z.string().describe("Full name of the person"),
  age: z.number().describe("Age of the person in years"),
  skills: z
    .array(z.string())
    .describe("Programming languages or technical tools the person knows"),
});

// JSON Schema definition
const jsonSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Full name of the person",
    },
    age: {
      type: "number",
      description: "Age of the person in years",
    },
    skills: {
      type: "array",
      description: "Technical skills or programming languages",
      items: {
        type: "string",
      },
    },
  },
  required: ["name", "age", "skills"],
};

const modelGemini = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.apiKeyGemini,
  temperature: 0.3, // low temperature improves deterministic structured responses
});

const structureModel = modelGemini.withStructuredOutput(schema, {
  name: "extract_traits", // tool/function name used internally by the LLM
  strict: true, // forces model output to strictly match the Zod schema
  
});

const JsonResponse = await structureModel.invoke(
  "Rahul Sharma is a 28 year old backend engineer working with Node.js and PostgreSQL.",
);
// LLM extracts info and returns validated JSON based on schema

console.log(`result : ${JSON.stringify(JsonResponse)}`);

// withStructuredOutput() does not magically format text
// It internally converts your Zod schema → JSON schema → tool/function call for the LLM.

// strict: true can cause failures
// If the model outputs "30" instead of 30, validation fails.

// .describe() is more important than most people think
// These descriptions guide the LLM when mapping text → fields.

// Temperature matters for extraction
// Higher temperature increases hallucinations and schema violations.

// The returned value is already parsed JSON
// You do not need JSON.parse().

// LLM is still probabilistic
// Structured output reduces errors but does not eliminate them.

// Schema complexity affects reliability
// Deep nested schemas or unions increase failure probability.

// Always design schemas for extraction, not databases
// LLM schemas should be simple and flat when possible.
