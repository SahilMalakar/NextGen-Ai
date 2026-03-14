import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { config } from "../index.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

if (!config.apiKeyGroq) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

const prompt1 = new PromptTemplate({
  template: "Generate a detailed report on {topic}",
  inputVariables: ["topic"],
});

const prompt2 = new PromptTemplate({
  template: "Generate a 5 pointer summary from the following text \n {text}",
  inputVariables: ["text"],
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.9,
});

const parser = new StringOutputParser();

// const chain = prompt1.pipe(model).pipe(parser).pipe(prompt2).pipe(model).pipe(parser)

// prompt2 → expects { text: string } (object)

const chain = prompt1
  .pipe(model)
  .pipe(parser)
  .pipe((output) => ({ text: output })) // convert string → { text }
  .pipe(prompt2)
  .pipe(model)
  .pipe(parser);

const result = await chain.invoke({
    "topic": "Research in SemiConductor"
})


console.log(result);

console.log(`graph : ${chain.getGraph().drawMermaid()}`);
