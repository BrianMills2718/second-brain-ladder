# PKM methods & tools — the human "second brain" the academic-KG framing leaves out

- **Why this matters:** When a learner says "build my second brain," they almost never mean an RDF graph, an OWL ontology, or a GraphRAG pipeline. They mean **Personal Knowledge Management (PKM)** — taking notes that link to each other and finding them again later. PKM is a decades-old practitioner culture (Zettelkasten, "Building a Second Brain," "evergreen notes") with mass-market tools (Obsidian, Notion, Logseq) and its own vocabulary. This is the reality a Second-Brain curriculum must *serve*: the academic KG / neurosymbolic stack only earns attention if it visibly answers a need the learner already feels in PKM terms. The thesis of this whole rescope is that **PKM and KG/GraphRAG are the same machine described by two cultures** — and the mappings below make that literal.

## Methods (the human practices)

- **Zettelkasten (Niklas Luhmann).** A "slip-box" of small, numbered note-cards, each holding *one idea*, explicitly cross-linked to related cards; Luhmann ran ~90,000 cards over 40 years and credited it for 70 books. Core principles: **atomicity** (one idea per note), **own wording** (write it yourself, don't clip), and **explicit links** (every new note connects to existing ones, with a sentence saying *why*). Popularized for the digital era by Sönke Ahrens, *How to Take Smart Notes* (2017), who distilled it to those principles rather than Luhmann's physical numbering. Core principle: **structure emerges bottom-up from links, not top-down from folders.**

- **PARA + "Building a Second Brain" / CODE (Tiago Forte).** The mainstream productivity framing. **CODE** is the workflow — **C**apture (save anything that resonates), **O**rganize, **D**istill, **E**xpress (ship it into real output). **PARA** is the organizing scheme — **P**rojects (active, with a deadline), **A**reas (ongoing responsibilities), **R**esources (topics of interest), **A**rchives (inactive). Core principle: **organize by *actionability*, not by topic** — notes are fuel for projects you'll actually deliver, not a library to admire.

- **Evergreen notes / "notes as tools for thought" (Andy Matuschak).** Notes "written and organized to evolve, contribute, and accumulate over time, across projects." Concept-oriented and **densely linked** (associations over hierarchies); a fleeting-thought "writing inbox" feeds polished evergreen notes. Core principle: **"better note-taking" misses the point — the goal is better *thinking*; the note system exists to develop insight, and good notes should *surprise* you.**

- **Maps of Content (MOCs) — Nick Milo / "Linking Your Thinking" (LYT).** A MOC is a hand-curated **higher-order index note** that mostly contains links to other notes, mapping one cluster of your vault and giving an emergent web a navigable entry point. Core principle: **link first, then let lightweight indexes (MOCs) grow over the web** instead of pre-imposing a folder tree — structure is grown, not declared.

- **Atomic notes.** The shared substrate of all the above: one self-contained idea per note, so a note can be linked, reused, and recombined across many contexts. Core principle: **if you can't remove anything without breaking the idea and nothing is missing, it's atomic** — and atomic units are what make dense linking and reuse possible.

- **Progressive summarization (Tiago Forte).** A distillation technique in *layers* on the same note: L1 = captured source text; L2 = **bold** the best passages; L3 = **highlight** the best of the bold; L4 = a few words of your own executive summary on top. Core principle: **make notes *discoverable* by your future self** — compress opportunistically so the essence surfaces at a glance, without re-reading everything.

## Tools (and how they implement linking + AI)

- **Obsidian** — local plain-**Markdown** files; `[[wikilinks]]` produce **automatic backlinks** + a 2D **graph view**; AI is via community plugins (Smart Connections does **local embeddings + RAG chat**, Copilot/Text Generation use your OpenAI/Anthropic key or local Ollama). The de-facto home of Zettelkasten/LYT. *Linking: page-level bidirectional. AI: plugin-based, BYO-key or local.*
- **Logseq** — open-source, **outliner**, journals-first; **block-level** bidirectional links + block references; has a graph view; local-first Markdown/org. The closest open Roam clone. *Linking: block + page bidirectional. AI: plugins / local models.*
- **Roam Research** — the tool that mainstreamed `[[bidirectional links]]`, block references, and the daily-notes workflow; backlinks shown at the bottom of each page; graph view. *Linking: block + page bidirectional (originator of the pattern). AI: hosted features.*
- **Tana** — outliner that adds a **supertag type system** — every node can carry fields, turning the outline into a structured **database** (closest of these to an explicit schema/ontology); networked links but no true 2D graph render. Strong native AI ("AI nodes," agentic field-filling). *Linking: typed nodes + references. AI: agentic, built-in.*
- **Notion** — blocks + **databases with relations and rollups** (an explicit, typed property-graph-by-another-name); **Notion AI Q&A** does cited RAG over your workspace, and 2026 adds workspace AI **agents** that execute/coordinate work. *Linking: typed database relations + page links. AI: native Q&A/RAG + agents.*
- **Reor** — open-source, **AI-native**, fully local: every note is chunked and embedded into a vector DB (LanceDB), related notes are **auto-linked by vector similarity**, and Q&A does **RAG over your corpus** with a local LLM via Ollama. *Linking: automatic, semantic (embeddings), not authored. AI: local RAG, core feature.*
- **Khoj** — open-source, self-hostable **"AI second brain"**: semantic search + RAG over your docs (Markdown, PDF, org, Notion, Obsidian), custom **agents**, scheduled automations, deep research; any local or cloud LLM. *Linking: semantic retrieval. AI: RAG + agents, core feature.*
- **NotebookLM (Google)** — Gemini-powered, **source-grounded** research assistant: upload sources (≤50/notebook) and every answer is **RAG over only those sources with citations** (reported ~13% hallucination vs ~40% ungrounded); generates "Audio Overview" podcasts/videos. *Linking: none authored — grounding is the model. AI: RAG-only, core feature.*

## The bridge to KG / AI (make the mappings explicit)

The PKM concepts and the formal stack are **the same objects under different names.** A curriculum's job is to teach the learner to *see* this:

| PKM concept (what learners say) | Formal equivalent (what the stack calls it) |
|---|---|
| **Bidirectional / wiki-links between notes** | **Edges in a property graph** — a note is a node, a `[[link]]` is a (often untyped) directed edge; backlinks are just the inverse edges materialized. |
| **The graph view** | A **knowledge-graph visualization** — node-link layout of that property graph. |
| **Atomic note** | An **entity / node** — the addressable unit a link can point to and an edge can connect. |
| **Tana supertags / Notion database relations** | **Typed edges + a schema** — the first step from an *untyped* note-graph toward an actual ontology (predicates with domain/range). |
| **"AI search / chat over my notes"** (Smart Connections, Khoj, NotebookLM, Notion Q&A) | **RAG** — embed notes, retrieve top-k by similarity, ground the LLM's answer in them with citations. |
| **Auto-linking by similarity** (Reor's vector links) | **Embedding-based edge proposal** — the neural-KG move (link prediction over a vector space) instead of hand-authored edges. |
| **MOC / index note** (Milo) | **Karpathy's `index.md` "wiki for agents"** — a curated, higher-order navigation page over a synthesized note-graph; the MOC *is* the agent-facing index by another name (see `karpathy-gist.md`, `karpathywiki-obsidian.md`). |
| **Capture → Organize → Distill → Express (CODE)** | The **KG construction + GraphRAG pipeline** — ingest, structure/extract, summarize/compress, query/serve (see `microsoft-graphrag.md`, `graphrag-jaylzhou.md`). |
| **Evergreen "notes that compound over time"** | Karpathy's **compounding, LLM-maintained wiki** — synthesis done at *write* time so retrieval is navigation, not per-query re-derivation. |

The single most important framing: **a bidirectional link *is* a graph edge; "AI over my notes" *is* RAG over a graph.** PKM and GraphRAG are one culture's bottom-up, human-authored version and another culture's top-down, formally-typed version of the same artifact.

## Concepts a builder must learn

- **Linking discipline** — links are the value; the habit of connecting a new note to existing ones (and saying *why*) is what turns a pile of files into a graph. The empty graph view is the failure mode.
- **Note atomicity** — one idea per note, so notes are reusable, linkable, recombinable; the prerequisite for dense linking and for ever treating a note as an "entity."
- **Emergent vs. imposed structure** — folders/taxonomies are *imposed* and brittle; links + MOCs let structure *emerge* bottom-up. (The bridge to the KG side: when emergent structure is later *typed*, you've crossed from a note-graph into an ontology.)
- **The capture → organize → distill → express workflow (CODE)** — the end-to-end loop, and the spine onto which every tool feature and every formal stage maps.

## Caveats

- **Method tribalism.** Zettelkasten purists, BASB/PARA followers, and LYT/MOC advocates argue past each other; much "debate" is dogma over interchangeable principles (atomic notes, dense links, distillation, an index layer) wearing different brand names. Teach the principles, stay neutral on the franchise.
- **Tool churn.** This space moves fast and tools die, pivot, or get acquired (Roam's decline, the 2025–26 AI-native rush — Reor, Khoj, Mem, NotebookLM, Notion agents). Anchor the curriculum to **portable formats (plain Markdown + links)** and to *concepts* (graph, RAG, schema), not to any one app — exactly the reason the Karpathy-wiki pattern insists on plain Markdown.

## Sources

- Zettelkasten / atomicity — <https://zettelkasten.de/introduction/>, <https://zettelkasten.de/posts/principle-of-atomicity-difference-between-principle-and-implementation/>, <https://zettelkasten.de/atomicity/guide/>; Ahrens, *How to Take Smart Notes* (2017).
- Building a Second Brain / PARA / CODE — <https://www.buildingasecondbrain.com/>, <https://fortelabs.com/blog/basboverview/>.
- Evergreen notes (Matuschak) — <https://notes.andymatuschak.org/Evergreen_notes>.
- Maps of Content / LYT (Nick Milo) — <https://www.linkingyourthinking.com/>, <https://blog.linkingyourthinking.com/maps/>.
- Progressive summarization (Forte) — <https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/>.
- Obsidian + AI plugins / Smart Connections — <https://smartconnections.app/>, <https://aiproductivity.ai/blog/obsidian-plugins-productivity/>.
- Logseq / Roam / Tana comparison (links, blocks, graph) — <https://thesweetsetup.com/obsidian-vs-roam/>, <https://support.noduslabs.com/hc/en-us/articles/6490899641234-Obsidian-vs-Roam-Research-vs-LogSeq-vs-RemNote>.
- Reor — <https://github.com/reorproject/reor>.
- Khoj — <https://github.com/khoj-ai/khoj>, <https://khoj.dev/>.
- NotebookLM — <https://notebooklm.google/>, <https://www.kzsoftworks.com/blog/notebooklm-this-ai-is-grounded-in-your-documents-not-the-whole-internet>.
- Notion AI Q&A / agents — <https://www.notion.com/help/guides/get-answers-about-content-faster-with-q-and-a>, <https://www.notion.com/product/ai>.
- Karpathy "LLM wiki" / wiki-for-agents — <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f> (see local notes `karpathy-gist.md`, `karpathywiki-obsidian.md`).
