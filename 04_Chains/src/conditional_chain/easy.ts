import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";
import { z } from "zod";
import { config } from "../index.js";

/* ---------------------------------------------------
1️⃣ Validate configuration
--------------------------------------------------- */

if (!config.apiKeyGroq) {
  throw new Error("Groq API key is not configured");
}

/* ---------------------------------------------------
2️⃣ Initialize LLM
--------------------------------------------------- */

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.apiKeyGroq,
  temperature: 0,
});

/* ---------------------------------------------------
3️⃣ Define schema for classifier output
--------------------------------------------------- */

const sentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative"]),
});

const parser = StructuredOutputParser.fromZodSchema(sentimentSchema);

/* ---------------------------------------------------
4️⃣ Sentiment classifier chain

Flow:
feedback
   ↓
PromptTemplate
   ↓
LLM
   ↓
Parser
   ↓
{ sentiment }
--------------------------------------------------- */

const classifierPrompt = new PromptTemplate({
  template: `
Classify the sentiment.

{format_instructions}

Feedback: {feedback}
`,
  inputVariables: ["feedback"],
  partialVariables: {
    format_instructions: parser.getFormatInstructions(),
  },
});

const classifierChain = classifierPrompt.pipe(llm).pipe(parser);

/* ---------------------------------------------------
5️⃣ Response prompts
--------------------------------------------------- */

const positivePrompt = new PromptTemplate({
  template: "Write a response to this positive feedback:\n{feedback}",
  inputVariables: ["feedback"],
});

const negativePrompt = new PromptTemplate({
  template: "Write a response to this negative feedback:\n{feedback}",
  inputVariables: ["feedback"],
});

/* ---------------------------------------------------
6️⃣ Response generation chains

These chains simply:
prompt → LLM → response
--------------------------------------------------- */

const positiveChain = positivePrompt.pipe(llm);
const negativeChain = negativePrompt.pipe(llm);

/* ---------------------------------------------------
7️⃣ Router using JavaScript logic

Instead of RunnableBranch, we directly write
the routing logic using a JS if statement.

Input received:
{
  feedback: "...",
  sentiment: "positive" | "negative"
}

Routing logic:
if sentiment is positive → positiveChain
else → negativeChain
--------------------------------------------------- */

const router = RunnableLambda.from(
  async (input: { feedback: string; sentiment: string }) => {
    if (input.sentiment === "positive") {
      return positiveChain.invoke(input);
    }

    return negativeChain.invoke(input);
  },
);

/* ---------------------------------------------------
8️⃣ Final pipeline

Step 1:
Run classifier.

Step 2:
Attach sentiment to the input.

Step 3:
Send to router for conditional execution.
--------------------------------------------------- */

const finalChain = RunnableLambda.from(async (input: { feedback: string }) => {
  const result = await classifierChain.invoke(input);

  return {
    feedback: input.feedback,
    sentiment: result.sentiment,
  };
}).pipe(router);

/* ---------------------------------------------------
9️⃣ Run the pipeline
--------------------------------------------------- */

const result = await finalChain.invoke({
  feedback: "this is a terrible smartphone",
});

console.log(result.content);
