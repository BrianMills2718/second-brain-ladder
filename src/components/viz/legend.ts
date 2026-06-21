/**
 * Single source of truth for what each layer and edge type means and how it is
 * styled, so every typed diagram can render a legend. A diagram's node `layer`
 * tags what kind of thing it is (data / schema / logic / neural / system) and the
 * edge `type` its relationship — kept visually distinct so an `entails` edge is
 * never mistaken for a plain `relation`.
 */
import type { EdgeType, Layer } from "../../types";

export const LAYER_META: Record<
  Layer,
  { label: string; color: string; blurb: string }
> = {
  data: {
    label: "Data",
    color: "#2563eb",
    blurb: "The facts: entities, relations, triples — what your brain knows.",
  },
  schema: {
    label: "Schema",
    color: "#7c3aed",
    blurb: "The meaning: classes, properties, the ontology (TBox).",
  },
  logic: {
    label: "Logic",
    color: "#059669",
    blurb: "The rules: entailment — what a reasoner can derive.",
  },
  neural: {
    label: "Neural",
    color: "#d97706",
    blurb: "Learned & fuzzy: embeddings, LLM extraction — no guarantees.",
  },
  system: {
    label: "System / tooling",
    color: "#dc2626",
    blurb: "Concrete models & tools: property graphs, RDF, SPARQL.",
  },
};

/** Edge dash patterns give a non-color cue; `verbose` is the on-hover gloss. */
export const EDGE_META: Record<EdgeType, { label: string; dash?: string; verbose: string }> = {
  relation: { label: "relation", verbose: "a named, directed link between two entities" },
  is_a: { label: "is-a", verbose: "the source is a kind/specialization of the target" },
  instance_of: { label: "instance of", dash: "6 4", verbose: "the source entity is a member of the target class" },
  subclass_of: { label: "subclass", dash: "2 3", verbose: "every member of the source class is a member of the target class" },
  entails: { label: "entails", dash: "1 4", verbose: "the target follows logically from the source (a reasoner derives it)" },
  extracts: { label: "extracts", dash: "1 4", verbose: "the source (e.g. an LLM) produces the target structure from text" },
  verifies: { label: "verifies", dash: "8 3 2 3", verbose: "the symbolic source checks/constrains the target neural output" },
  embeds: { label: "embeds", dash: "6 4", verbose: "the source is represented as a learned vector" },
  relates: { label: "relates", verbose: "a generic relation shown on the overview map" },
};
