# Karpathy gist — "LLM Wiki": an LLM-maintained, compounding markdown knowledge base that replaces query-time RAG

- **URL / date / context:** <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f> (file: `llm-wiki.md`), published **April 4, 2026** by @karpathy. It is an informal "idea file" meant to be copy-pasted into an agent (Claude Code, Codex, OpenCode, Pi, etc.) so the agent builds the specifics with you. It went viral fast (reportedly 5,000+ stars/forks on a single one-screen markdown file) and is widely treated as the seed of the "wiki for agents" / "Karpathy-style second brain" pattern.

- **What it actually says:** The gist contrasts the dominant pattern — RAG, where you upload files and the LLM retrieves relevant chunks at query time — against an alternative. The problem with RAG, per Karpathy, is that nothing accumulates: *"the LLM has to find and piece together the relevant fragments every time. Nothing is built up."* Instead, *"the LLM incrementally builds and maintains a persistent wiki"* that sits between you and the raw sources. When a new source arrives, the LLM doesn't just index it — it reads it, extracts takeaways, and integrates the knowledge across existing pages (updating entity/topic pages, revising summaries, adding cross-references, flagging contradictions). The payoff: *"The wiki is a persistent, compounding artifact."* The motivation is bookkeeping, not thinking: *"The tedious part of maintaining a knowledge base is not the reading or the thinking — it's the bookkeeping,"* and *"LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass."*

- **The core idea:** An **agent-maintained, interlinked markdown wiki** as a layer between the human and raw sources. Three layers:
  1. **Raw sources** — immutable documents the LLM reads but never edits.
  2. **The wiki** — LLM-generated/maintained markdown: summary pages, entity pages, concept pages, synthesis/comparison pages, all cross-linked, plus an `index.md` (content catalog by category) and an append-only `log.md`.
  3. **The schema** — a config file (e.g. `CLAUDE.md`) documenting the structure, conventions, and workflows the agent must follow.

  Three workflow **operations**:
  - **Ingest** — read new sources, extract key takeaways, write summary pages, and update relevant pages across the whole collection.
  - **Query** — search the wiki pages and synthesize an answer with citations (markdown, tables, slides, charts).
  - **Lint** — periodic health-check for contradictions, stale claims, orphan pages, and missing cross-references.

  At query time the agent **navigates** the wiki — consult `index.md`, then drill into the relevant already-synthesized, already-cross-referenced pages — rather than chunk-retrieving raw fragments. Framing: *"Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase,"* and the human's job is to *"curate sources, direct the analysis, ask good questions, and think about what it all means."*

- **Why it matters for a "second brain" curriculum:** This is the cleanest statement of **agentic note-search over query-based RAG**. The key teachable distinction: RAG re-derives understanding per query from raw chunks; the LLM-wiki **moves the synthesis work to write/ingest time** and amortizes it, so retrieval becomes navigation of pre-synthesized, pre-linked notes. *"The cross-references are already there. The contradictions have already been flagged."* For a builder, the concepts to internalize: (1) write-time vs. query-time synthesis and why compounding artifacts beat stateless retrieval; (2) an agent autonomously *reading and writing* a well-organized note graph (entity/concept/synthesis pages + index + log) rather than embedding-and-top-k; (3) the schema file as the contract that makes agent behavior disciplined and repeatable; (4) lint as an explicit consistency/maintenance loop. It directly supports the thesis that **an agent searching well-organized notes can beat query-based retrieval** — because the organization itself is the work that was front-loaded.

- **What it became (downstream):**
  - **Obsidian "Karpathy LLM Wiki" plugin** (`karpathywiki`, community plugins) — feeds the LLM full wiki context rather than chunked RAG; supports Anthropic, Gemini, OpenAI, DeepSeek; recommends long-context models as the wiki grows. Produces concept/entity/synthesis/comparison pages via ingest/query/lint/rebuild.
  - Other implementations: `green-dalii/obsidian-llm-wiki` (entity/concept pages + conversational query), `ar9av/obsidian-wiki` ("digital brain" framework), and an extended `LLM Wiki v2` gist (rohitg00) folding in lessons from building agent memory.
  - **Google's Open Knowledge Format (OKF)** is reported as a vendor-neutral formalization that appeared days after the gist went viral.
  - Karpathy's own vault reportedly grew to ~100 articles / ~400,000 words (textbook-sized), all agent-written/maintained as a byproduct of daily use.
  - Heavy commentary ecosystem ("Karpathy killed RAG. Or did he?"), numerous step-by-step "build your AI second brain in Obsidian" guides.

- **Caveats:** It is an **informal gist / opinion piece**, not a spec or benchmark — explicitly an "idea file" to be adapted, not a fixed protocol. No empirical evaluation accompanies it; claims that the wiki "beats" RAG are intuition/argument, not measured. The pattern assumes capable long-context agents and well-curated sources, and it adds real maintenance and consistency-drift risk (hence the `lint` step) that RAG avoids. In practice most implementations are hybrid (navigate index → drill into pages), and the boundary between this and "RAG over good notes" is blurrier than the framing suggests. Treat it as a strong design north-star, not a validated retrieval architecture.

## Sources
- [Original gist — `llm-wiki.md`](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [explainx.ai — Karpathy LLM Wiki Pattern: Agent Memory Guide](https://www.explainx.ai/blog/karpathy-llm-wiki-pattern-agent-memory-guide-2026)
- [Towards AI — "Karpathy Killed RAG. Or Did He? The LLM Wiki Pattern"](https://pub.towardsai.net/andrej-karpathy-killed-rag-or-did-he-the-llm-wiki-pattern-7824d876e790)
- [Obsidian community plugin — Karpathy LLM Wiki (`karpathywiki`)](https://community.obsidian.md/plugins/karpathywiki)
- [green-dalii/obsidian-llm-wiki](https://github.com/green-dalii/obsidian-llm-wiki)
- [ar9av/obsidian-wiki](https://github.com/ar9av/obsidian-wiki)
- [LLM Wiki v2 (rohitg00)](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2)
- [MindStudio — What Is Andrej Karpathy's LLM Wiki?](https://www.mindstudio.ai/blog/andrej-karpathy-llm-wiki-knowledge-base-claude-code)
