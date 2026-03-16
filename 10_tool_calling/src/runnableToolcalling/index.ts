import { DynamicStructuredTool } from "@langchain/core/tools";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { z } from "zod";
import { config } from "../index.js";

console.log("WelCome to GenAi !!");

if (!config.apiKeyTavily || !config.apiKeyGroq) {
  throw new Error("API key is not present");
}

const multiplyTool = new DynamicStructuredTool({
  name: "multiply_numbers",
  description: "Multiply two numbers",
  schema: z.object({ a: z.number(), b: z.number() }),
  func: async ({ a, b }) => (a * b).toString(),
});

const databaseTool = new DynamicStructuredTool({
  name: "get_user_from_database",
  description: "Fetch user information using user id",
  schema: z.object({ userId: z.number() }),
  func: async ({ userId }) => {
    const fakeDB = [
      { id: 1, name: "Sahil", role: "Engineer" },
      { id: 2, name: "Raj", role: "Designer" },
    ];
    const user = fakeDB.find((u) => u.id === userId);
    return user ? JSON.stringify(user) : "User not found";
  },
});

const retriever = new TavilySearchAPIRetriever({
  apiKey: config.apiKeyTavily,
    k: 3, // more results → one search covers all 10 countries
});

const tavilyTool = new DynamicStructuredTool({
  name: "web_search",
  description: "Search the internet for real-time information",
  schema: z.object({ query: z.string() }),
  func: async ({ query }) => {
  const docs = await retriever.invoke(query);
  const result = docs
    .filter((d) => d.pageContent != null)  // ← filter null results
    .map((d) => d.pageContent.slice(0, 800))
    .join("\n\n");

  console.log("Tavily raw output:\n", result);
  return result || "No results found";  // ← fallback if all results are null
},
});
const toolMap = {
  multiply_numbers: multiplyTool,
  get_user_from_database: databaseTool,
  web_search: tavilyTool,
};

// FIX 1 — correct model name
const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",  // ← you still have "openai/gpt-oss-120b"
  temperature: 0,
  apiKey: config.apiKeyGroq,
});

const llmWithTools = model.bindTools([multiplyTool, databaseTool, tavilyTool]);

// ------------------------------------------------
// SYSTEM PROMPT — the key to single-shot tool use.
//
// Without explicit instructions the LLM keeps issuing tool_calls
// after each result instead of writing a final answer.
// We force it to: (1) search once, (2) answer immediately after.
// ------------------------------------------------

const SYSTEM_PROMPT = `You are a research assistant with access to multiple tools.

Rules you MUST follow:
1. Analyze the user query and call ALL relevant tools in a SINGLE response (parallel tool calls).
2. Do NOT call tools one by one across multiple turns.
3. After receiving ALL tool results, immediately produce your final answer.
4. Do NOT call any tool again after receiving results.
5. If part of the request does not require any tool, answer it directly from your own knowledge.`


// ------------------------------------------------
// PROMPT TEMPLATE
// ------------------------------------------------

const promptTemplate = new PromptTemplate({
  template: `List the current Prime Minister or President of the top {count} major countries in the world.

Requirements:
- Ensure the information is current.
- Include the exact date when the leader assumed office.
- Rank the countries from 1 to {count}.

Output format:
Ranking --> Leader Name --> Date Became PM/President --> Country`,
  inputVariables: ["count"],
});

// ------------------------------------------------
// PIPELINE — strictly linear, so RunnableSequence is the right fit:
//
//  Step 1 │ formatPrompt  → builds the user message string
//  Step 2 │ callLLM       → LLM calls web_search exactly once
//  Step 3 │ executeTool   → runs the tool, sends result back, gets final answer
// ------------------------------------------------

const pipeline = RunnableSequence.from([
  // STEP 1 — format prompt
  new RunnableLambda({
    func: async (userMessage: string) => userMessage,
  }),

  // STEP 2 — first LLM call
  new RunnableLambda({
    func: async (userMessage: string) => {
      const response = await llmWithTools.invoke([
        new SystemMessage(SYSTEM_PROMPT),
        new HumanMessage(userMessage),
      ]);
      return { userMessage, response };
    },
  }),

  // STEP 3 — execute tool call(s), then get final answer in one shot
  new RunnableLambda({
    func: async ({ userMessage, response }: any) => {
      // LLM answered directly without tools (rare but handle it)
      if (!response.tool_calls || response.tool_calls.length === 0) {
        return response.content;
      }

      const toolMessages: ToolMessage[] = await Promise.all(
        response.tool_calls.map(async (call: any) => {
          const tool = toolMap[call.name as keyof typeof toolMap];
          if (!tool) throw new Error(`Tool not found: ${call.name}`);

          console.log(`\nCalling tool: ${call.name} →`, call.args);
          const result = await (tool as any).invoke(call.args);

          return new ToolMessage({ content: result, tool_call_id: call.id });
        }),
      );

      // Final LLM call — system prompt tells it: no more tools, just answer
      const final = await llmWithTools.invoke([
        new SystemMessage(SYSTEM_PROMPT),
        new HumanMessage(userMessage),
        response, // assistant message with tool_calls
        ...toolMessages, // tool results
      ]);

      return final.content;
    },
  }),
]);

// ------------------------------------------------
// RUN
// ------------------------------------------------

// FIX 2 — more specific search query from the user prompt
const result = await pipeline.invoke(
  `Do the following in parallel:
   1. Search the web for "List all G20 heads of state 2025 complete"
   2. Get user info for userId 1 from the database
   3. Multiply 47 by 93
   4. hey buddy how are u?`,
);

console.log("\nFinal Result:\n", result);












// // ✅ Right place for Promise.all — dynamic tool calls from LLM
// const toolMessages = await Promise.all(
//   response.tool_calls.map(async (call) => {
//     const result = await toolMap[call.name].invoke(call.args);
//     return new ToolMessage({ content: result, tool_call_id: call.id });
//   })
// );
// ```
// > You can't use `RunnableParallel` here because you don't know which tools the LLM will call until runtime.

// ---

// ## The decision tree
// ```
// Is the flow fixed at write-time?
// ├── YES → RunnableSequence
// │         ├── Need original input later?        → add RunnablePassthrough
// │         ├── Multiple independent branches?    → add RunnableParallel
// │         ├── Conditional routing?              → add RunnableBranch
// │         └── Custom transform step?            → wrap in RunnableLambda
// │
// └── NO  → LLM decides steps at runtime
//           ├── Simple tool use (1-2 rounds)      → while loop is fine
//           └── Complex multi-step agent          → use LangGraph


// One golden rule
// Runnables are for structure you define. Loops and LangGraph are for structure the LLM defines.


// The moment you find yourself writing while (response.tool_calls.length > 0) inside a RunnableLambda, that's the signal you've outgrown RunnableSequence and need LangGraph.