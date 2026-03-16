import { fetchTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { CloudClient } from "chromadb";
import { config } from "../index.js";

import {
  RunnableSequence,
  RunnableParallel,
  RunnableLambda,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import { StringOutputParser } from "@langchain/core/output_parsers";

// ---------------- ENV CHECK ----------------

if (
  !config.apiKeyHuggingFace ||
  !config.apikeyChroma ||
  !config.ChromaTenent ||
  !config.chromaDb ||
  !config.apiKeyGroq
) {
  throw new Error("API key missing");
}

// =======================================================
// 1. LOAD TRANSCRIPT
// =======================================================

const transcript = await fetchTranscript("3Fl3SZrQgAk");

const text = transcript.map((t: any) => t.text).join(" ");

const docs = [
  new Document({
    pageContent: text,
    metadata: {
      source: "youtube",
      videoId: "3Fl3SZrQgAk",
    },
  }),
];

console.log("Transcript loaded");

// =======================================================
// 2. CHUNK DOCUMENT
// =======================================================

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 100,
});

const chunks = await splitter.splitDocuments(docs);

console.log("Total chunks:", chunks.length);

// =======================================================
// 3. EMBEDDINGS
// =======================================================

const embeddingModel = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: config.apiKeyHuggingFace,
});

// =======================================================
// 4. CHROMA CLOUD
// =======================================================

const chromaClient = new CloudClient({
  apiKey: config.apikeyChroma,
  tenant: config.ChromaTenent,
  database: config.chromaDb,
});

// =======================================================
// 5. VECTOR STORE
// =======================================================

const vectorStore = await Chroma.fromDocuments(chunks, embeddingModel, {
  collectionName: "practice",
  index: chromaClient,
});

console.log("Embeddings stored");

// =======================================================
// 6. RETRIEVER
// =======================================================

const retriever = vectorStore.asRetriever({
  k: 5,
});

// =======================================================
// 7. LLM
// =======================================================

const model = new ChatGroq({
  apiKey: config.apiKeyGroq,
  model: "openai/gpt-oss-120b",
  temperature: 0.3,
});

// =======================================================
// 8. PROMPT
// =======================================================

const prompt = new PromptTemplate({
  template: `
You are a helpful assistant answering questions based only on a YouTube transcript.

Instructions:
- Use ONLY the provided transcript context.
- Provide a clear and detailed explanation.
- If the topic is discussed, explain what was said about it.
- Include key points mentioned in the transcript.
- Do NOT answer with only "Yes" or "No".
- If the transcript does not contain the answer, say:
"I don't know based on the transcript."

Transcript Context:
{context}

Question:
{question}

Detailed Answer:
`,
  inputVariables: ["context", "question"],
});

// =======================================================
// 9. RUNNABLE LAMBDA → FORMAT DOCUMENTS
// =======================================================

const formatDocs = new RunnableLambda({
  func: async (docs: Document[]) => {
    return docs.map((doc) => doc.pageContent).join("\n\n");
  },
});

// =======================================================
// 10. PARALLEL STEP
// =======================================================

const parallelStep = RunnableParallel.from({
  context: retriever.pipe(formatDocs),
  question: new RunnablePassthrough(),
});

// =======================================================
// 11. RAG CHAIN
// =======================================================

const ragChain = RunnableSequence.from([
  parallelStep,
  prompt,
  model,
  new StringOutputParser(),
]);

// =======================================================
// 12. ASK QUESTION
// =======================================================

const question =
  "Does the video discuss the new object-capability RPC model? If yes, explain what the speaker says about it in detail.";

const result = await ragChain.invoke(question);

console.log("\n=========== ANSWER ===========\n");

console.log(result);

console.log("\n==============================\n");


// =======================================================
// 13. DELETE EMBEDDINGS FROM CHROMA
// =======================================================

await chromaClient.deleteCollection({
  name: "practice",
});

console.log("Embeddings deleted from Chroma collection.");