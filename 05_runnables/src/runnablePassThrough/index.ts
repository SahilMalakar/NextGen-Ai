import {
  RunnableParallel,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogle } from "@langchain/google";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "../index.js";

/*
---------------------------------------------------
1️⃣ Validate API key
---------------------------------------------------
*/

if (!config.apiKeyGemini) {
  throw new Error("Gemini API key is not configured");
}

/*
---------------------------------------------------
2️⃣ Initialize the Gemini model
---------------------------------------------------

This model will be used twice:
1. Generate a joke
2. Explain the joke
*/

const model = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.apiKeyGemini,
  temperature: 0,
});

/*
---------------------------------------------------
3️⃣ Prompt to generate a joke
---------------------------------------------------

Input:
{ topic: "AI" }

Output prompt:
"Write a joke about AI"
*/

const prompt1 = new PromptTemplate({
  template: "Write a joke about {topic}",
  inputVariables: ["topic"],
});

/*
---------------------------------------------------
4️⃣ Prompt to explain the joke
---------------------------------------------------

Input:
{ text: "generated joke" }

Output prompt:
"Explain the following joke - ..."
*/

const prompt2 = new PromptTemplate({
  template: "Explain the following joke - {text}",
  inputVariables: ["text"],
});

/*
---------------------------------------------------
5️⃣ Parser converts AIMessage → string
---------------------------------------------------
*/

const parser = new StringOutputParser();

/*
---------------------------------------------------
6️⃣ Joke generation chain

Flow:
topic → prompt1 → model → parser

Output:
"generated joke text"
*/

const jokeGenChain = RunnableSequence.from([prompt1, model, parser]);

/*
---------------------------------------------------
7️⃣ Parallel chain

This runs TWO tasks at the same time:

Input expected:
"joke string"

Outputs:
{
  joke: "joke string",
  explanation: "explanation of joke"
}

Steps:
- joke: passthrough (returns the joke unchanged)
- explanation: generates explanation using LLM
*/

const parallelChain = new RunnableParallel({
  steps: {
    // simply pass the joke forward
    joke: new RunnablePassthrough(),

    // convert string → { text } before sending to prompt
    explanation: RunnableSequence.from([
      (joke: string) => ({ text: joke }),
      prompt2,
      model,
      parser,
    ]),
  },
});

/*
---------------------------------------------------
8️⃣ Final pipeline

Flow:

topic
 ↓
jokeGenChain
 ↓
"generated joke"
 ↓
parallelChain
 ↓
{
  joke: "...",
  explanation: "..."
}
*/

const finalChain = RunnableSequence.from([jokeGenChain, parallelChain]);

/*
---------------------------------------------------
9️⃣ Execute chain
---------------------------------------------------
*/

const result = await finalChain.invoke({
  topic: "AI",
});

console.log("Joke:", result.joke);
console.log("Explanation:", result.explanation);
