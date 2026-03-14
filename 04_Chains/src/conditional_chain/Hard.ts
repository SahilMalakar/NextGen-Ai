import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableLambda } from "@langchain/core/runnables";
import { z } from "zod";
import { config } from "../index.js";

/* ---------------------------------------------------
1️⃣ Ensure API key exists before creating the model.
   This prevents runtime failures later.
--------------------------------------------------- */
if (!config.apiKeyGroq) {
  throw new Error("Groq API key is not configured");
}

/* ---------------------------------------------------
2️⃣ Initialize the LLM model.
   This model will be used in two places:
   - sentiment classification
   - response generation
--------------------------------------------------- */
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.apiKeyGroq,
  temperature: 0,
});

/* ---------------------------------------------------
3️⃣ Define the structured output schema.

We want the LLM classifier to return structured JSON:
{
  sentiment: "positive" | "negative"
}

Zod validates the LLM output to ensure it matches
the expected structure.
--------------------------------------------------- */
const sentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative"]),
});

const sentimentParser = StructuredOutputParser.fromZodSchema(sentimentSchema);

/* ---------------------------------------------------
4️⃣ Sentiment Classification Chain

Flow:
User feedback
   ↓
PromptTemplate
   ↓
LLM
   ↓
StructuredOutputParser
   ↓
{ sentiment: "positive" | "negative" }

This chain is responsible ONLY for classification.
--------------------------------------------------- */
const classifierPrompt = new PromptTemplate({
  template: `
Classify the sentiment of the following feedback.

{format_instructions}

Feedback: {feedback}
`,
  inputVariables: ["feedback"],
  partialVariables: {
    format_instructions: sentimentParser.getFormatInstructions(),
  },
});

const classifierChain = classifierPrompt.pipe(llm).pipe(sentimentParser);

/* ---------------------------------------------------
5️⃣ Response prompts

These prompts instruct the LLM how to respond
depending on the sentiment detected earlier.
--------------------------------------------------- */
const positiveResponsePrompt = new PromptTemplate({
  template: "Write a response to this positive feedback:\n{feedback}",
  inputVariables: ["feedback"],
});

const negativeResponsePrompt = new PromptTemplate({
  template: "Write a response to this negative feedback:\n{feedback}",
  inputVariables: ["feedback"],
});

/* ---------------------------------------------------
6️⃣ Response Chains

The router will pass an object like:
{
  feedback: "...",
  sentiment: "positive"
}

However the prompt only needs:
{
  feedback: "..."
}

So the RunnableLambda removes the "sentiment" field
and forwards only the feedback to the prompt.
--------------------------------------------------- */

const positiveResponseChain = RunnableLambda.from(
  (input: { feedback: string; sentiment: string }) => ({
    feedback: input.feedback,
  }),
)
  .pipe(positiveResponsePrompt)
  .pipe(llm);

const negativeResponseChain = RunnableLambda.from(
  (input: { feedback: string; sentiment: string }) => ({
    feedback: input.feedback,
  }),
)
  .pipe(negativeResponsePrompt)
  .pipe(llm);

/* ---------------------------------------------------
7️⃣ Router (Conditional Branch)

RunnableBranch works like an IF/ELSE router.

Input received:
{
  feedback: "...",
  sentiment: "positive" | "negative"
}

Router logic:
if sentiment === "positive"
   → run positiveResponseChain
else
   → run negativeResponseChain
--------------------------------------------------- */

const sentimentRouter = new RunnableBranch({
  branches: [
    [
      RunnableLambda.from(
        (input: { sentiment: string }) => input.sentiment === "positive",
      ),
      positiveResponseChain,
    ],
  ],
  default: negativeResponseChain,
});

/* ---------------------------------------------------
8️⃣ Final Pipeline

This pipeline does two things:

Step 1:
Run the sentiment classifier.

Step 2:
Attach the detected sentiment to the original input
so the router can decide which response chain to run.

Output after this step:
{
  feedback: "...",
  sentiment: "positive" | "negative"
}

Then the router receives this object.
--------------------------------------------------- */

const sentimentPipeline = RunnableLambda.from(
  async (input: { feedback: string }) => {
    const classification = await classifierChain.invoke(input);

    return {
      feedback: input.feedback,
      sentiment: classification.sentiment,
    };
  },
).pipe(sentimentRouter);

/* ---------------------------------------------------
9️⃣ Execute Pipeline

Input:
{
  feedback: "this is a wonderful smartphone"
}

Pipeline performs:
feedback → classify sentiment → route → generate reply
--------------------------------------------------- */

const result = await sentimentPipeline.invoke({
  feedback: "this is a worderfull smartphone",
});

console.log(result.content);
