/**
 * Building the graph — the extraction pipeline that turns notes into a knowledge
 * graph. Concept panels carry the definitions; this is the narrative.
 */
import type { Lesson } from "../../types";

export const sbConstruction: Lesson = {
  id: "sb-construction",
  stage: 12,
  title: "Building the Graph",
  summary:
    "A second brain has to be *populated* — and the gap between raw notes and clean triples is a pipeline, not a single step: find the mentions, link them to canonical entities, pull the relations, resolve who-is-who across a document, then fuse and reconcile facts from many sources.",
  prerequisites: ["sb-neural", "sb-neurosymbolic"],
  objectives: [
    "Decompose extraction into NER → linking → relation extraction → coreference.",
    "Say why entity linking and coreference matter for a clean graph.",
    "Explain knowledge fusion and conflict resolution across sources.",
  ],
  definitions: [],
  sections: [
    {
      heading: "From text to triples is a pipeline",
      body: `\`@c{llm-extraction}\` is a black box until you open it. Inside is a pipeline:

- **@c{ner}** — find entity *mentions* in the text ("Ada", "Babbage").
- **@c{entity-linking}** — map each mention to the *right* canonical @c{entity} (\`:Ada_Lovelace\`, not some other Ada).
- **@c{relation-extraction}** — pull the typed @c{relation}s between them.
- **@c{coreference}** — realize "she", "Lovelace", "the author" are one @c{entity}.

Each stage has its own failure mode, so each can be checked and improved separately (progressive disclosure).`,
    },
    {
      heading: "Many sources, one truth",
      body: `Your brain ingests many documents, so two more steps matter:

- **@c{knowledge-fusion}** — merge facts about the same @c{entity} from different sources into one view, keeping @c{provenance}.
- **@c{conflict-resolution}** — when sources disagree (born 1815 vs 1816), decide which @c{triple} to trust by recency, source reliability, or provenance.

This is where a second brain becomes *trustworthy* rather than a pile of contradictory scraps.`,
    },
  ],
  visualizations: [
    {
      id: "pipeline",
      kind: "typed-graph",
      title: "The extraction pipeline",
      textualSummary:
        "Raw text flows through NER (find mentions) → entity linking (to canonical entities) → relation extraction (typed edges) → fusion (merge across sources) → the knowledge graph. Each stage is separately checkable.",
      layers: ["neural", "system"],
      nodes: [
        { id: "text", type: "System", layer: "system", label: "notes / papers", position: { x: 40, y: 90 } },
        { id: "extract", type: "Embedding", layer: "neural", label: "NER → link → relations", position: { x: 340, y: 90 } },
        { id: "kg", type: "System", layer: "system", label: "fused knowledge graph", position: { x: 700, y: 90 } },
      ],
      edges: [
        { id: "e1", source: "text", target: "extract", type: "extracts", label: "extract", layer: "neural" },
        { id: "e2", source: "extract", target: "kg", type: "relates", label: "fuse + resolve", layer: "system" },
      ],
    },
  ],
  confusions: [
    { misconception: "Extraction is one step.", correction: "It's a pipeline — NER, linking, relation extraction, coreference — each with its own failure mode. 'The extraction was wrong' should localize to a stage." },
    { misconception: "Finding the name is enough.", correction: "Entity *linking* is the hard part: the mention 'Ada' must resolve to the *right* canonical entity, and coreference must tie all the ways one entity is referred to within a text." },
  ],
  quiz: [
    { id: "c-q1", type: "multiple-choice", prompt: "@c{entity-linking} differs from @c{ner} because it…", options: ["finds mentions", "maps a mention to the right canonical entity", "extracts relations", "trains an embedding"], correct: 1, explanation: "NER finds mentions; linking disambiguates them to canonical entities." },
    { id: "c-q2", type: "true-false", prompt: "True or false: @c{knowledge-fusion} merges facts about one @c{entity} from many sources while keeping provenance.", correct: true, explanation: "Fusion + provenance is how multi-source brains stay trustworthy." },
    { id: "c-q3", type: "true-false", prompt: "True or false: when two sources give different birth years, @c{conflict-resolution} picks which to trust.", correct: true, explanation: "By recency, source reliability, or provenance." },
  ],
  masteryCheckpoint:
    "You can decompose extraction into NER/linking/relation-extraction/coreference, and explain fusion + conflict resolution across sources.",
};
