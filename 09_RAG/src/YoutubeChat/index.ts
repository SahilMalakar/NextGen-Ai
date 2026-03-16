import { fetchTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { CloudClient } from "chromadb";
import { config } from "../index.js";

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
//                  1. LOAD DOCUMENT
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
//                  2. CHUNK DOCUMENT
// =======================================================

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 100,
  separators: ["\n\n", "\n", " ", ""],
});

const chunks = await splitter.splitDocuments(docs);

console.log("Total chunks:", chunks.length);

// =======================================================
//                  3. CREATE EMBEDDINGS
// =======================================================

const embeddingModel = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: config.apiKeyHuggingFace,
});

// =======================================================
//                  4. CONNECT CHROMA CLOUD
// =======================================================

const chromaClient = new CloudClient({
  apiKey: config.apikeyChroma,
  tenant: config.ChromaTenent,
  database: config.chromaDb,
});

// =======================================================
//                  5. STORE IN VECTOR DB
// =======================================================

const vectorStore = await Chroma.fromDocuments(chunks, embeddingModel, {
  collectionName: "practice",
  index: chromaClient,
});

console.log("Embeddings stored in Chroma");

// =======================================================
//                  6. CREATE RETRIEVER
// =======================================================

const retriever = vectorStore.asRetriever({
  k: 5,
});

// =======================================================
//                  7. CREATE LLM
// =======================================================

const model = new ChatGroq({
  apiKey: config.apiKeyGroq,
  model: "openai/gpt-oss-120b",
  temperature: 0.3,
  maxRetries: 2,
});

// =======================================================
//                  8. PROMPT TEMPLATE
// =======================================================

const prompt = new PromptTemplate({
  template: `
            You are a helpful assistant.
            
            Answer ONLY from the provided transcript context.
            
            If the context does not contain the answer, say:
            "I don't know based on the transcript."
            
            Context:
            {context}
            
            Question:
            {question}
            `,
  inputVariables: ["context", "question"],
});

// =======================================================
//                  9. USER QUESTION
// =======================================================

const question =
  "Is the topic of the new object-capability RPC model discussed in this video? If yes what was discussed?";

// =======================================================
//                  10. RETRIEVE CONTEXT
// =======================================================

const retrievedDocs = await retriever.invoke(question);

const context = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");

// =======================================================
//                  11. FORMAT PROMPT
// =======================================================

const formattedPrompt = await prompt.format({
  context,
  question,
});

// =======================================================
//                  12. GENERATE ANSWER
// =======================================================

const response = await model.invoke(formattedPrompt);

console.log("\n================ ANSWER ================\n");

console.log(response.content);

console.log("\n=======================================\n");
