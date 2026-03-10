import { config } from "../index.js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

if (!config.apiKeyHuggingFace) {
  console.log("API key is missing");
  throw new Error("API key not configured");
}

const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  apiKey: config.apiKeyHuggingFace,
});

const document = [
  "Virat Kohli is an Indian cricketer known for his aggressive batting and leadership.",
  "MS Dhoni is a former Indian captain famous for his calm demeanor and finishing skills.",
  "Sachin Tendulkar, also known as the 'God of Cricket', holds many batting records.",
  "Rohit Sharma is known for his elegant batting and record-breaking double centuries.",
  "Jasprit Bumrah is an Indian fast bowler known for his unorthodox action and yorkers.",
];

const docEmbeddings = await embeddings.embedDocuments(document);

const query = "tell me about Dhoni";

const queryEmbedding = await embeddings.embedQuery(query);

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i]!, 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// Compare query with documents
// Loop through each document embedding and calculate similarity with the query
const scores = docEmbeddings.map((embedding, i) => ({
  // embedding 1 contains [vectors of single sentence]

  // Get the original document text using the same index
  text: document[i],

  // Compute semantic similarity between query vector and document vector
  // Higher score = more relevant document
  score: cosineSimilarity(queryEmbedding, embedding),
}));

scores.sort((a, b) => b.score - a.score);

console.log("Most relevant document:", scores[0]);
console.log(scores);
