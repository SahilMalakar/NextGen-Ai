import { ChatGoogle } from "@langchain/google";
import { config } from "../ChatPromptTempelete/index.js";
import readline from "readline";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  type BaseMessageLike,
} from "@langchain/core/messages";

// Check API key
if (!config.apiKeyGemini) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

// Initialize Gemini model
const modelGemini = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.apiKeyGemini,
  temperature: 0.3,
});

// Terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/*
ChatHistory stores conversation messages.

We store actual message objects used by LangChain.
*/

const ChatHistory: BaseMessageLike[] = [
  new SystemMessage(
    "You are a helpful Humoursly funny AI assistant.Ai Response must of 50 word only",
  ),
];

// Loop functionexit
function ask(): void {
  rl.question("You: ", async (input: string) => {
    if (input === "exit") {
      console.log("Stopping program...");
      rl.close();
      process.exit(0);
    }

    try {
      // Add user message
      ChatHistory.push(new HumanMessage(input));

      // Send conversation history to LLM
      const result = await modelGemini.invoke(ChatHistory);

      // Print response
      console.log("AI:", result.content);

      // Save AI response to history
      ChatHistory.push(new AIMessage(result.content as string));
    } catch (err) {
      console.error("Error:", err);
    }

    ask();
  });
}

console.log("Gemini CLI Chat Started. Type 'exit' to quit.\n");
ask();

// SystemMessage("You are helpful");

// HumanMessage("Who is Kohli?");
// AIMessage("Virat Kohli is an Indian cricketer");

// HumanMessage("Where was he born?");
// AIMessage("He was born in Delhi");
