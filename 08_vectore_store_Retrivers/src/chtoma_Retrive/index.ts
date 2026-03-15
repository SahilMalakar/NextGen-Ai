import { Document } from "@langchain/core/documents";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { config } from "../index.js";
import { CloudClient } from "chromadb";

if (
  !config.apiKeyHuggingFace ||
  !config.apikeyChroma ||
  !config.ChromaTenent ||
  !config.chromaDb
) {
  throw new Error(" API key missing");
}

const chromaClient = new CloudClient({
  apiKey: config.apikeyChroma,
  tenant: config.ChromaTenent,
  database: config.chromaDb,
});

const embeddingModels = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: config.apiKeyHuggingFace,
});

const documents: Document[] = [
  new Document({
    pageContent: "LangChain helps developers build LLM applications easily.",
    metadata: { source: "langchain_docs" },
  }),
  new Document({
    pageContent: "Chroma is a vector database optimized for LLM-based search.",
    metadata: { source: "chroma_docs" },
  }),
  new Document({
    pageContent: "Embeddings convert text into high-dimensional vectors.",
    metadata: { source: "embedding_docs" },
  }),
  new Document({
    pageContent: "OpenAI provides powerful embedding models.",
    metadata: { source: "openai_docs" },
  }),
];

const vectorStore = await Chroma.fromDocuments(documents, embeddingModels, {
  collectionName: "practice",
  index: chromaClient,
});

const retriever = vectorStore.asRetriever({ k: 2 });

const query = "What is Chroma used for?";

const result = await retriever.invoke(query);

console.log(result);
