import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import {
    BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { z } from "zod";
import { config } from "../index.js";

if (!config.apikeyExchange || !config.apiKeyGroq) {
  throw new Error("API key is not present");
}

// ------------------------------------------------
// TOOL 1 — Fetch conversion rate
// ------------------------------------------------

const getCurrencyFactor = new DynamicStructuredTool({
  name: "get_currency_conversion_factor",
  description:
    "Fetches the currency conversion factor between a base currency and a target currency",
  schema: z.object({
    baseCurrency: z.string().describe("The source currency code e.g. USD"),
    targetCurrency: z.string().describe("The target currency code e.g. INR"),
  }),
  func: async ({ baseCurrency, targetCurrency }) => {
    const url = `https://v6.exchangerate-api.com/v6/${config.apikeyExchange}/pair/${baseCurrency}/${targetCurrency}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Exchange API error: ${response.status}`);
    }

    const data = await response.json();

    return JSON.stringify({
      baseCurrency: data.base_code,
      targetCurrency: data.target_code,
      conversionRate: data.conversion_rate,
    });
  },
});

// ------------------------------------------------
// TOOL 2 — Calculate converted value
// 1. name was empty string
// 2. "conversion" is not a valid field — should be "description"
// 3. z.float64() does not exist in Zod — use z.number()
// ------------------------------------------------

const convertCurrency = new DynamicStructuredTool({
  name: "convert_currency", // 1. was ""
  description:
    "Given a currency conversion rate, calculates the target currency value from a base currency value", // 2. was "conversion:"
  schema: z.object({
    baseCurrencyValue: z.number().describe("The amount in the source currency"),
    conversionRate: z
      .number()
      .describe("The conversion rate from base to target currency"), // 3. z.float64() → z.number()
  }),
  func: async ({ baseCurrencyValue, conversionRate }) => {
    return (baseCurrencyValue * conversionRate).toString();
  },
});

// ------------------------------------------------
// TOOL MAP
// ------------------------------------------------

const toolMap = {
  get_currency_conversion_factor: getCurrencyFactor,
  convert_currency: convertCurrency,
};

// ------------------------------------------------
// LLM
// ------------------------------------------------

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  apiKey: config.apiKeyGroq,
});

const llmWithTools = model.bindTools([getCurrencyFactor, convertCurrency]);

// ------------------------------------------------
// SYSTEM PROMPT
// ------------------------------------------------

const SYSTEM_PROMPT = `You are a currency conversion assistant with two tools:
1. get_currency_conversion_factor — fetches the live conversion rate between two currencies.
2. convert_currency — multiplies a base amount by a conversion rate.

Rules:
- First call get_currency_conversion_factor to get the rate.
- Then call convert_currency using the rate from the first tool.
- After both results are received, give the final answer immediately.
- Do NOT call any tool again after receiving all results.`;

// ------------------------------------------------
// AGENT LOOP
// Two sequential tool calls needed here (rate first, then convert)
// so a loop is the right approach — not a single-shot pipeline
// ------------------------------------------------

async function runAgent(query: string): Promise<string> {
  const messages: any[] = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(query),
  ];

  while (true) {
    const response = await llmWithTools.invoke(messages);

    if (!response.tool_calls || response.tool_calls.length === 0) {
      return response.content as string;
    }

    messages.push(response);

    const toolMessages: ToolMessage[] = await Promise.all(
      response.tool_calls.map(async (call: any) => {
        const tool = toolMap[call.name as keyof typeof toolMap];
        if (!tool) throw new Error(`Tool not found: ${call.name}`);

        console.log(`\nCalling tool: ${call.name} →`, call.args);
        const result = await (tool as any).invoke(call.args);
        console.log(`Result:`, result);

        return new ToolMessage({ content: result, tool_call_id: call.id });
      }),
    );

    messages.push(...toolMessages);
  }
}

// ------------------------------------------------
// RUN
// 4. "result" was used before it was defined — now properly awaited
// ------------------------------------------------

const result = await runAgent("Convert 1000 USD to INR");

console.log("\nFinal Result:\n", result);