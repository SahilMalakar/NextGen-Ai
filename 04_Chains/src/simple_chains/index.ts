import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { config } from "../index.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

if (!config.apiKeyGroq) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

const prompt = new PromptTemplate({
  template: "Generate 5 interesting facts about {topic}",
  inputVariables: ["topic"],
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.9,
});

const parser = new StringOutputParser();


const chain = prompt.pipe(model).pipe(parser);

// creates runnable pipeline
// LCEL pipeline: prompt → model → parse text output

const result = await chain.invoke({
  topic: "Latest Tech",
});

console.log(result);


console.log(`graph : ${chain.getGraph().drawMermaid()}`);
