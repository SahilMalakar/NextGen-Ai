import { config } from "../../index.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogle } from "@langchain/google";


if (!config.apiKeyGemini) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

/*
examples: string[]
-----------------------------------
List of example prompts that demonstrate the pattern.
These act as "training examples" for the LLM inside the prompt.
*/

const examples = [
  "User: Tell me a joke about cats\nAI: Why did the cat sit on the computer? To keep an eye on the mouse!",
  "User: Tell me a joke about dogs\nAI: Why did the dog sit in the shade? Because he didn't want to be a hot dog!",
];

/*
suffix: string
-----------------------------------
This is the FINAL prompt that will be filled with the user's input.
It usually contains placeholders like {topic}.
*/

const suffix = "User: Tell me a joke about {topic}\nAI:";

/*
inputVariables: string[]
-----------------------------------
List of variables used inside the suffix.
LangChain needs this to know which values will be injected.
*/

const inputVariables = ["topic"];

/*
exampleSeparator (optional)
-----------------------------------
String used to separate the examples.
Usually newline or double newline.
*/

const exampleSeparator = "\n\n";

/*
prefix (optional)
-----------------------------------
Text that appears BEFORE the examples.
Used to give instructions to the LLM.
*/

const prefix = "You are a funny comedian. Here are some examples:";

// Used for few-shot prompting.
const promptTemplate = PromptTemplate.fromExamples(
  examples,
  suffix,
  inputVariables,
  exampleSeparator,
  prefix,
);

// format() replaces {topic} with the actual value

// Always write variables like: {variableName}

// NOT: ${variableName}

const prompt = await promptTemplate.format({
  topic: "programming",
});
console.log(`prompt : ${prompt}`);

const modelGemini = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.apiKeyGemini,
  temperature:1.5
});

const aiMsg = await modelGemini.invoke(prompt);

console.log(`ai msg: ${aiMsg.content}`);