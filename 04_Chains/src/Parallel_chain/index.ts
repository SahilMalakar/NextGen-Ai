import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { config } from "../index.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

if (!config.apiKeyGroq || !config.apiKeyGemini) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

const model1 = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: config.apiKeyGroq,
  temperature: 0,
});

const model2 = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.apiKeyGemini,
  temperature: 0,
});

const prompt1 = new PromptTemplate({
  template: "Generate short and simple notes from the following text \n {text}",
  inputVariables: ["text"],
});

const prompt2 = new PromptTemplate({
  template:
    "Generate 5 short question answers from the following text \n {text}",
  inputVariables: ["text"],
});

const prompt3 = new PromptTemplate({
  template:
    "Merge the provided notes and quiz into a single document \n notes -> {notes} \n quiz -> {quiz}",
  inputVariables: ["notes", "quiz"],
});

const parser = new StringOutputParser();

/* Individual chains */
const chain1 = prompt1.pipe(model1).pipe(parser);
const chain2 = prompt2.pipe(model2).pipe(parser);

/* Run both chains in parallel */
const parallelChain = new RunnableParallel({
  steps: {
    notes: chain1,
    quiz: chain2,
  },
});

/* Final chain */
const finalChain = parallelChain.pipe(prompt3).pipe(model1).pipe(parser);

const text = `Black holes are one of the most mysterious objects in the universe. They are regions in space where gravity is extremely strong, so strong that nothing—not even light—can escape from them. Black holes form when very massive stars collapse under their own gravity at the end of their life cycle.

At the center of a black hole lies a point called a singularity, where matter is compressed into an extremely small space and the known laws of physics break down. Surrounding the singularity is a boundary called the event horizon. Once anything crosses the event horizon, it cannot escape the gravitational pull of the black hole.

Black holes can vary greatly in size. Stellar black holes are formed from collapsing stars and are typically a few times more massive than the Sun. Supermassive black holes, which exist at the centers of most galaxies, can contain millions or even billions of times the mass of the Sun. Scientists believe that our galaxy, the Milky Way, contains a supermassive black hole at its center called Sagittarius A*.

Although black holes cannot be seen directly, scientists detect them by observing their effects on nearby stars and gas. When matter falls into a black hole, it heats up and emits powerful X-rays that can be detected by space telescopes.

Black holes play an important role in understanding gravity, space, and time. Studying them helps scientists learn more about the structure of the universe and the laws that govern it.`;

/* Run */
const result = await finalChain.invoke({
  text: text,
});

console.log(result);

import fs from "fs";

const graph = finalChain.getGraph();

const imageBlob = await graph.drawMermaidPng({
  backgroundColor: "white",
  curveStyle: "linear",
  withStyles: true,
  wrapLabelNWords: 3,
});

const arrayBuffer = await imageBlob.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

fs.writeFileSync("chain.png", buffer);


// drawMermaidPng()
//       ↓
//      Blob
//       ↓
// arrayBuffer()
//       ↓
//     Buffer
//       ↓
// fs.writeFileSync()