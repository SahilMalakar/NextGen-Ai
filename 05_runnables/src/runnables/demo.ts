// A fake LLM class that simulates an AI model
class NakliLLM {
  constructor() {
    console.log("LLM created");
  }

  // Takes a prompt and returns a random response
  predict(prompt: string): { response: string } {
    const responseList = [
      "Delhi is the capital of India",
      "IPL is a cricket league",
      "AI stands for Artificial Intelligence",
    ];

    // Generate random index
    const randomIndex = Math.floor(Math.random() * responseList.length);

    return {
      response: responseList[randomIndex]!,
    };
  }
}

/*
Prompt Template class

This simulates LangChain's PromptTemplate.

Example template:
"Write a {length} poem about {topic}"

Input variables:
["length","topic"]

The format() method replaces placeholders with real values.
*/
class NakliPromptTemplate {
  template: string;
  inputVariables: string[];

  constructor(template: string, inputVariables: string[]) {
    this.template = template;
    this.inputVariables = inputVariables;
  }

  format(inputDict: Record<string, string>): string {

  let formatted = this.template;

  for (const key of this.inputVariables) {

    const value = inputDict[key];

    // Ensure the variable exists
    if (value === undefined) {
      throw new Error(`Missing value for input variable: ${key}`);
    }

    formatted = formatted.replace(`{${key}}`, value!);
  }

  return formatted;
}
}

/*
Chain class

This simulates LangChain's LLMChain.

Pipeline:

Input variables
      ↓
PromptTemplate.format()
      ↓
LLM.predict()
      ↓
Final response
*/
class NakliLLMChain {
  llm: NakliLLM;
  prompt: NakliPromptTemplate;

  constructor(llm: NakliLLM, prompt: NakliPromptTemplate) {
    this.llm = llm;
    this.prompt = prompt;
  }

  run(inputDict: Record<string, string>): string {
    // Step 1 → format prompt using template
    const finalPrompt = this.prompt.format(inputDict);

    // Step 2 → send prompt to LLM
    const result = this.llm.predict(finalPrompt);

    // Step 3 → return LLM response
    return result.response;
  }
}

/*
Example Usage
*/

// Create prompt template
const template = new NakliPromptTemplate(
  "Write a {length} poem about {topic}",
  ["length", "topic"],
);

// Create fake LLM
const llm = new NakliLLM();

// Create chain
const chain = new NakliLLMChain(llm, template);

// Run chain with input variables
const result = chain.run({
  length: "short",
  topic: "india",
});

console.log(result);
