/**
 * Using your brain with an LLM — RAG over the graph, text-to-SPARQL, schema
 * induction, agent memory. Concept panels carry the definitions.
 */
import type { Lesson } from "../../types";

export const sbLlmKg: Lesson = {
  id: "sb-llm-kg",
  stage: 13,
  title: "Using Your Brain with an LLM",
  summary:
    "Once you have a graph, an LLM becomes a far better partner: it answers grounded in your facts instead of hallucinating, turns your questions into runnable queries, helps bootstrap the schema, and uses the graph as durable memory.",
  prerequisites: ["sb-query", "sb-neural"],
  objectives: [
    "Use KG-grounded RAG to cut hallucination by answering from retrieved triples.",
    "Translate a question to SPARQL (text-to-SPARQL) instead of guessing.",
    "Use the graph as an agent's long-term memory.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Ground the LLM in your facts",
      body: `- **@c{kg-rag}** — retrieval-augmented generation over your graph: @c{query} the relevant @c{triple}s first, then let the LLM answer *grounded* in them. Far fewer @c{hallucination}s than asking the LLM cold.
- **@c{text-to-sparql}** — translate a natural-language question into @c{sparql} you can actually *run*:

\`\`\`text
"What did Ada write?"  →  SELECT ?n WHERE { :Ada :wrote ?n }
\`\`\`

A runnable query beats a guessed answer — it's checkable.`,
    },
    {
      heading: "Bootstrap and remember",
      body: `- **@c{schema-induction}** — propose @c{class}es and @c{property-schema}s from a corpus, bootstrapping an @c{ontology} from your data (then a human curates — the LLM proposes, you verify).
- **@c{agent-memory-graph}** — use a @c{knowledge-graph} as an agent's structured long-term memory: it writes what it learns as triples and recalls them later, instead of forgetting between sessions.

In every case the pattern is the same one from the neurosymbolic stage: the LLM *proposes*, the graph and you *verify*.`,
    },
  ],
  visualizations: [
    {
      id: "rag",
      kind: "typed-graph",
      title: "KG-grounded RAG",
      textualSummary:
        "A question is turned into a query over the knowledge graph; the retrieved triples are handed to the LLM, which answers grounded in them — reducing hallucination because the answer is tied to stored facts.",
      layers: ["system", "neural"],
      nodes: [
        { id: "q", type: "System", layer: "system", label: "question", position: { x: 40, y: 90 } },
        { id: "kg", type: "System", layer: "system", label: "graph (retrieved triples)", position: { x: 340, y: 90 } },
        { id: "llm", type: "Embedding", layer: "neural", label: "LLM answers, grounded", position: { x: 700, y: 90 } },
      ],
      edges: [
        { id: "r1", source: "q", target: "kg", type: "relates", label: "query", layer: "system" },
        { id: "r2", source: "kg", target: "llm", type: "extracts", label: "ground", layer: "neural" },
      ],
    },
  ],
  confusions: [
    { misconception: "An LLM over your notes is just a chatbot.", correction: "Grounding changes everything: KG-RAG retrieves real triples first, so answers are tied to stored facts (and citable); text-to-SPARQL produces a runnable, checkable query instead of a guess." },
    { misconception: "Schema induction replaces the ontologist.", correction: "The LLM *proposes* classes/properties; a human curates. Same propose→verify discipline — induction is a draft, not a commitment." },
  ],
  quiz: [
    { id: "l-q1", type: "true-false", prompt: "True or false: @c{kg-rag} reduces hallucination by answering from retrieved @c{triple}s.", correct: true, explanation: "Grounding ties the answer to stored facts." },
    { id: "l-q2", type: "multiple-choice", prompt: "@c{text-to-sparql} is better than a guessed answer because the query is…", options: ["shorter", "runnable and checkable", "written by a human", "an embedding"], correct: 1, explanation: "You can run it and verify the result." },
    { id: "l-q3", type: "true-false", prompt: "True or false: an @c{agent-memory-graph} lets an agent recall what it learned across sessions.", correct: true, explanation: "The graph is durable structured memory." },
  ],
  masteryCheckpoint:
    "You can ground an LLM in your graph with RAG, translate questions to SPARQL, and use the graph as agent memory — always LLM-proposes, graph-verifies.",
};
