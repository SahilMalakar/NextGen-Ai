import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { UnstructuredDirectoryLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { HTMLWebBaseLoader } from "@langchain/community/document_loaders/web/html";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { config } from "../index.js";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

if (!config.apiKeyUnstructured || !config.apiKeyGroq) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

// const filePath = path.join(
//   process.cwd(),
//   "docs",
//   "Building Machine Learning Systems with Python - Second Edition.pdf",
//   "dl-curriculum.pdf",
// );

// const loader = new PDFLoader(filePath);

// const loader = new UnstructuredDirectoryLoader("docs", {
//   apiKey:config.apiKeyUnstructured!,
//   apiUrl: "https://api.unstructuredapp.io/general/v0/general",
// });

const loader = new CheerioWebBaseLoader(
  "https://en.wikipedia.org/wiki/Maharana_Pratap",
);

const modelGroq = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0.9,
  maxRetries: 2,
});

const prompt = new PromptTemplate({
  template: "Answer the following question \n {question} from the following text - \n {text}",
  inputVariables:["question","text"]
})

const parser = new StringOutputParser();

const docs = await loader.load();

const chain = prompt.pipe(modelGroq).pipe(parser);

const result = await chain.invoke({
  "question": "how many maharana pratap fought?",
  "text":docs[0]?.pageContent
})

console.log(result)
