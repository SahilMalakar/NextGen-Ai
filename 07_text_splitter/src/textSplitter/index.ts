import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import path from "node:path";

// const text =
//   "Space exploration has led to incredible scientific discoveries. From landing on the Moon to exploring Mars, humanity continues to push the boundaries of what’s possible beyond our planet. These missions have not only expanded our knowledge of the universe but have also contributed to advancements in technology here on Earth. Satellite communications, GPS, and even certain medical imaging techniques trace their roots back to innovations driven by space programs.";

// const filePath = path.join(process.cwd(), "docs", "dl-curriculum.pdf");

// const loader = new PDFLoader(filePath);

// const docs = await loader.load();

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 100,
//   chunkOverlap: 20,
//   separators: ["\n\n", "\n", " ", ""],
// });

// async function run() {
//   const chunks = await splitter.splitDocuments(docs);

//   console.log("no of Chunks:", chunks.length);  console.log(chunks);
// }

// run();






const code = `
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

const numbers = [2, 5, 8, 12, 16, 23, 38, 56];
const target = 23;

const result = binarySearch(numbers, target);

console.log("Index:", result);
`;


async function run() {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
    chunkSize: 370,
    chunkOverlap: 30,
  });

  const chunks = await splitter.splitText(code);

  console.log("Total Chunks:", chunks.length);

  chunks.forEach((chunk, i) => {
    console.log(`\nChunk ${i + 1}`);
    console.log(chunk);
  });
}

run();