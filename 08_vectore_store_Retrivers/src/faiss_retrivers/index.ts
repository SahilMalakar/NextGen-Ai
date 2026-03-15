import { Document } from "@langchain/core/documents";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { config } from "../index.js";

if (!config.apiKeyHuggingFace) {
  throw new Error("HuggingFace API key missing");
}

const embeddingModels = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: config.apiKeyHuggingFace,
});

const documents: Document[] = [
  new Document({
    pageContent: "LangChain makes it easy to work with LLMs.",
    metadata: { source: "langchain_intro" },
  }),
  new Document({
    pageContent: "LangChain is used to build LLM based applications.",
    metadata: { source: "langchain_apps" },
  }),
  new Document({
    pageContent: "Chroma is used to store and search document embeddings.",
    metadata: { source: "chroma_db" },
  }),
  new Document({
    pageContent: "Embeddings are vector representations of text.",
    metadata: { source: "embeddings_intro" },
  }),
  new Document({
    pageContent:
      "MMR helps you get diverse results when doing similarity search.",
    metadata: { source: "mmr_search" },
  }),
  new Document({
    pageContent: "LangChain supports Chroma, FAISS, Pinecone, and more.",
    metadata: { source: "vector_databases" },
  }),
];

const vectorStore = await FaissStore.fromDocuments(documents, embeddingModels);

const retriever = vectorStore.asRetriever({
  searchType: "mmr",
  k: 3,
  searchKwargs: {
    fetchK: 6,
    lambda: 0.5,
  },
});

const query = "What does LangChain support?";

const result = await retriever.invoke(query);

console.log(result);
