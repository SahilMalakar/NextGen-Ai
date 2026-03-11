import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

/*
ChatPromptTemplate builds a structured prompt
specifically for chat models.

Each message has:
role + template string
*/

const chatTemplate = ChatPromptTemplate.fromMessages([
  // System message → controls model behaviour
  ["system", "You are a helpful {domain} assistant."],

  // Optional placeholder for chat history
  new MessagesPlaceholder("history"),

  // User message template
  ["human", "Explain in simple terms, what is {topic}?"],
]);

/*
formatMessages() replaces template variables
with actual values and returns an array of messages
*/

const formatted = await chatTemplate.formatMessages({
  domain: "AI",
  topic: "machine learning",
  history: [], // conversation history if needed
});

console.log(formatted);
