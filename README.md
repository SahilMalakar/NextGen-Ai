# Sahil Malakar — 90-Day AI Engineer Roadmap
### Target: Production-Grade Agentic AI Systems & AI Interview Coach Voice Agent
> Designed for a strong backend engineer transitioning to AI Engineering in 2026.

---

## Preface: Your Unfair Advantage

You are NOT starting from zero. Your existing skills map directly to AI engineering:

| Your Existing Skill | AI Engineering Equivalent |
|---|---|
| Distributed locking / Redis | Agent state management, session isolation |
| BullMQ / async pipelines | Async agent execution, tool call queues |
| Microservices architecture | Multi-agent architectures |
| RBAC / Auth systems | AI product security, multi-tenant LLM apps |
| REST API design | LLM API design, agent APIs |
| PostgreSQL / schema design | Memory stores, conversation persistence |
| Docker / GitHub Actions | AI model deployment, CI/CD for AI systems |

Lean into this. You will move faster than most.

---

## The North Star Product

**AI Interview Coach — Voice Agent**

Every project in this roadmap is a brick in this building. By Day 90, you will have a production-grade, multi-agent, voice-enabled interview coaching system. This is your portfolio centerpiece.

---

## Skill Dependency Graph

```
Python Async & FastAPI
        │
        ▼
LLM APIs + Prompt Engineering
        │
        ▼
Embeddings + Vector DBs ──────────────────────┐
        │                                      │
        ▼                                      ▼
RAG Systems                          Context Engineering
        │                                      │
        └──────────────┬───────────────────────┘
                       ▼
              LangChain (Tools, Chains)
                       │
                       ▼
              LangGraph (State Machines)
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Tool Calling       Memory Systems
              │                 │
              └────────┬────────┘
                       ▼
              Multi-Agent Systems
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Voice Agents      Agentic RAG
              │                 │
              └────────┬────────┘
                       ▼
         Evaluation + Observability
                       │
                       ▼
           Production AI Systems
                       │
                       ▼
         AI Interview Coach (Final)
```

---

## Project Dependency Graph

```
P1: Resume Parser
     └──▶ P2: RAG Knowledge Assistant
               └──▶ P3: Company Research Agent
                         └──▶ P4: Tool Calling Agent
                                   └──▶ P5: Memory System
                                             └──▶ P6: Voice Interview Agent
                                                       └──▶ P7: Multi-Agent Orchestrator
                                                                 └──▶ P8: Evaluation Layer
                                                                           └──▶ P9: AI Interview Coach (Full)
```

---

## Recommended Tech Stack

### Core AI
- **LLM Provider**: OpenAI (GPT-4o, GPT-4o-mini), Anthropic (Claude 3.5 Sonnet)
- **Orchestration**: LangGraph, LangChain
- **Embeddings**: OpenAI text-embedding-3-small / large, Cohere embed-v3
- **Reranking**: Cohere Rerank, cross-encoder models
- **Voice STT**: OpenAI Whisper, Deepgram Nova-2
- **Voice TTS**: ElevenLabs, OpenAI TTS, Cartesia
- **Realtime Voice**: OpenAI Realtime API, LiveKit, Daily.co

### Backend
- **Language**: Python 3.12+
- **Framework**: FastAPI (async)
- **Task Queue**: Celery + Redis (or AsyncIO-native)
- **Auth**: FastAPI-JWT, OAuth2

### Databases
- **Relational**: PostgreSQL (conversation history, user data, analytics)
- **Vector**: Qdrant (self-hosted) or Pinecone (managed)
- **Cache / State**: Redis
- **Search**: Qdrant hybrid search or Elasticsearch

### Infrastructure
- **Containers**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (EC2, S3, RDS) or Railway/Render for fast deploys
- **Reverse Proxy**: Nginx or Caddy

### Observability
- **Tracing**: LangSmith
- **Telemetry**: OpenTelemetry + Jaeger
- **Logging**: structlog + CloudWatch or Grafana Loki
- **Metrics**: Prometheus + Grafana

### Evaluation
- **RAG Eval**: RAGAS
- **Agent Eval**: DeepEval
- **Custom**: LangSmith Evaluations + pytest

---

# PHASE 1: FOUNDATIONS (Days 1–30)
## *"Build the Engine Room"*

---

## Week 1 (Days 1–7): Python Async, FastAPI & LLM APIs

### Learning Objectives
- Master Python async/await patterns for AI workloads
- Build production-grade FastAPI services
- Fluently call LLM APIs (OpenAI, Anthropic)
- Understand tokenization, context windows, cost structures
- Handle streaming responses and SSE

### Why This Matters
Every AI system you build will be async at its core. LLM calls are I/O-bound — blocking calls will destroy your system's concurrency. FastAPI is the industry standard for AI backends because of its async-first design and automatic OpenAPI docs. You need to be fluent here before touching any LLM framework.

### Core Concepts

**Python Async for AI:**
- `asyncio` event loop, `async def`, `await`
- `asyncio.gather()` for concurrent LLM calls (critical for multi-agent parallelism)
- `asyncio.Queue` for streaming pipelines
- Context variables (`contextvars`) for request-scoped state
- Exception handling in async contexts
- Timeouts and cancellation (`asyncio.wait_for`)

**FastAPI:**
- Dependency injection system (use for LLM client injection)
- Background tasks (`BackgroundTasks`)
- Middleware (logging, auth, request ID injection)
- SSE (Server-Sent Events) for streaming LLM responses
- WebSocket endpoints for voice/realtime
- Lifespan events for client initialization
- Pydantic v2 for request/response validation

**LLM APIs:**
- Chat completions vs legacy completions
- System/user/assistant message structure
- Temperature, top_p, max_tokens, frequency_penalty
- Streaming (`stream=True`) and delta processing
- Function/tool calling (JSON schema-based)
- Structured outputs (response_format with JSON schema)
- Seed for reproducibility in testing
- Logprobs for confidence scoring
- Token counting with `tiktoken`
- Rate limit handling, exponential backoff
- Cost calculation per model

### Industry Relevance
Every production AI system at companies like Cursor, Perplexity, and Linear uses async Python with FastAPI. The ability to build streaming endpoints, handle concurrent LLM calls, and manage request lifecycles cleanly is table stakes for AI engineering interviews.

### Common Mistakes
- Using `requests` instead of `httpx` (blocking I/O in async context)
- Not handling SSE backpressure
- Initializing LLM clients inside request handlers (should be app-level singletons)
- Ignoring rate limits — no retry logic
- Not streaming to users (waiting for full LLM response before sending)
- Forgetting to close async generators properly

### Best Practices
- Use `httpx.AsyncClient` as a singleton (lifespan event)
- Always stream to end users — latency perception is critical
- Inject `request_id` into every log line
- Use `pydantic` models for all LLM inputs and outputs
- Never hardcode model names — use config/env vars
- Implement circuit breakers for LLM provider outages

### Recommended Resources
- Official FastAPI docs: https://fastapi.tiangolo.com
- Official asyncio docs: https://docs.python.org/3/library/asyncio.html
- OpenAI Python SDK: https://github.com/openai/openai-python
- Anthropic Python SDK: https://github.com/anthropic/anthropic-sdk-python
- Book: "Python Concurrency with asyncio" — Matthew Fowler

### Open Source Repositories to Study
- `openai-python` — study retry logic, streaming implementation
- `fastapi` — study dependency injection patterns
- `instructor` — structured LLM outputs (Pydantic + OpenAI)
- `litellm` — multi-provider LLM routing

### Hands-On Exercises
1. Build a streaming chat endpoint in FastAPI — SSE endpoint that streams token by token
2. Make 10 concurrent LLM calls with `asyncio.gather()` — log timing
3. Implement exponential backoff for rate limit errors
4. Build a token counter middleware that logs cost per request
5. Implement structured outputs using `response_format` + Pydantic

### Mini Project: Streaming Chat API
Build a FastAPI service with:
- `/chat` POST endpoint (streaming SSE)
- `/chat/sync` POST endpoint (blocking, for testing)
- Request/response logging middleware
- Token usage tracking per request
- Basic auth with API key header
- Docker + docker-compose setup

### Portfolio Deliverable
GitHub repo: `streaming-llm-api` — production-ready FastAPI service with streaming, auth, logging, Docker.

### Interview Questions
1. "How do you handle concurrent LLM calls in Python without blocking?"
2. "Explain the difference between SSE and WebSockets for streaming AI responses."
3. "How would you implement rate limiting for an LLM API gateway?"
4. "What's the cost of a 1M token conversation with GPT-4o-mini?"
5. "How do you prevent prompt injection in user-facing LLM apps?"

### Production Considerations
- LLM provider redundancy: primary + fallback providers
- Response caching for identical prompts (Redis, semantic caching)
- Request queuing under load
- Graceful degradation when LLM is unavailable

---

## Week 2 (Days 8–14): Embeddings, Vector Databases & Semantic Search

### Learning Objectives
- Understand embedding models and their tradeoffs
- Build production vector search systems with Qdrant
- Implement hybrid search (dense + sparse/BM25)
- Master chunking strategies for different document types
- Build a document ingestion pipeline

### Core Concepts

**Embeddings:**
- What embeddings are: dense vector representations of semantic meaning
- Embedding dimensions (768, 1536, 3072) and their tradeoffs
- Cosine similarity vs dot product vs Euclidean distance
- Embedding models: `text-embedding-3-small` (cost), `text-embedding-3-large` (quality), Cohere `embed-v3` (multilingual)
- Batch embedding for cost efficiency
- Embedding caching (hash input → cache vector)
- Late chunking vs early chunking

**Chunking Strategies:**
- Fixed-size chunking (naive — understand why it fails)
- Recursive character text splitting (LangChain default)
- Semantic chunking (embed → cluster → split)
- Document-aware chunking (by section, heading, paragraph)
- Sliding window with overlap
- Chunk size selection: 256 vs 512 vs 1024 tokens (depends on retrieval task)
- Metadata injection per chunk (source, page, section, date)

**Vector Databases:**
- HNSW index (Hierarchical Navigable Small World) — how ANN search works
- IVF index — inverted file index for large-scale search
- Qdrant: collections, points, payloads, filters
- Similarity search + metadata filtering (crucial for multi-tenant systems)
- Hybrid search: dense vector + sparse BM25
- Namespace isolation for multi-tenant RAG

**Retrieval Quality:**
- Precision vs recall tradeoffs
- `top_k` selection strategies
- Score thresholding
- Re-ranking with cross-encoders (Cohere Rerank, `cross-encoder/ms-marco-MiniLM-L-6-v2`)
- Maximum Marginal Relevance (MMR) for diversity

### Common Mistakes
- Chunking without overlap (loses context at boundaries)
- Not storing metadata with chunks (can't filter later)
- Using cosine similarity threshold without calibration
- Embedding entire documents instead of chunks
- Ignoring embedding model versioning (re-embed if model changes)
- Not batching embedding calls (10x cost waste)

### Best Practices
- Always include source metadata in chunk payloads
- Use namespace/tenant isolation in vector DB from day one
- Cache embeddings for static content (documents don't change)
- Use hybrid search by default (BM25 catches keyword matches dense misses)
- Build an eval set before optimizing retrieval (measure, don't guess)

### Recommended Resources
- Qdrant docs: https://qdrant.tech/documentation/
- LangChain text splitters: https://python.langchain.com/docs/modules/data_connection/document_transformers/
- Cohere Rerank: https://cohere.com/rerank
- Paper: "Improving Text Embeddings with Large Language Models" (E5)

### Open Source Repos to Study
- `qdrant/qdrant` — understand the vector DB internals
- `run-llama/llama_index` — study their chunking and retrieval pipelines
- `cohere-ai/cohere-python` — reranking implementation

### Hands-On Exercises
1. Embed 1000 documents with three different chunking strategies, compare retrieval quality
2. Build Qdrant collection with metadata filtering (filter by date, source, type)
3. Implement hybrid search: compare dense-only vs dense+BM25
4. Add Cohere reranking — measure precision@5 improvement
5. Build an ingestion pipeline with deduplication (hash chunks before inserting)

### Mini Project: Document Q&A API
Ingest a set of PDF/text documents and build:
- Chunking pipeline with configurable strategy
- Qdrant-based retrieval with metadata filtering
- Hybrid search endpoint
- Reranking layer
- FastAPI endpoint: `POST /search?q=...&top_k=5`
- Metrics: retrieval latency, embedding cost per doc

---

## Week 3 (Days 15–21): LangChain Core & Prompt Engineering → Context Engineering

### Learning Objectives
- Master LangChain LCEL (LangChain Expression Language)
- Build chains with memory, retrieval, tools
- Graduate from prompt engineering to context engineering
- Master structured outputs, function calling, and tool definitions

### Core Concepts

**LangChain LCEL:**
- Runnable protocol: `invoke`, `stream`, `batch`, `ainvoke`, `astream`
- Chain composition with `|` operator
- `RunnablePassthrough`, `RunnableLambda`, `RunnableParallel`
- `RunnableBranch` for conditional logic
- Output parsers: `StrOutputParser`, `JsonOutputParser`, `PydanticOutputParser`
- Chat prompt templates, few-shot templates
- Fallbacks: `.with_fallbacks([backup_chain])`
- Retries: `.with_retry(stop_after_attempt=3)`
- Callbacks and tracing hooks

**Prompt Engineering (Foundation):**
- Role specification (system prompt design)
- Few-shot prompting with examples
- Chain-of-thought (CoT) prompting
- Zero-shot vs few-shot tradeoffs
- Output format specification
- Negative constraints ("do NOT...")
- Persona specification for agents
- Temperature calibration per task type

**Context Engineering (The Real Skill):**

> Prompt engineering is about what you ask. Context engineering is about everything you put in the context window to enable the model to answer correctly.

**Context Construction:**
- What goes in context: system instructions, retrieved docs, conversation history, tool results, user profile, task-specific examples
- Context layering: global instructions → task context → retrieved knowledge → conversation history → current turn
- Priority ordering matters — recency bias in transformers means later content has more influence

**Context Windows:**
- GPT-4o: 128k tokens
- Claude 3.5 Sonnet: 200k tokens
- Gemini 1.5 Pro: 1M tokens
- Context window ≠ effective context window (attention dilution after ~32k for most models)
- "Lost in the middle" problem: models recall beginning and end better than middle content

**Context Prioritization:**
- Put the most important instructions at start AND end
- Use XML/Markdown structure to help models parse context sections
- Explicit section headers: `<documents>`, `<conversation_history>`, `<user_profile>`
- Separating fact from instruction in context

**Memory Injection:**
- Short-term: full conversation history
- Summary memory: compress old turns with LLM
- Entity memory: extract and track named entities
- Long-term: retrieve relevant memories from vector store
- Episodic: structured past sessions
- Semantic: factual user knowledge

**Context Compression:**
- Selective summarization (compress old messages)
- Query-focused compression (keep only relevant passages)
- `LLMLinguaCompressor` — token-level compression
- Map-reduce compression for long docs
- Reranking before context injection (top-5 vs top-20)

**Dynamic Context Assembly:**
- Decide at runtime what goes in context based on query type
- Router: "Is this a factual question? → Inject docs. Is this conversational? → Inject history."
- Context budgeting: allocate token budget per section
- Overflow handling: trim oldest history first, then compress

**Context Debugging:**
- LangSmith trace inspection
- Context diff: what changed between a good and bad response?
- Prompt token counting before inference
- A/B testing context configurations

### Real-World Examples

**Perplexity Context Pattern:**
```
System: You are a helpful search assistant. Today is {date}.
<search_results>
[top 5 web results with source, title, snippet]
</search_results>
<user_history>
[last 3 turns, summarized]
</user_history>

User: {query}
```

**Cursor Context Pattern:**
```
System: You are an expert programmer.
<codebase_context>
[relevant files, functions, and imports determined by AST analysis]
</codebase_context>
<active_file>
[current file being edited, cursor position]
</active_file>
<recent_edits>
[last 5 edits in current session]
</recent_edits>

User: {instruction}
```

### Mini Project: Context Engineering Lab
Build a system that:
- Tests 5 different context configurations for the same Q&A task
- Measures answer quality (use LLM-as-judge)
- Visualizes context token breakdown per request
- Implements query-aware context assembly

---

## Week 4 (Days 22–28): RAG Systems — Production Architecture

### Learning Objectives
- Build production-grade RAG from scratch (not just LangChain wrappers)
- Implement advanced retrieval techniques
- Build RAG evaluation with RAGAS
- Handle RAG failure modes in production

### Core Concepts

**RAG Architecture:**
```
Query → Query Transformation → Retrieval → Reranking → Context Assembly → Generation → Output
```

**Query Transformation (often skipped, always important):**
- HyDE (Hypothetical Document Embeddings): generate a fake answer, embed it, use it for retrieval
- Multi-query: generate 3 variations of the query, retrieve for all, union results
- Step-back prompting: generalize the query before retrieval
- Query decomposition: break complex queries into sub-queries

**Advanced Retrieval:**
- Parent-child chunking: retrieve small chunks, return parent context
- RAPTOR: hierarchical document trees with cluster summarization
- Sentence window retrieval: retrieve sentence, return surrounding sentences
- Multi-vector retrieval: store multiple embeddings per document (summary, keywords, full text)
- Contextual retrieval (Anthropic): prepend chunk-specific context before embedding

**Reranking (Production Critical):**
- First-stage retrieval: high recall, lower precision (top 20-50)
- Second-stage rerank: high precision (top 3-5)
- Cohere Rerank API
- `cross-encoder/ms-marco-MiniLM-L-6-v2` (local, fast)
- LLM-based reranking (expensive but highest quality)

**RAG Failure Modes:**
- Retrieval failure: correct answer not in top-k
- Context failure: retrieved but not used by LLM
- Hallucination: LLM generates beyond retrieved context
- Outdated information: stale documents in index
- Chunking artifacts: broken sentences, missing context

**RAG Evaluation with RAGAS:**
- Faithfulness: is the answer grounded in context?
- Answer Relevancy: is the answer relevant to the question?
- Context Precision: are retrieved chunks relevant?
- Context Recall: was all relevant info retrieved?
- Building a golden eval set (question, context, ground truth answer)

### Hands-On Exercises
1. Implement HyDE retrieval — compare with vanilla retrieval on 50 questions
2. Build parent-child chunking for a resume database
3. Add Cohere reranking — measure precision@5 improvement
4. Run RAGAS evaluation on your retrieval pipeline
5. Build a retrieval debugger: given query, show why each chunk was retrieved

### Mini Project: Advanced RAG API
Build a RAG system for interview knowledge:
- Ingest: company engineering blogs, system design docs, interview prep resources
- Pipeline: multi-query → hybrid retrieval → reranking → context assembly
- Evaluation: RAGAS scores on 100-question test set
- API endpoint: `POST /ask` with source citations in response

---

## Week 4 Day 28 (Days 29–30): Phase 1 Integration & Review

### Phase 1 Portfolio Deliverables
1. `streaming-llm-api` — FastAPI + streaming + auth + Docker
2. `vector-search-engine` — Qdrant + hybrid search + reranking
3. `advanced-rag-api` — Full RAG pipeline with RAGAS evaluation
4. Context Engineering writeup: blog post or README documenting your findings

---

# PHASE 2: AGENT SYSTEMS (Days 31–60)
## *"Build the Brain"*

---

## Week 5 (Days 31–35): LangGraph Deep Dive — State Machines for Agents

### Learning Objectives
- Understand why graph-based agent orchestration beats sequential chains
- Master LangGraph's state management, nodes, edges, and routing
- Build reliable agent loops with proper error handling
- Implement persistence and checkpointing

### Why LangGraph (Not Just LangChain Chains)
Sequential chains fail for agents because:
1. Agents need to loop (retry on failure, gather more info)
2. Agents need conditional routing (different tools for different situations)
3. Agents need shared state that evolves across steps
4. Agents need checkpointing (resume from failure, human-in-the-loop)
5. Multi-agent systems need message passing between subgraphs

LangGraph models agent execution as a directed graph where nodes are computation units and edges are routing logic. This maps directly to distributed systems concepts you already know.

### Core Concepts: LangGraph

**State:**
```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # append-only
    user_id: str
    session_id: str
    retrieved_docs: list[dict]
    tool_calls_made: int
    current_task: str
    error: str | None
```

State design principles:
- State is the single source of truth for the graph execution
- Use `Annotated` reducers for fields that accumulate (messages, docs)
- Keep state serializable (JSON-compatible types) for checkpointing
- Don't put functions or non-serializable objects in state
- Separate ephemeral state (per-node) from persistent state (per-session)

**Nodes:**
```python
# Each node is an async function: state_in → state_update
async def retrieval_node(state: AgentState) -> dict:
    query = state["messages"][-1].content
    docs = await retriever.ainvoke(query)
    return {"retrieved_docs": docs}

async def llm_node(state: AgentState) -> dict:
    response = await llm.ainvoke(state["messages"])
    return {"messages": [response]}
```

Node types:
- LLM nodes (call model, return AI message)
- Tool nodes (execute tool calls)
- Retrieval nodes (fetch documents)
- Router nodes (pure logic, no I/O)
- Aggregator nodes (combine results from parallel branches)
- Human nodes (pause for human input)

**Edges:**
```python
# Normal edges (always traverse)
graph.add_edge("retrieval", "llm")

# Conditional edges (routing logic)
def route_after_llm(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

graph.add_conditional_edges("llm", route_after_llm)
```

**The ReAct Loop Pattern:**
```
START → LLM → [has tool calls?] → YES → Tool Execution → LLM → ...
                                → NO  → END
```

**Conditional Routing — Production Patterns:**
```python
def route_agent(state: AgentState) -> str:
    last_msg = state["messages"][-1]
    
    # Max iterations guard
    if state.get("tool_calls_made", 0) > 10:
        return "error_handler"
    
    # Tool call routing
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        tool_name = last_msg.tool_calls[0]["name"]
        # Route to specialized subgraph based on tool
        if tool_name in RESEARCH_TOOLS:
            return "research_subgraph"
        return "general_tools"
    
    # Reflection needed
    if state.get("requires_reflection"):
        return "reflection_node"
    
    return END
```

**Tool Nodes:**
```python
from langgraph.prebuilt import ToolNode

# LangGraph's built-in tool executor
tools = [search_tool, calculator_tool, code_runner_tool]
tool_node = ToolNode(tools)

# Custom tool node for error handling
async def safe_tool_node(state: AgentState) -> dict:
    try:
        result = await tool_node.ainvoke(state)
        return {**result, "tool_calls_made": state.get("tool_calls_made", 0) + 1}
    except Exception as e:
        return {"messages": [ToolMessage(content=f"Error: {str(e)}", ...)], "error": str(e)}
```

**Persistence & Checkpointing:**
```python
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

# Production: PostgreSQL checkpointer
checkpointer = AsyncPostgresSaver.from_conn_string(DATABASE_URL)
await checkpointer.setup()

graph = graph_builder.compile(checkpointer=checkpointer)

# Run with thread_id for session isolation
config = {"configurable": {"thread_id": session_id}}
result = await graph.ainvoke(input_state, config=config)

# Resume from any checkpoint
history = graph.get_state_history(config)
```

Checkpointing enables:
- Session resumption after crash
- Human-in-the-loop (pause, wait for approval, resume)
- Time-travel debugging (replay from any state)
- A/B testing agent behaviors on recorded sessions

**Interrupts (Human-in-the-Loop):**
```python
# Compile with interrupt before tool execution
graph = builder.compile(
    checkpointer=checkpointer,
    interrupt_before=["tools"]  # Pause before tool node
)

# Resume after human approval
await graph.ainvoke(None, config=config)  # None continues from checkpoint
```

**Multi-Agent Graphs:**
```python
# Subgraph pattern
research_graph = build_research_subgraph()
analysis_graph = build_analysis_subgraph()

# Parent graph calls subgraphs as nodes
parent_builder.add_node("researcher", research_graph)
parent_builder.add_node("analyst", analysis_graph)
```

**Supervisor Architecture:**
```
Supervisor LLM
├── decides which agent to call
├── routes: researcher | writer | critic | END
└── aggregates results

Agents:
├── Researcher (web search, RAG)
├── Writer (content generation)
└── Critic (quality check)
```

**Planner Architecture:**
```
Planner → creates plan (list of steps)
        ↓
Executor → executes each step
        ↓
Verifier → checks if goal achieved
        ↓ (if not)
Replanner → updates plan based on results
```

**Reflection Architecture:**
```
Generator → produces draft output
          ↓
Reflector → critiques: "What's wrong? What's missing?"
          ↓
Reviser   → improves based on critique
          ↓ (N iterations or until quality threshold)
Final Output
```

**Production Patterns:**
- Map-Reduce: fan out to N parallel nodes, aggregate results
- Branching and joining: parallel research, then synthesis
- Subgraph isolation: each agent in its own graph with its own state schema
- Error recovery: dedicated error handling nodes with retry logic
- Streaming: `graph.astream_events()` for real-time UI updates

### Hands-On Exercises
1. Build a ReAct agent from scratch using LangGraph (no `create_react_agent`)
2. Add PostgreSQL checkpointing — test crash recovery
3. Implement human-in-the-loop: pause for approval before sending emails
4. Build a supervisor with 3 sub-agents using conditional routing
5. Implement a reflection loop: generate → critique → revise (3 iterations)
6. Build a map-reduce graph: parallel research across 5 sources

### Interview Questions
1. "When would you use LangGraph instead of a simple LangChain chain?"
2. "How does checkpointing enable human-in-the-loop workflows?"
3. "What's the difference between a supervisor and a planner architecture?"
4. "How do you prevent infinite loops in agent graphs?"
5. "How would you implement fan-out parallelism in LangGraph?"

---

## Week 6 (Days 36–42): Tool Calling, MCP & Agent Engineering

### Learning Objectives
- Master tool definition, registration, and execution patterns
- Implement MCP (Model Context Protocol) servers and clients
- Build reliable tool calling with error handling and retries
- Design production tool libraries for agents

### Core Concepts

**Tool Calling Architecture:**
```python
from langchain_core.tools import tool
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="The search query")
    max_results: int = Field(default=5, description="Max results to return")

@tool(args_schema=SearchInput)
async def web_search(query: str, max_results: int = 5) -> str:
    """Search the web for current information about a topic."""
    results = await searcher.search(query, max_results)
    return format_results(results)
```

Tool design principles:
- Clear, specific docstrings (the LLM reads this to decide when to use the tool)
- Strong input validation with Pydantic
- Deterministic error messages (LLM needs to understand what went wrong)
- Return structured data as formatted string or JSON
- Idempotent where possible
- Bounded execution time (timeout wrappers)

**Tool Categories for Interview Coach:**
```
Research Tools:
├── web_search(query) → search results
├── company_research(company_name) → structured company info
└── job_description_parser(jd_text) → structured JD

Resume Tools:
├── parse_resume(file_path) → structured resume
├── resume_skill_extractor(resume) → skills list
└── experience_analyzer(resume) → experience summary

Interview Tools:
├── generate_question(topic, difficulty, company_style) → question
├── evaluate_answer(question, answer, criteria) → feedback
└── detect_filler_words(transcript) → analysis

Memory Tools:
├── store_session_memory(session_id, data) → confirmation
├── retrieve_user_profile(user_id) → profile
└── update_weakness_tracker(user_id, topic, score) → confirmation
```

**Model Context Protocol (MCP):**

MCP is Anthropic's open standard for connecting LLMs to external tools and data sources. Think of it as "USB for AI" — a universal interface between models and tools.

Architecture:
```
LLM Client (Claude/GPT)
      │
      │ MCP Protocol (JSON-RPC over stdio/HTTP/SSE)
      │
MCP Server (your tool server)
      │
External Services (DB, API, File System)
```

Building an MCP server:
```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
import mcp.types as types

server = Server("interview-coach-tools")

@server.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="search_company",
            description="Research a company's interview process and culture",
            inputSchema={
                "type": "object",
                "properties": {
                    "company_name": {"type": "string"},
                    "focus": {"type": "string", "enum": ["culture", "technical", "process"]}
                },
                "required": ["company_name"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "search_company":
        result = await research_company(**arguments)
        return [types.TextContent(type="text", text=result)]
```

MCP vs Direct Tool Calling:
- MCP: standardized protocol, tool servers are independent services, language-agnostic
- Direct: tighter coupling, lower latency, simpler for single-agent systems
- Use MCP when: tools need to be shared across multiple agents/models, tools are complex microservices

**Agent Engineering Principles:**
- **Tool selection**: LLM chooses tools based on docstrings — write them like API documentation
- **Parallel tool calling**: GPT-4o and Claude can call multiple tools in one turn
- **Tool result injection**: how tool results flow back into context
- **Tool call limits**: prevent runaway agents (max 15 tool calls per session)
- **Graceful degradation**: what happens when a tool fails?
- **Tool versioning**: how to update tools without breaking running agents

### Mini Project: Tool-Calling Research Agent
Build an agent that:
- Given a company name and target role
- Uses: `web_search`, `company_research`, `jd_parser`
- Produces: structured company report (tech stack, interview style, common questions)
- Exposes tools as an MCP server
- Handles tool failures gracefully with fallback tools

---

## Week 7 (Days 43–49): Memory Systems

### Learning Objectives
- Build all four memory types: sensory, short-term, episodic, semantic
- Implement long-term memory with vector search
- Build user profile management and weakness tracking
- Design memory architectures for multi-session agents

### Core Concepts

**Memory Taxonomy for AI Agents:**

| Type | Human Analogy | AI Implementation | Use Case |
|---|---|---|---|
| In-context | Working memory | Messages in context window | Current conversation |
| Summary | Short-term recall | LLM-compressed history | Long sessions |
| Episodic | Past experiences | Structured session records | "Last time you practiced..." |
| Semantic | General knowledge | Vector DB of facts | User skills, preferences |
| Procedural | Habits | System prompt instructions | Agent behavior |

**In-Context Memory Management:**
```python
async def manage_context_window(
    messages: list,
    max_tokens: int = 100_000,
    preserve_last_n: int = 10
) -> list:
    # Always preserve system message + last N turns
    recent = messages[-preserve_last_n:]
    
    # Summarize older messages if needed
    if count_tokens(messages) > max_tokens:
        old_messages = messages[1:-preserve_last_n]  # exclude system
        summary = await summarize_messages(old_messages)
        return [messages[0], SystemMessage(f"Previous context: {summary}"), *recent]
    
    return messages
```

**Episodic Memory (Interview Sessions):**
```sql
CREATE TABLE interview_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    company VARCHAR(255),
    role VARCHAR(255),
    session_date TIMESTAMP,
    duration_minutes INT,
    overall_score FLOAT,
    questions_asked JSONB,
    answers_given JSONB,
    feedback JSONB,
    weaknesses_identified TEXT[],
    strengths_identified TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Semantic Memory with Vector DB:**
```python
async def store_user_fact(user_id: str, fact: str, category: str):
    embedding = await embed(fact)
    await qdrant.upsert(
        collection_name="user_memory",
        points=[PointStruct(
            id=str(uuid4()),
            vector=embedding,
            payload={
                "user_id": user_id,
                "fact": fact,
                "category": category,  # skill, experience, weakness, preference
                "timestamp": datetime.now().isoformat()
            }
        )]
    )

async def retrieve_relevant_memories(user_id: str, query: str, top_k: int = 5):
    embedding = await embed(query)
    results = await qdrant.search(
        collection_name="user_memory",
        query_vector=embedding,
        query_filter=Filter(must=[FieldCondition(key="user_id", match=MatchValue(value=user_id))]),
        limit=top_k
    )
    return [r.payload["fact"] for r in results]
```

**Memory Injection Pattern:**
```python
async def build_agent_context(user_id: str, current_query: str) -> str:
    # Retrieve relevant memories
    memories = await retrieve_relevant_memories(user_id, current_query)
    past_sessions = await get_recent_sessions(user_id, limit=3)
    user_profile = await get_user_profile(user_id)
    
    return f"""
<user_profile>
Name: {user_profile.name}
Target Role: {user_profile.target_role}
Experience Level: {user_profile.experience_level}
</user_profile>

<relevant_memories>
{chr(10).join(f"- {m}" for m in memories)}
</relevant_memories>

<recent_performance>
{format_sessions(past_sessions)}
</recent_performance>
"""
```

**mem0 Library (Production Memory Layer):**
mem0 is a managed memory layer for AI apps that handles all memory types automatically.
- GitHub: https://github.com/mem0ai/mem0
- Auto-extracts facts from conversations
- Cross-session retrieval
- User/session/agent namespacing

### Mini Project: Memory System for Interview Coach
Build:
- PostgreSQL schema for sessions, users, performance history
- Qdrant collection for semantic user memories
- Memory injection middleware for agent context
- Endpoints: `GET /users/{id}/memory`, `POST /users/{id}/memory`, `GET /users/{id}/sessions`
- Weakness tracker: aggregate scores across sessions, identify patterns

---

## Week 8 (Days 50–56): Voice Agents

### Learning Objectives
- Build end-to-end voice pipeline: STT → LLM → TTS
- Implement realtime streaming voice with WebSockets
- Handle interruption, turn-taking, and latency optimization
- Build production voice agent with LiveKit or OpenAI Realtime API

### Core Concepts

**Voice Pipeline Architecture:**
```
Microphone → VAD → STT → Text → LLM → Text → TTS → Audio → Speaker
                    ↑                              ↓
                    └──── Interruption Detection ──┘
```

**Components:**

**STT (Speech-to-Text):**
- OpenAI Whisper: offline/batch, highest accuracy
- Deepgram Nova-2: streaming, low latency (300ms), production choice
- AssemblyAI: good for diarization (multi-speaker)
- AWS Transcribe: managed, good integration if on AWS

**TTS (Text-to-Speech):**
- ElevenLabs: highest quality, multiple voices, emotional range
- OpenAI TTS: fast, consistent, 6 voices
- Cartesia Sonic: ultra-low latency, good for realtime
- LMNT: low latency, good voices

**VAD (Voice Activity Detection):**
- Silero VAD: lightweight, accurate, runs locally
- WebRTC VAD: basic but fast
- Deepgram's built-in VAD (if using Deepgram)

**Realtime Architecture with WebSockets:**
```python
@app.websocket("/voice/session")
async def voice_session(websocket: WebSocket):
    await websocket.accept()
    session = VoiceSession(websocket)
    
    try:
        async for audio_chunk in websocket.iter_bytes():
            # 1. Accumulate audio until VAD detects speech end
            session.audio_buffer.append(audio_chunk)
            
            if await session.vad.is_speech_end(audio_chunk):
                # 2. Transcribe accumulated audio
                transcript = await stt.transcribe(session.audio_buffer)
                session.audio_buffer = []
                
                # 3. Run LLM (streaming)
                async for token in llm.astream(transcript, session.context):
                    session.tts_buffer.append(token)
                    
                    # 4. Stream TTS back as audio
                    if len(session.tts_buffer) >= TTS_CHUNK_SIZE:
                        audio = await tts.synthesize("".join(session.tts_buffer))
                        await websocket.send_bytes(audio)
                        session.tts_buffer = []
                
    except WebSocketDisconnect:
        session.cleanup()
```

**OpenAI Realtime API (Preferred for Production):**
The OpenAI Realtime API handles the entire voice pipeline server-side:
- WebRTC and WebSocket support
- Native interruption handling
- Built-in VAD
- Direct audio-to-audio (no text intermediate)
- Function calling support

```python
import openai

# Connect to Realtime API
async with openai.AsyncRealtimeConnection() as conn:
    await conn.session.update(session={
        "modalities": ["text", "audio"],
        "voice": "alloy",
        "instructions": INTERVIEWER_SYSTEM_PROMPT,
        "tools": interview_tools,
        "turn_detection": {
            "type": "server_vad",
            "threshold": 0.5,
            "silence_duration_ms": 800
        }
    })
    
    # Stream audio in, receive audio + text out
    async for event in conn:
        if event.type == "response.audio.delta":
            await send_audio_to_client(event.delta)
        elif event.type == "response.text.delta":
            transcript += event.delta
        elif event.type == "input_audio_buffer.speech_started":
            await handle_interruption()
```

**Interrupt Handling:**
Critical for natural conversation. When user starts speaking mid-response:
1. Detect VAD start → user is speaking
2. Cancel current TTS playback immediately
3. Cancel current LLM generation if possible
4. Transcribe user's interruption
5. Process and respond to interruption

**Turn-Taking:**
- Server-side VAD: server detects when user stops speaking
- Client-side VAD: client sends speech_start/speech_end events
- Push-to-talk: simpler, no VAD needed (good for interviews with clear turns)

**Latency Optimization:**
- Target: < 800ms from user speech end to first audio byte
- STT: use streaming transcription (Deepgram streams partial results)
- LLM: start TTS as soon as first sentence is complete, don't wait for full response
- TTS: stream audio chunks as they're generated
- Infrastructure: run voice services in same region as users
- Model selection: use faster models for voice (GPT-4o-mini, Haiku) vs accuracy models

**LiveKit for Production:**
LiveKit is the industry standard for WebRTC-based voice AI:
- Manages audio/video infrastructure
- Built-in noise cancellation
- `livekit-agents` Python SDK for AI pipelines
- Scales to thousands of concurrent voice sessions

### Mini Project: Voice Interviewer Prototype
Build a WebSocket voice agent that:
- Connects via WebSocket audio stream
- Transcribes with Deepgram streaming
- Maintains interview context across turns
- Responds with ElevenLabs TTS
- Handles interruptions
- Logs full transcript with timestamps
- Detects filler words in real-time

---

## Week 8 Days 57–60: Agentic RAG

### Core Concepts

**Agentic RAG vs Standard RAG:**
- Standard RAG: query → retrieve → generate (one-shot)
- Agentic RAG: query → plan → multi-step retrieval → reason → verify → generate

**Patterns:**

**Adaptive Retrieval:**
- Agent decides whether retrieval is needed (sometimes the answer is in context)
- Route to web search vs vector DB vs direct answer

**Iterative Retrieval:**
- Retrieve → read → identify gaps → retrieve more → generate
- Loop until answer is satisfactory

**CRAG (Corrective RAG):**
- Retrieve → evaluate relevance → if low relevance → web search fallback → generate

**Self-RAG:**
- LLM decides when to retrieve mid-generation
- Generates retrieval tokens inline

**For Interview Coach:**
```
User asks: "How does Google interview for SWE roles?"

Agentic RAG:
1. Route: company-specific question → trigger company research agent
2. Retrieve from vector DB: Google interview docs
3. Evaluate: is this current? → check date metadata
4. Web search: "Google SWE interview process 2025"
5. Synthesize: combine retrieved + web results
6. Generate: structured answer with source citations
```

---

# PHASE 3: PRODUCTION SYSTEMS (Days 61–90)
## *"Ship It"*

---

## Week 9 (Days 61–67): AI Evaluation

### Learning Objectives
- Build systematic evaluation for RAG and agents
- Implement LLM-as-judge patterns
- Set up RAGAS, DeepEval, LangSmith evals
- Build custom evaluation metrics for interview quality

### Core Concepts

**The Evaluation Stack:**
```
Unit Tests (deterministic behavior)
    │
Integration Tests (component interaction)
    │
Eval Suites (LLM output quality)
    │
Online Monitoring (production quality drift)
```

**LLM-as-Judge:**
```python
JUDGE_PROMPT = """
You are evaluating an AI interviewer's question quality.

Question: {question}
Context: {context}  # candidate's resume, target role

Evaluate on:
1. Relevance (1-5): Is this relevant to the candidate's background?
2. Difficulty Calibration (1-5): Is difficulty appropriate for level?
3. Specificity (1-5): Is it specific enough to assess real knowledge?
4. Naturalness (1-5): Does it sound like a real interviewer?

Respond in JSON: {{"relevance": N, "difficulty": N, "specificity": N, "naturalness": N, "reasoning": "..."}}
"""

async def evaluate_question(question: str, context: str) -> EvalResult:
    response = await llm.ainvoke(
        JUDGE_PROMPT.format(question=question, context=context),
        response_format={"type": "json_object"}
    )
    return EvalResult(**json.loads(response.content))
```

**DeepEval for Agent Evaluation:**
```python
from deepeval import evaluate
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    ContextualPrecisionMetric,
    HallucinationMetric
)
from deepeval.test_case import LLMTestCase

test_case = LLMTestCase(
    input="What are common Google system design questions?",
    actual_output=agent_response,
    expected_output=golden_answer,
    retrieval_context=retrieved_docs
)

metrics = [
    AnswerRelevancyMetric(threshold=0.7),
    FaithfulnessMetric(threshold=0.8),
    HallucinationMetric(threshold=0.1)
]

evaluate([test_case], metrics)
```

**Custom Metrics for Interview Coach:**
- Interview question relevance to candidate profile
- Answer evaluation accuracy (does the AI correctly assess the human's answer?)
- Feedback quality (actionable, specific, constructive)
- Follow-up question appropriateness
- Difficulty progression (is the agent adapting?)
- Filler word detection accuracy

**LangSmith Evaluations:**
```python
from langsmith import evaluate as ls_evaluate

def correctness_evaluator(run, example):
    # Compare agent output to golden answer
    score = compare_answers(run.outputs["answer"], example.outputs["expected"])
    return {"score": score, "reasoning": "..."}

ls_evaluate(
    lambda inputs: interview_agent.invoke(inputs),
    data="interview-coach-eval-dataset",
    evaluators=[correctness_evaluator],
    experiment_prefix="interview-coach-v2"
)
```

**Building Eval Datasets:**
- Golden dataset: 200 question-answer pairs per domain (backend, frontend, ML, etc.)
- Regression dataset: bugs you've fixed — prevent them from returning
- Adversarial dataset: edge cases, trick questions, ambiguous queries
- Continuous eval: log production interactions → human review → add to eval dataset

---

## Week 10 (Days 68–74): Observability & Production Monitoring

### Learning Objectives
- Implement LangSmith tracing for all LLM calls
- Build OpenTelemetry instrumentation
- Set up production dashboards for AI-specific metrics
- Implement alerting for AI quality degradation

### Core Concepts

**What to Observe in AI Systems:**
```
Infrastructure Metrics:
├── LLM API latency (p50, p95, p99)
├── Token usage per request
├── Cost per user per day
├── Error rate by provider
└── Queue depth for async jobs

AI Quality Metrics:
├── Retrieval precision@5 (sampled)
├── LLM-as-judge scores (sampled)
├── User satisfaction signals (implicit: session length, retry rate)
├── Hallucination rate (spot-checked)
└── Tool call success rate

Business Metrics:
├── Sessions per user per week
├── Interview completion rate
├── User performance improvement (week-over-week)
└── Feature usage (voice vs text)
```

**LangSmith Setup:**
```python
import langsmith
from langsmith.wrappers import wrap_openai
from openai import AsyncOpenAI

# Wrap OpenAI client — all calls automatically traced
client = wrap_openai(AsyncOpenAI())

# Add custom metadata to traces
with langsmith.trace("interview-session", metadata={"user_id": user_id, "company": company}):
    response = await interview_agent.ainvoke(input_state)
```

**OpenTelemetry for AI:**
```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

tracer = trace.get_tracer("interview-coach")

async def generate_interview_question(context: dict) -> str:
    with tracer.start_as_current_span("generate_question") as span:
        span.set_attribute("user.id", context["user_id"])
        span.set_attribute("target.company", context["company"])
        span.set_attribute("llm.model", MODEL_NAME)
        
        start = time.time()
        response = await llm.ainvoke(...)
        
        span.set_attribute("llm.latency_ms", (time.time() - start) * 1000)
        span.set_attribute("llm.tokens_used", response.usage.total_tokens)
        
        return response.content
```

**Production Debugging Patterns:**
- Trace ID injection: every request has a trace ID in logs, LangSmith trace, and user-facing response
- Reproduction: given a session ID, replay the exact agent execution
- Shadow mode: run new agent version alongside old, compare outputs
- Canary deployment: 5% traffic to new version, monitor quality metrics

---

## Week 11 (Days 75–82): Production Architecture & Deployment

### Learning Objectives
- Design production-grade AI system architecture
- Implement multi-tenancy, rate limiting, cost controls
- Deploy on cloud with proper scaling
- Build CI/CD pipeline for AI systems

### Production Architecture: AI Interview Coach

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  Web App (Next.js)  │  Mobile  │  API Clients                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS / WebSocket
┌─────────────────────▼───────────────────────────────────────────┐
│                      API Gateway (Nginx)                        │
│           Rate Limiting │ Auth │ Request ID Injection           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│ Interview │  │   Voice   │  │ Analytics │
│  Service  │  │  Service  │  │  Service  │
│ (FastAPI) │  │ (FastAPI  │  │ (FastAPI) │
│           │  │ +WS)      │  │           │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │               │               │
      └───────────────┼───────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    Agent Orchestration Layer                     │
│              LangGraph Multi-Agent System                       │
│  Supervisor │ Research Agent │ Question Agent │ Eval Agent      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
     ┌────────────────┼─────────────────┐
     ▼                ▼                 ▼
┌─────────┐    ┌─────────────┐   ┌──────────┐
│Postgres │    │   Qdrant    │   │  Redis   │
│(sessions│    │(knowledge,  │   │(sessions,│
│ users,  │    │  memory)    │   │ cache,   │
│ reports)│    │             │   │ queues)  │
└─────────┘    └─────────────┘   └──────────┘
                      │
     ┌────────────────┼─────────────────┐
     ▼                ▼                 ▼
┌─────────┐    ┌─────────────┐   ┌──────────┐
│ OpenAI  │    │  Deepgram   │   │ElevenLabs│
│  API    │    │  STT API    │   │  TTS API │
└─────────┘    └─────────────┘   └──────────┘
```

**Multi-Tenancy Design:**
- Row-level security in PostgreSQL: every query filtered by `user_id`
- Qdrant namespace per user
- Redis key prefixing: `user:{user_id}:session:{session_id}:*`
- LangGraph thread_id: `{user_id}:{session_id}`
- Rate limiting: token budget per user per day (cost controls)

**Cost Controls (Critical for Production):**
```python
class CostController:
    async def check_budget(self, user_id: str) -> bool:
        daily_spend = await redis.get(f"cost:{user_id}:{today()}")
        return float(daily_spend or 0) < USER_DAILY_BUDGET_USD
    
    async def record_cost(self, user_id: str, tokens: int, model: str):
        cost = calculate_cost(tokens, model)
        await redis.incrbyfloat(f"cost:{user_id}:{today()}", cost)
        await redis.expire(f"cost:{user_id}:{today()}", 86400)
```

**Model Routing (Cost vs Quality):**
```python
def select_model(task_type: str, user_tier: str) -> str:
    routing_table = {
        ("question_generation", "free"): "gpt-4o-mini",
        ("question_generation", "pro"): "gpt-4o",
        ("answer_evaluation", "free"): "gpt-4o-mini",
        ("answer_evaluation", "pro"): "claude-3-5-sonnet",
        ("company_research", "any"): "gpt-4o-mini",  # fast, good enough
        ("voice_response", "any"): "gpt-4o-mini",    # latency critical
    }
    return routing_table.get((task_type, user_tier)) or routing_table.get((task_type, "any"))
```

**CI/CD for AI Systems:**
```yaml
# .github/workflows/ai-tests.yml
name: AI System Tests

on: [push, pull_request]

jobs:
  eval:
    steps:
      - name: Run unit tests
        run: pytest tests/unit/

      - name: Run integration tests
        run: pytest tests/integration/

      - name: Run eval suite (sampled)
        run: python evals/run_eval.py --sample-size 50

      - name: Check eval regression
        run: python evals/check_regression.py --threshold 0.05
        # Fail CI if eval scores drop by > 5%

      - name: Deploy if all pass
        run: ./scripts/deploy.sh
```

---

## Weeks 12–13 (Days 83–90): Final Integration — AI Interview Coach

### Building the Final Product

This is where all 9 projects converge. You are not building from scratch — you are integrating the components you've already built.

**Day 83–84: Multi-Agent Architecture**
```python
# Supervisor routes to specialized agents
class InterviewCoachSupervisor:
    agents = {
        "researcher": CompanyResearchAgent,    # Project 3 component
        "resume_analyzer": ResumeAnalyzerAgent, # Project 1 component
        "questioner": QuestionGeneratorAgent,   # New
        "evaluator": AnswerEvaluatorAgent,      # Project 8 component
        "reporter": ReportGeneratorAgent,       # New
    }
```

**Day 85–86: Voice Integration**
- Wire OpenAI Realtime API to LangGraph state
- Implement interviewer personalities (technical, behavioral, challenging)
- Add filler word detection, pace analysis

**Day 87–88: Analytics Dashboard**
- Session history API
- Performance trends (PostgreSQL queries + charts)
- Weakness heatmap (topic × performance)
- Progress tracking (scores over time)

**Day 89: Evaluation & Monitoring**
- LangSmith project setup
- DeepEval test suite: 200 test cases
- Production alerts: quality degradation, high error rate, cost overrun

**Day 90: Production Deployment**
- Docker Compose (local)
- Deploy to Railway or AWS EC2
- Domain + SSL (Caddy)
- GitHub Actions CI/CD
- README with architecture diagram

---

## AI Engineer Hiring in 2026

### What Startups Actually Expect

**Tier 1 Startups (Cursor, Perplexity, Linear AI features):**
- You can architect and ship production AI features end-to-end
- Deep LangGraph or equivalent framework knowledge
- Obsession with latency, cost, and reliability
- Experience with evals and systematic quality improvement
- Can reason about context windows and retrieval quality

**Series A–B AI Startups:**
- LangChain/LangGraph or comparable framework
- RAG systems in production
- Voice AI experience is a massive differentiator
- Multi-agent systems
- Ability to write evals

**Big Tech AI teams:**
- System design at scale (millions of users)
- ML Ops / model deployment familiarity
- Cost optimization at scale
- Safety and evaluation expertise

### What AI Engineer Interviews Test
1. **LLM fundamentals**: "How does in-context learning work?", "Explain attention"
2. **System design**: "Design a RAG system for a legal firm"
3. **Agent debugging**: given a broken agent trace, find the issue
4. **Eval design**: "How would you measure the quality of this agent?"
5. **Context engineering**: "How would you handle a 200K token document?"
6. **Live coding**: build a simple agent in 45 minutes

### Most Overrated Skills
- Fine-tuning (most startups never fine-tune)
- Knowing PyTorch internals
- MLflow / experiment tracking (important for ML engineers, not AI engineers)
- Knowing specific model architectures in depth

### Most Underrated Skills
- **Eval design**: the #1 differentiator between junior and senior AI engineers
- **Context engineering**: most people just do basic prompt engineering
- **Async Python**: most AI engineers don't understand it deeply
- **Observability**: being able to debug production AI systems
- **Cost optimization**: startups care deeply about LLM costs

### Junior vs Mid vs Senior AI Engineer

| | Junior | Mid | Senior |
|---|---|---|---|
| **Agents** | Can use LangChain prebuilts | Builds custom LangGraph agents | Architects multi-agent systems |
| **RAG** | Basic retrieval pipeline | Advanced retrieval, reranking | Designs RAG for domain-specific use cases |
| **Evals** | Knows what evals are | Builds eval suites | Designs eval strategy, builds culture |
| **Production** | Local Docker | Deployed on cloud | Multi-tenant, observable, cost-optimized |
| **Context** | Prompt engineering | Context windowing | Full context engineering |
| **Voice** | Never touched it | Can build basic pipeline | Production voice agent |

---

## 90-Day Weekly Breakdown

| Week | Theme | Key Output |
|---|---|---|
| 1 | FastAPI + Async + LLM APIs | Streaming Chat API |
| 2 | Embeddings + Vector DBs | Vector Search Engine |
| 3 | LangChain + Context Engineering | Context Eng Lab |
| 4 | RAG Systems + RAGAS | Advanced RAG API |
| 5 | LangGraph Deep Dive | Multi-Agent Graph |
| 6 | Tool Calling + MCP | Tool-Calling Research Agent |
| 7 | Memory Systems | Memory API |
| 8 | Voice Agents + Agentic RAG | Voice Interviewer |
| 9 | AI Evaluation | Eval Suite (200 cases) |
| 10 | Observability + Monitoring | LangSmith + OTel Setup |
| 11 | Production Architecture | Deployed MVP |
| 12 | Multi-Agent Integration | Full Coach Agent |
| 13 | Polish, Evals, Deploy | Production AI Interview Coach |

---

## Daily Breakdown (Sample — Week 5, LangGraph)

| Day | Morning (3h) | Afternoon (3h) | Evening (2h) |
|---|---|---|---|
| Mon | Read LangGraph docs: State, Nodes | Build ReAct agent from scratch | Debug, write tests |
| Tue | Study: Conditional edges, routing | Add tool node with error handling | Write README |
| Wed | Study: Checkpointing, persistence | Add PostgreSQL checkpointer | Test crash recovery |
| Thu | Study: Human-in-the-loop, interrupts | Implement approval workflow | Integration testing |
| Fri | Study: Multi-agent, subgraphs | Build supervisor with 2 agents | Document learnings |
| Sat | Build mini-project: Reflection loop | Polish, add monitoring | Share on LinkedIn |
| Sun | Review week, fill gaps | Prep for Week 6 | Rest |

---

## Hiring Readiness Checklist

### Technical
- [ ] Can build a production RAG pipeline from scratch (no tutorials)
- [ ] Can build a LangGraph multi-agent system with checkpointing
- [ ] Can design and run an eval suite for a RAG or agent system
- [ ] Can build a streaming FastAPI service with proper error handling
- [ ] Can implement all 4 memory types for an AI system
- [ ] Can build a voice pipeline (STT → LLM → TTS) end-to-end
- [ ] Can explain context engineering to a non-technical founder
- [ ] Can debug a broken agent from a LangSmith trace
- [ ] Can estimate LLM cost for a production feature
- [ ] Can implement MCP server for a tool library

### Portfolio
- [ ] GitHub profile: 5+ AI engineering repos with READMEs and architecture diagrams
- [ ] Deployed project accessible at a URL (not just localhost)
- [ ] Blog post or LinkedIn article: "What I learned building X"
- [ ] LangSmith project with production traces
- [ ] Eval results documented (RAGAS scores, DeepEval results)
- [ ] Video demo of AI Interview Coach voice agent

### Soft Skills
- [ ] Can articulate tradeoffs: "We chose X over Y because..."
- [ ] Can discuss eval strategy for a new AI feature
- [ ] Can explain RAG failure modes and how to fix them
- [ ] Can reason about context window budgeting

---

## Portfolio Readiness Checklist

### Repository Quality
- [ ] Each repo has: Problem statement, Architecture diagram, Setup instructions, Deployment guide
- [ ] Repos show progression: simple → complex → production
- [ ] Evals and test suites present
- [ ] Docker + CI/CD present

### The AI Interview Coach (Star Project)
- [ ] Live demo URL
- [ ] Full architecture documented
- [ ] Voice demo video (2–3 min)
- [ ] Eval results documented (precision, faithfulness, quality scores)
- [ ] LangSmith public project with traces
- [ ] Blog post explaining key technical decisions

---

## Recommended Learning Resources

### Documentation
- LangGraph: https://langchain-ai.github.io/langgraph/
- LangChain: https://python.langchain.com/docs/introduction/
- OpenAI API: https://platform.openai.com/docs/
- Anthropic API: https://docs.anthropic.com/
- Qdrant: https://qdrant.tech/documentation/
- FastAPI: https://fastapi.tiangolo.com/
- RAGAS: https://docs.ragas.io/
- DeepEval: https://docs.confident-ai.com/
- LangSmith: https://docs.smith.langchain.com/
- MCP: https://modelcontextprotocol.io/

### Courses
- LangChain Academy (free): LangGraph mastery
- DeepLearning.AI: "Building Agentic RAG with LlamaIndex", "AI Agents in LangGraph"
- Qdrant's vector search course (free)

### Open Source Projects to Study
- `langchain-ai/langgraph` — study all examples in /examples
- `run-llama/llama_index` — retrieval patterns
- `livekit/agents` — production voice agent patterns
- `mem0ai/mem0` — memory architecture
- `confident-ai/deepeval` — eval patterns
- `openai/openai-python` — streaming, tool calling
- `anthropics/anthropic-sdk-python` — structured outputs
- `BerriAI/litellm` — model routing, cost tracking

### Must-Read Articles
- Anthropic: "Building Effective Agents" (blog.anthropic.com)
- LangChain: "LangGraph: Multi-Agent Workflows"
- "Contextual Retrieval" — Anthropic blog
- "Lost in the Middle" paper (arXiv 2023)
- "Self-RAG" paper (arXiv 2023)

---

*Built for Sahil Malakar | June 2026 | AI Engineer Roadmap*
*Your backend foundation is your superpower. Build on it.*
