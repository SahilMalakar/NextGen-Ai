import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const retriver = new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 4000,
})

const query = "India Pakistan relations history";

const docs = await retriver.invoke(query);

console.log(`response : ${docs}`);
