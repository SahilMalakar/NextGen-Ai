import { config } from "../../index.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogle } from "@langchain/google";
import fs from "fs";

if (!config.apiKeyGemini) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

const template = new PromptTemplate({
  template: `
      Please summarize the research paper titled "{paper_input}" with the following specifications:
      
      Explanation Style: {style_input}  
      Explanation Length: {length_input}
      
      1. Mathematical Details:
         - Include relevant mathematical equations if present in the paper.
         - Explain the mathematical concepts using simple, intuitive code snippets where applicable.
      
      2. Analogies:
         - Use relatable analogies to simplify complex ideas.
      
      If certain information is not available in the paper, respond with:
      "Insufficient information available" instead of guessing.
      
      Ensure the summary is clear, accurate, and aligned with the provided style and length.
      `,

  /*
  inputVariables:
  ----------------
  These are the variables used inside the template.
  LangChain needs this list so it knows what values must be provided.
  */

  inputVariables: ["paper_input", "style_input", "length_input"],

  /*
  validateTemplate:
  ------------------
  This checks if every variable used in the template exists
  inside inputVariables.
  */
  validateTemplate: true,
});

/*
Save the prompt template to a JSON file.
LangChain Python has template.save().
In JS we manually write the JSON.
*/


const prompt = await template.format({
  paper_input: "Attention Is All You Need",
  style_input: "Explain like a university professor",
  length_input: "Medium (4-5 lines) with each line must be of 50 words",
});

console.log(`prompt : ${prompt}`);

const modelGemini = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.apiKeyGemini,
  temperature:0.3
});

const aiMsg = await modelGemini.invoke(prompt);

console.log(`ai msg: ${aiMsg.content}`);



// | Feature     | `new PromptTemplate()` | `fromExamples()`           |
// | ----------- | ---------------------- | -------------------------- |
// | Prompt Type | Single prompt          | Few-shot prompt            |
// | Examples    | ❌ No                  | ✅ Yes                    |
// | Complexity  | Simple                 | More structured            |
// | Common Use  | RAG, summarization     | classification, formatting |
