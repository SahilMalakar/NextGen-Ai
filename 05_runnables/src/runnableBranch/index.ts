import {
  RunnableBranch,
  RunnableLambda,
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

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.apiKeyGroq,
  temperature: 0,
});

const prompt1 = new PromptTemplate({
  template: "Write a detailed report on {topic}",
  inputVariables: ["topic"],
});

const parser = new StringOutputParser();

const prompt2 = new PromptTemplate({
  template: "Summarize the following text in under 100 words:\n{text}",
  inputVariables: ["text"],
});

const reportGenerationChain = RunnableSequence.from([prompt1, model, parser]);

const summarizeChain = RunnableSequence.from([
  RunnableLambda.from((text: string) => ({ text })),
  prompt2,
  model,
  parser,
]);

const branchChain = RunnableBranch.from([
  [
    RunnableLambda.from((x: string) => x.split(" ").length > 200),
    summarizeChain,
  ],
  new RunnablePassthrough<string>(),
]);

const finalChain = RunnableSequence.from([reportGenerationChain, branchChain]);

const result = await finalChain.invoke({
  topic: "Russia vs Ukraine",
});

console.log(result);
