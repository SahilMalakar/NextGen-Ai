import { ChatGoogle } from "@langchain/google";
import { config } from "../../index.js";
import readline from "readline";
import type { BaseMessageLike } from "@langchain/core/messages";

// Check if API key exists
if (!config.apiKeyGemini) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

// Initialize Gemini LLM
const modelGemini = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.apiKeyGemini,
  temperature: 0.3,
});

// Create terminal input interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/*
ChatHistory stores conversation messages.

Type: BaseMessageLike[]

Example structure:
[
 { role: "user", content: "Hello" },
 { role: "assistant", content: "Hi there!" }
]
*/

const ChatHistory: BaseMessageLike[] = [];

// Loop function
function ask(): void {
  rl.question("You: ", async (input: string) => {
    // Exit condition
    if (input === "exit") {
      console.log("Stopping program...");
      rl.close();
      process.exit(0);
    }

    try {
      // Add user message to history
      ChatHistory.push({
        role: "user",
        content: input,
      });

      // Send full chat history to model
      const result = await modelGemini.invoke(ChatHistory);

      // Print AI response
      console.log("AI:", result.content);

      // Add AI response to history
      ChatHistory.push({
        role: "assistant",
        content: result.content as string,
      });
    } catch (err) {
      console.error("Error:", err);
    }

    // Continue loop
    ask();
  });
}

console.log("Gemini CLI Chat Started. Type 'exit' to quit.\n");
ask();
