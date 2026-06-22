# Agentic harnesses for knowledge work — point a capable agent at your files instead of building one

> Snapshot dated **June 2026**. This space moves fast (model names, pricing, MCP server counts, CLI feature sets all churn monthly); treat specifics as time-stamped, the framing as durable. This is one rung on the retrieval ladder — neutral with respect to [RAG](rag-fundamentals.md) / [GraphRAG](microsoft-graphrag.md); the value here is the conceptual move and its honest costs.

- **The core idea — adopt a harness, don't build an agent.** The classic move for "AI over my notes" was to *build* something: chunk → embed → vector DB → top-k retrieve → stuff context → ReAct loop. The 2026 move is to **point a heavily-invested agent harness at a folder** and say "go find/synthesize X." The harness already ships the agentic loop (reason → act → observe → repeat) plus the tools that loop needs out of the box: **file navigation (grep/glob/read), editing, shell, web fetch, and frontier reasoning**. The "build" effort largely evaporates — you write no retrieval code — and the remaining skill shifts to **organizing files well + configuring the harness** (which extensions, what permissions, what schema file). This is the practical, *interactive* sibling of the [Karpathy LLM-wiki](karpathy-gist.md) idea: the wiki is the curated note graph; the harness is the agent that ingests, queries, and lints it.
- **Why it works now:** frontier models inside these tools have largely converged, so **the harness around the model now does most of the work** ([Firecrawl, 2026](https://www.firecrawl.dev/blog/best-ai-coding-agents); [Coding Agent Index, 2026](https://medium.com/@wasowski.jarek/coding-agent-index-2026-benchmarking-full-agent-stacks-model-harness-4183305e4b90)). A long-context model that can read whole files and a tool loop that can `grep` a vault makes naive "navigate the filesystem" competitive with a tuned index at personal scale — see the tradeoffs section.

## The harnesses (coding tools, repurposed for files)

These are mostly **agentic *coding* harnesses** — built for codebases, but a vault of markdown is just a folder, so they work directly on notes. One line each (what / interface / open-vs-closed); pricing and models as of mid-2026, expect drift.

- **[Claude Code](https://www.firecrawl.dev/blog/best-ai-coding-agents)** — Anthropic's agentic harness; CLI plus VS Code / JetBrains / web / mobile; **closed**. Strong multi-file reasoning, MCP support, subagents, skills, permission modes, long-session compaction. The de-facto reference harness for the second-brain pattern.
- **OpenAI Codex** — cross-platform coding agent; CLI binary + cloud + IDE extension + ChatGPT app + mobile; **closed**. Leads several agent benchmarks paired with GPT-5.5-class models.
- **Cursor** — VS Code fork with an in-house Composer model; **IDE**; **closed**. Cited around **~$0.07/task** on standard pricing — the cheap end of the spectrum.
- **GitHub Copilot** — multi-model agent inside VS Code and github.com; **IDE/web**; **closed**.
- **Gemini CLI** — Google's terminal agent, **Apache-2.0 open**; CLI; broad free tier (tier terms changing mid-2026).
- **Google Antigravity** — agent-first IDE (desktop app + standalone CLI as of the 2.0 split, May 2026); **closed**; adds parallel subagents and terminal sandboxing.
- **OpenCode** — MIT-licensed terminal agent, bring-your-own-model; CLI + headless server; **open**.
- **Aider** — open-source, git-native CLI pair-programmer (commits each change); **CLI**; **open**. Model-agnostic; a long-standing minimalist option.
- **Cline / Continue** — open-source VS Code extensions that turn the editor into an agent harness (BYO key, MCP support); **IDE**; **open**.
- **Windsurf** — agentic IDE (Cascade flows); **IDE**; **closed**.
- **Pi** — minimalist open-source TUI wrapping any LLM with a tiny transparent system prompt and a few core tools; the "slim but powerful" counterpoint to Claude Code.
- **Knowledge-specific agents (not coding-first):** **[Khoj](pkm-methods-and-tools.md)** (self-hostable "AI second brain," agents + scheduled automations over your docs), **Notion AI agents** (2026 workspace agents that execute/coordinate over your workspace), and **NotebookLM** (source-grounded, RAG-only). These overlap the harness pattern but lean RAG/managed rather than file-navigation.

## The extension surface — how you enrich a harness

A bare harness reads local files, runs shell, and fetches web. You extend it along four axes; **MCP is the load-bearing one.**

- **MCP servers (the key extension).** The **Model Context Protocol** is an **open protocol (Anthropic, now broadly adopted)** for giving any agent standardized access to external **tools and data** — the agent sees many servers as one unified capability layer. The ecosystem is large (reportedly **>17,000 servers by early 2026**, "Knowledge & Memory" the biggest single category). Knowledge-relevant servers/connectors to know:
  - **Filesystem** — scoped read/write to a directory (the baseline; many harnesses have this natively).
  - **Obsidian** — e.g. [`cyanheads/obsidian-mcp-server`](https://github.com/cyanheads/obsidian-mcp-server): read/write/search/surgically-edit vault notes, tags, frontmatter; works directly on the `.md` files (Obsidian needn't be running). [~89 Obsidian servers indexed on PulseMCP](https://www.pulsemcp.com/servers?q=obsidian).
  - **Memory / knowledge-graph** — the **Knowledge Graph Memory Server** gives the agent persistent cross-session memory as an entity/relation store (overlaps [agent-memory substrates](agent-memory-substrates.md)).
  - **Connectors** — **Notion**, **Google Drive**, **Slack**, **GitHub**, and **Desktop Commander** (broad local file + shell). A common knowledge stack: Desktop Commander for local files + Notion MCP for the shared wiki + Memory MCP for persistent context, all mounted at once.
- **Plugins / skills / subagents.** Harness-native config. **Skills** = reusable instructions as plain markdown + optional scripts (no servers, no deploy) — e.g. [`coleam00/second-brain-skills`](https://github.com/coleam00/second-brain-skills) turns Claude Code into a second brain. **Subagents** = spawned workers for parallel/bounded tasks. Both are how you encode *workflows* (the wiki's ingest/query/lint ops) without code.
- **Custom tools.** When MCP doesn't cover it, expose your own shell scripts / CLIs; the harness calls them like any tool.
- **SDKs / libraries (build your own harness).** The **Claude Agent SDK** (and equivalents) let you assemble a bespoke harness — same loop, your tools, your guardrails, embeddable in your product. This is the escape hatch when "adopt a harness" stops fitting (see graduation, below).

## The files + structure pattern (this IS the Karpathy paradigm in practice)

- **Plain markdown + good information architecture makes the harness navigate *cheaply*.** A vault of atomic notes with `[[wikilinks]]`, **MOCs / index.md** as entry points, consistent frontmatter, and a **schema file (`CLAUDE.md` / `AGENTS.md`)** documenting conventions lets the agent consult the index, follow links, and `grep` to the few relevant files — instead of reading everything or relying on lossy chunk retrieval. The IA *is* the retrieval engineering ([pkm-methods-and-tools.md](pkm-methods-and-tools.md): MOCs, atomic notes, progressive summarization).
- **Mapping to the LLM-wiki ([karpathy-gist.md](karpathy-gist.md)):** *"Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."* The harness is exactly that programmer. Write-time synthesis (ingest), navigation-time answers (query), and a consistency loop (lint) all become harness invocations over the file tree. See also the Obsidian "Karpathy LLM Wiki" plugin lineage in [karpathywiki-obsidian.md](karpathywiki-obsidian.md). The teachable point: **the organization is the work that was front-loaded**, and the harness is what cashes it in interactively.

## Honest tradeoffs vs a built RAG / GraphRAG pipeline

Neutral, fairly costed. The strongest current data point is a 2026 benchmark of **filesystem/agentic tools vs vector search** ([LlamaIndex](https://www.llamaindex.ai/blog/did-filesystem-tools-kill-vector-search); corroborated by [agentic-search analyses](https://buzzgrewal.medium.com/ai-agents-dont-need-vector-search-anymore-inside-the-agentic-search-stack-replacing-rag-in-2026-58efcabe4f6f)):

- **Build cost — harness wins big.** Near-zero: install, point at a folder, maybe wire one MCP server. A RAG/GraphRAG pipeline is real engineering (chunking, embeddings, index, retrieval tuning, eval).
- **Per-query / run cost — pipeline wins.** Vector lookup is cheap and roughly fixed. An agent run is **multiple LLM calls per turn** (the loop reads files, reasons, acts), and the *same task across two harnesses can differ ~32×* (~$0.07 to ~$2.26) for near-identical output — harness choice and token discipline matter a lot. Cost can **surprise** at volume.
- **Latency — pipeline wins.** RAG answered **~3.8s faster on average (7.36s vs 11.17s)**; agentic search grows slower as the corpus grows (more files to navigate, more loop turns).
- **Accuracy at small scale — harness wins.** With full-file access (no chunk loss), the filesystem agent scored **8.4 vs 6.4 correctness** and **9.6 vs 8.0 relevance** on a small corpus — fewer chunk-boundary hallucinations.
- **Scale — pipeline wins past personal scale.** The harness edge **erodes once files exceed the context window or the collection is large** (100s–1000s+ docs, let alone millions); there, an index is necessary. Harness-over-files is a *personal/file-scale* technique.
- **Determinism / reproducibility — pipeline wins.** Agent runs are **non-deterministic** (path through files varies); a fixed retrieval + prompt is far more repeatable and auditable.
- **Privacy / data residency — roughly even, harness can win.** A local harness + local model (e.g. Ollama) keeps everything on-host with **no embeddings leaving the machine** — structurally simple for compliance. A pipeline can also be self-hosted but has more moving parts.
- **Embeddability — pipeline wins.** You can't easily **drop an interactive harness inside a shipped product**; a retrieval pipeline (or a custom SDK-built harness) is what you embed.
- **Observability — pipeline wins.** Pipelines expose retrieval scores, traces, evals; harness runs are looser to instrument and harder to regression-test.

## When each wins (the decision)

A fair fork, not a verdict:

- **Harness-over-files wins for** interactive, personal/dev knowledge work over a **manageable corpus** (a vault, a repo, a research folder) where build cost should be ~zero, full-context accuracy matters, and per-query cost/latency are acceptable. Background/async synthesis ("ingest these 5 papers and update the wiki") is an especially good fit.
- **A built pipeline (RAG/GraphRAG) wins for** production apps, **very large corpora**, **low-latency / high-volume** serving, and **deterministic / embeddable / auditable** requirements — anything you ship to others or run at scale.
- **Graduation signal:** start with a harness; **move to an indexed pipeline when** the corpus outgrows context windows, you need sub-second answers at volume, costs become unpredictable per query, or you must embed retrieval in a product. (Most real systems end up **hybrid**: navigate an index → drill into full files — which is exactly the harness-over-a-good-IA pattern with an index bolted on.)

## Concepts a learner must master

- **Harness selection** — CLI vs IDE vs desktop; open vs closed; cost-per-task profile; which ships the tools (file/shell/web/MCP) you need.
- **MCP / connector configuration** — what MCP is, mounting servers (Obsidian, filesystem, memory, Notion/Drive/Slack/GitHub), and composing several into one capability layer.
- **Information architecture for agent navigation** — atomic notes, MOCs/index, frontmatter, a schema/`CLAUDE.md` contract; *organizing so the agent reads few files, not all*.
- **Prompt / skill setup** — encoding ingest/query/lint workflows as skills/subagents; progressive disclosure (lean root context, drill in on demand).
- **Cost & permission controls** — token discipline, run budgets, and **scoping shell/file write permissions** (the agent can edit and execute).
- **When to graduate** — recognizing the scale/latency/determinism/embeddability thresholds that call for an indexed pipeline.

## Caveats

- **Fast-moving:** harness names, models, pricing, MCP server counts, and free-tier terms change monthly — everything above is **dated June 2026**.
- **Cost can surprise:** multi-call agent runs at volume cost far more than vector lookups; the ~32× cross-harness spread means tool/config choice dominates the bill.
- **Non-determinism:** runs aren't reproducible by default — bad for anything needing audit/regression guarantees.
- **Security / permissions:** an agent with **shell + file read/write** is powerful and dangerous — scope directories, gate writes/exec, and treat any web/file content as untrusted (prompt-injection surface). Sandboxing and credential masking are now standard harness features for a reason.
- **Not a benchmark verdict:** the accuracy/latency figures come from a small set of 2026 comparisons (notably LlamaIndex's), not a settled literature. Treat them as directional.

## Sources

- [Andrej Karpathy — LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (cross-ref [karpathy-gist.md](karpathy-gist.md))
- [Firecrawl — Best AI Coding Agents 2026 (harness/cost/accuracy)](https://www.firecrawl.dev/blog/best-ai-coding-agents)
- [Coding Agent Index 2026 — benchmarking model + harness stacks](https://medium.com/@wasowski.jarek/coding-agent-index-2026-benchmarking-full-agent-stacks-model-harness-4183305e4b90)
- [LlamaIndex — Did filesystem tools kill vector search? (2026 benchmark)](https://www.llamaindex.ai/blog/did-filesystem-tools-kill-vector-search)
- [Abdullah Grewal — Agentic search stack replacing RAG in 2026](https://buzzgrewal.medium.com/ai-agents-dont-need-vector-search-anymore-inside-the-agentic-search-stack-replacing-rag-in-2026-58efcabe4f6f)
- [cyanheads/obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server) · [PulseMCP — Obsidian servers](https://www.pulsemcp.com/servers?q=obsidian) · [TensorBlock — awesome MCP knowledge/memory servers](https://github.com/TensorBlock/awesome-mcp-servers/blob/main/docs/knowledge-management--memory.md)
- [Desktop Commander — Best MCP servers for knowledge bases 2026](https://desktopcommander.app/blog/best-mcp-servers-for-knowledge-bases-in-2026/)
- [coleam00/second-brain-skills](https://github.com/coleam00/second-brain-skills) · [coleam00/second-brain-starter](https://github.com/coleam00/second-brain-starter) · [huytieu/COG-second-brain](https://github.com/huytieu/COG-second-brain)
- [MindStudio — Build an AI second brain with Claude Code + Obsidian](https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian)
