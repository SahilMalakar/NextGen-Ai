import { RunnableParallel, RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "../index.js";

/*
---------------------------------------------------
1️⃣ Ensure API key exists
---------------------------------------------------

We stop the program early if the API key is missing.
Otherwise the model call will fail later.
*/

if (!config.apiKeyGroq) {
  throw new Error("Groq API key is not configured");
}

/*
---------------------------------------------------
2️⃣ Prompt for generating a Tweet
---------------------------------------------------

Input:
{ topic: "AI" }

Output Prompt:
"Generate a tweet about AI"
*/

const promptTweet = new PromptTemplate({
  template: "Generate a tweet about {topic}",
  inputVariables: ["topic"],
});

/*
---------------------------------------------------
3️⃣ Prompt for generating a LinkedIn Post
---------------------------------------------------

Input:
{ topic: "AI" }

Output Prompt:
"Generate a LinkedIn post about AI"
*/

const promptLinkedInPost = new PromptTemplate({
  template: "Generate a LinkedIn post about {topic}",
  inputVariables: ["topic"],
});

/*
---------------------------------------------------
4️⃣ Initialize LLM Model
---------------------------------------------------

This model will be used in BOTH chains.
*/

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.apiKeyGroq,
  temperature: 0,
});

/*
---------------------------------------------------
5️⃣ Output Parser

LLM responses are AIMessage objects.
StringOutputParser converts them into plain text.
*/

const parser = new StringOutputParser();

/*
---------------------------------------------------
6️⃣ RunnableParallel

RunnableParallel executes multiple chains at the SAME TIME.

Each step receives the SAME INPUT and runs independently.

Input:
{ topic: "AI" }

Execution:
 ├─ tweet chain
 └─ linkedIn chain
*/

const parallelChain = new RunnableParallel({
  steps: {
    /*
    Tweet Generation Pipeline

    Flow:
    input → promptTweet → model → parser
    */
    tweet: RunnableSequence.from([promptTweet, model, parser]),

    /*
    LinkedIn Post Generation Pipeline

    Flow:
    input → promptLinkedInPost → model → parser
    */
    linkedIn: RunnableSequence.from([promptLinkedInPost, model, parser]),
  },
});

/*
---------------------------------------------------
7️⃣ Execute the Parallel Pipeline
---------------------------------------------------

Both chains receive the SAME input:
{ topic: "AI" }

Both run simultaneously.
*/

const result = await parallelChain.invoke({ topic: "AI" });

/*
---------------------------------------------------
8️⃣ Result Structure

RunnableParallel returns an object where each key
corresponds to the chain output.
*/

console.log(`LLM response for tweet: ${result.tweet}`);
console.log(`-----------------------------------------------------------------------------------------------------------------------`);

console.log(`LLM response for LinkedIn: ${result.linkedIn}`);
