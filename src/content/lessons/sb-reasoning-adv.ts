/**
 * Reasoning families — deductive/inductive/abductive, non-monotonic, and the
 * practical engines (Datalog, forward/backward chaining). Expert track.
 */
import type { Lesson } from "../../types";

export const sbReasoningAdv: Lesson = {
  id: "sb-reasoning-adv",
  stage: 14,
  title: "Reasoning Families",
  summary:
    "Entailment is one kind of reasoning. A second brain also generalizes (induction), guesses explanations (abduction), and retracts conclusions when facts arrive (non-monotonic) — and behind the scenes, Datalog and forward/backward chaining are the engines that make rule reasoning scale. (Expert track.)",
  prerequisites: ["sb-reasoning", "sb-kgml"],
  objectives: [
    "Tell deductive, inductive, and abductive reasoning apart.",
    "Explain non-monotonic reasoning and its link to the open-world assumption.",
    "Read a Datalog rule; contrast forward and backward chaining.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Three ways to reason",
      body: `- **@c{deductive-reasoning}** — guaranteed conclusions from rules: the @c{entailment} you've met. Premises true ⇒ conclusion *must* hold.
- **@c{inductive-reasoning}** — generalizing from examples: likely, not guaranteed (the logic of @c{link-prediction}).
- **@c{abductive-reasoning}** — inferring the best *explanation* for an observation (guessing the cause from the effect).

Deduction proves; induction generalizes; abduction explains. A trustworthy brain knows which one it's doing.`,
    },
    {
      heading: "Retraction and engines",
      body: `**@c{non-monotonic-reasoning}** lets you *withdraw* a conclusion when new facts arrive — unlike monotonic @c{entailment}, where more facts never remove a conclusion. ("Tweety flies" until you learn Tweety is a penguin.) This is why the @c{open-world-assumption} matters: absent facts are unknown, so conclusions stay provisional.

Under the hood, **@c{datalog}** (function-free Horn @c{rule}s) is the scalable engine, run two ways (**@c{forward-chaining}**): *forward* materializes every entailment up front; *backward* works from a @c{query} goal to just the facts it needs.`,
    },
  ],
  visualizations: [
    {
      id: "families",
      kind: "typed-graph",
      title: "Deduction vs induction vs abduction",
      textualSummary:
        "From a rule and a case, deduction derives the guaranteed result; induction goes from many results back to a general rule; abduction goes from a result to the most likely case (explanation). Same triangle of rule/case/result, three directions.",
      layers: ["logic"],
      nodes: [
        { id: "rule", type: "Reasoner", layer: "logic", label: "rule (general)", position: { x: 300, y: 30 } },
        { id: "case", type: "Reasoner", layer: "logic", label: "case (cause)", position: { x: 60, y: 200 } },
        { id: "res", type: "Reasoner", layer: "logic", label: "result (effect)", position: { x: 540, y: 200 } },
      ],
      edges: [
        { id: "ded", source: "rule", target: "res", type: "entails", label: "deduce (guaranteed)", layer: "logic" },
        { id: "ind", source: "res", target: "rule", type: "relates", label: "induce (generalize)", layer: "logic" },
        { id: "abd", source: "res", target: "case", type: "relates", label: "abduce (explain)", layer: "logic" },
      ],
    },
  ],
  confusions: [
    { misconception: "All reasoning gives guarantees.", correction: "Only deduction does. Induction (generalize) and abduction (explain) are *likely*, not certain — useful, but verify before committing them to the graph." },
    { misconception: "Adding facts can only add conclusions.", correction: "That's monotonic reasoning. Non-monotonic reasoning *retracts* conclusions when new facts contradict a default — which is why open-world conclusions stay provisional." },
  ],
  quiz: [
    { id: "ra-q1", type: "multiple-choice", prompt: "Inferring the best explanation for an observation is…", options: ["deduction", "induction", "abduction", "entailment"], correct: 2, explanation: "Abduction reasons from effect to likely cause." },
    { id: "ra-q2", type: "true-false", prompt: "True or false: @c{non-monotonic-reasoning} can withdraw a conclusion when new facts arrive.", correct: true, explanation: "Defaults are retracted on contradicting evidence." },
    { id: "ra-q3", type: "true-false", prompt: "True or false: forward chaining materializes entailments up front; backward chaining works from a query goal.", correct: true, explanation: "Two ways to run the same Datalog rules." },
  ],
  masteryCheckpoint:
    "You can distinguish deduction/induction/abduction, explain non-monotonic retraction and its open-world link, and contrast forward vs backward chaining.",
};
