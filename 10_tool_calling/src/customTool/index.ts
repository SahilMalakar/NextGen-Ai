import { DynamicStructuredTool } from "@langchain/core/tools";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api"
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { config } from "../index.js";

if (!config.apiKeyTavily || !config.apiKeyGroq) {
  console.log("API key is not present");
  throw new Error("API key is not present");
}
// -----------------------------
// 1️⃣ Multiply Tool
// -----------------------------

const multiplyTool = new DynamicStructuredTool({
  name: "multiply_numbers",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number(),
    b: z.number(),
  }),
  func: async ({ a, b }) => {
    return (a * b).toString();
  },
});

// -----------------------------
// 2️⃣ Database Tool (Mock)
// -----------------------------

const databaseTool = new DynamicStructuredTool({
  name: "get_user_from_database",
  description: "Fetch user information from database using user id",
  schema: z.object({
    userId: z.number(),
  }),

  func: async ({ userId }) => {
    const fakeDB = [
      { id: 1, name: "Sahil", role: "Engineer" },
      { id: 2, name: "Raj", role: "Designer" },
    ];

    const user = fakeDB.find((u) => u.id === userId);

    if (!user) return "User not found";

    return JSON.stringify(user);
  },
});

// -----------------------------
// 3️⃣ Tavily Search Tool
// -----------------------------


const retriever = new TavilySearchAPIRetriever({
  apiKey: config.apiKeyTavily,
  k: 3,
});

const tavilyTool = new DynamicStructuredTool({
  name: "web_search",
  description: "Search the internet for recent information",
  schema: z.object({
    query: z.string().describe("search query"),
  }),

  func: async ({ query }) => {
    const docs = await retriever.invoke(query);

    return docs.map((doc) => doc.pageContent).join("\n\n");
  },
});


// -----------------------------
// 4️⃣ LLM
// -----------------------------

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  apiKey: config.apiKeyGroq,
});

// -----------------------------
// 5️⃣ Bind Tools
// -----------------------------

const llmWithTools = model.bindTools([multiplyTool, databaseTool,tavilyTool]);

// -----------------------------
// 6️⃣ Ask Question
// -----------------------------

const query = `
Use the web_search tool to compute the result.

Question: What is 8 multiplied by 12?
`;

const response = await llmWithTools.invoke(query);

const query1 = `
Use the multiply_numbers tool to compute the result.

Question: What is 8 multiplied by 12?
`;

const response1 = await llmWithTools.invoke(query1);

console.log(response.content);
console.log(response.tool_calls);
console.log(response1.content);
console.log(response1.tool_calls);
