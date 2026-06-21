/**
 * Notation registry — symbols used in the lessons, each with a name, plain
 * meaning, and a concrete example. Drives the inline `@n{key}` chips and the
 * per-stage notation rollup, so no symbol is used undefined.
 */
export interface NotationEntry {
  glyph: string;
  name: string;
  meaning: string;
  example: string;
}

export const NOTATION: Record<string, NotationEntry> = {
  triple: {
    glyph: "(s,\\,p,\\,o)",
    name: "triple",
    meaning: "The atom of a knowledge graph: a subject, a predicate (relation), and an object.",
    example: "`(Ada, wrote, note_1)`.",
  },
  iri: {
    glyph: "\\texttt{IRI}",
    name: "IRI",
    meaning: "A global identifier (a URI) naming an entity or relation, so it means the same thing across datasets.",
    example: "`http://ex.org/Ada` instead of a bare `Ada`.",
  },
  subclassOf: {
    glyph: "\\sqsubseteq",
    name: "subclass of",
    meaning: "$A\\sqsubseteq B$ means every member of class $A$ is also a member of class $B$ (A is-a B).",
    example: "`Researcher ⊑ Person`.",
  },
  rdftype: {
    glyph: "\\texttt{a}",
    name: "rdf:type (is-a)",
    meaning: "In Turtle, `a` is shorthand for `rdf:type` — it asserts an entity is an instance of a class.",
    example: "`:Ada a :Person .`",
  },
  tbox: {
    glyph: "\\mathrm{TBox}",
    name: "TBox (schema)",
    meaning: "The 'terminology box' — the schema/ontology: classes, properties, and axioms (the meaning).",
    example: "`Researcher ⊑ Person`, `wrote: Person→Note`.",
  },
  abox: {
    glyph: "\\mathrm{ABox}",
    name: "ABox (data)",
    meaning: "The 'assertion box' — the data: individual facts about specific entities.",
    example: "`:Ada a :Researcher .`",
  },
  entails: {
    glyph: "\\models",
    name: "entails",
    meaning: "$K\\models f$: the fact $f$ follows logically from $K$ — a reasoner can derive it even if you never stored it.",
    example: "From `Ada:Researcher` + `Researcher⊑Person`, the graph entails `Ada:Person`.",
  },
};
