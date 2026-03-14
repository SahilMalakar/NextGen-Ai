import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "../index.js";

if (!config.apiKeyGroq) {
  throw new Error("Groq API key is not configured");
}

// Basic chain: prompt → model → parser
const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.apiKeyGroq,
  temperature: 0,
});

const prompt1 = new PromptTemplate({
  template: "Write a joke about {topic} ",
  inputVariables: ["topic"],
});

const parser = new StringOutputParser();

const prompt2 = new PromptTemplate({
  template: "explain the following joke - {text}",
  inputVariables: ["text"],
});

const chain = RunnableSequence.from([
  prompt1,
  model,
  parser,
  (joke: string) => ({ text: joke }),
  prompt2,
  model,
  parser,
]);

const result = await chain.invoke({ topic: "Ai" });

console.log(result); 

