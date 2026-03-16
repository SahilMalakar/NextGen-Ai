import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { DynamicTool } from "@langchain/core/tools";

import { config } from "../index.js";

if (!config.apiKeyTavily) {
  console.log("API key is not present");
  throw new Error("API key is not present");
}

const retriever = new TavilySearchAPIRetriever({
  apiKey: config.apiKeyTavily,
  k: 3,
});

const docs = await retriever.invoke("Israel Iran conflict");

console.log(docs[0]?.pageContent);
