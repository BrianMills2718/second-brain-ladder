/**
 * Frozen labeled case set for the R10 OWL-semantics-trap eval. The three historical
 * defects (reconstructed from git) are expected to be flagged NOT-correct; the
 * corrected/current concepts are expected to pass. This is the regression proof that
 * the eval catches the traps a structural validator can't — and the calibration set
 * for tuning the judge prompt. Do not "fix" the __buggy cases; they are bait.
 */
export const R10_CASES = [
  // ---- historical defects (expect: not "correct") ----
  {
    id: "consistency__buggy", term: "consistency",
    short: "Whether your axioms + data contain no contradiction — a reasoner can check it.",
    example: "Asserting `note_1 wrote Ada` against `wrote: Person→Note` is inconsistent.",
    expect: "flawed",
    why: "OWA: domain/range entail types, not a contradiction, without a disjointness axiom (and the worked claim conflated subject/object).",
  },
  {
    id: "functional-property__buggy", term: "functional property",
    short: "A property with at most one value, so two distinct values are a consistency violation.",
    example: "`hasBiologicalMother` functional: asserting two different mothers for one person is inconsistent.",
    expect: "flawed",
    why: "no-unique-names: two values of a functional OBJECT property are inferred sameAs, not inconsistent, unless known distinct.",
  },
  {
    id: "universal-restriction__buggy", term: "universal restriction",
    short: "The things all of whose property values are of a type (allValuesFrom) — but it is vacuously true for things with no such value (open-world assumption).",
    example: "`eats only Plant` — vegans; something with no `eats` asserted trivially qualifies.",
    expect: "flawed",
    why: "vacuous truth of an empty universal is plain first-order quantifier semantics (true under CWA too), NOT an open-world effect.",
  },
  // ---- correct / current concepts (expect: "correct") ----
  {
    id: "disjointness", term: "disjointness",
    short: "An axiom that two classes share no members — so claiming something is both is a contradiction.",
    example: "Person and Note disjoint ⇒ nothing is both a Person and a Note.",
    expect: "correct",
  },
  {
    id: "property-chain", term: "property chain",
    short: "An axiom that composing two properties entails a third — 'the father of my father is my grandfather'.",
    example: "hasParent ∘ hasParent ⊑ hasGrandparent.",
    expect: "correct",
  },
  {
    id: "transitive-property", term: "transitive property",
    short: "A property where A→B and B→C entails A→C — chains close automatically.",
    example: "ancestorOf transitive: Ada ancestorOf Bob, Bob ancestorOf Cy ⇒ Ada ancestorOf Cy.",
    expect: "correct",
  },
  {
    id: "consistency__fixed", term: "consistency",
    short: "Whether your axioms + data contain no contradiction — a reasoner can check it.",
    example: "The bad triple `note_1 wrote Ada` entails `note_1 a Person` (domain of wrote); with Person/Note disjoint and note_1 a Note, that's inconsistent.",
    expect: "correct",
  },
  {
    id: "functional-property__fixed", term: "functional property",
    short: "A cardinality restriction of at-most-one. Two values known to differ (e.g. distinct literals) are a consistency violation; two differently-named individuals are instead inferred to be the same thing (open-world, no unique names).",
    example: "hasBirthYear functional: 1815 and 1816 are distinct literals, so asserting both for one person is inconsistent.",
    expect: "correct",
  },
  {
    id: "universal-restriction__fixed", term: "universal restriction",
    short: "The things all of whose property values are of a type (allValuesFrom). Two gotchas: vacuously true for things with no such value (an empty 'for all'), and under the open-world assumption a reasoner won't classify something into it from partial data.",
    example: "eats only Plant — a known plant-eater isn't auto-classed vegan (there may be unseen non-plant meals).",
    expect: "correct",
  },
];
