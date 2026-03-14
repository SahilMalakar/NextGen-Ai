import {
  RunnableLambda,
  RunnableParallel,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "../index.js";

if (!config.apiKeyGroq) {
  throw new Error("Groq API key is not configured");
}

/* LLM model */
const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.apiKeyGroq,
  temperature: 0,
});

/* Prompt template */
const prompt1 = new PromptTemplate({
  template: "Write a joke about {topic}",
  inputVariables: ["topic"],
});

const parser = new StringOutputParser();

/* Joke generation pipeline
topic → prompt → model → parser
*/
const jokeGenChain = RunnableSequence.from([prompt1, model, parser]);

/* Plain JavaScript function */
function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

/*
Parallel processing step
Input: "generated joke"

Two operations happen in parallel:
1. joke → passthrough (return joke)
2. wordCount → run JS function
*/
const parallelChain = new RunnableParallel({
  steps: {
    joke: new RunnablePassthrough(),

    wordCount: new RunnableLambda({
      func: wordCount,
    }),
  },
});

/* Final pipeline */
const chain = RunnableSequence.from([jokeGenChain, parallelChain]);

const result = await chain.invoke({ topic: "AI" });

console.log(result);
