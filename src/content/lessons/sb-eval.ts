/**
 * Evaluation — is your brain any good? Gold standards, precision/recall, ranking
 * metrics, calibration, and the logical-consistency metric ML can't give you.
 */
import type { Lesson } from "../../types";

export const sbEval: Lesson = {
  id: "sb-eval",
  stage: 13,
  title: "Evaluation",
  summary:
    "You can't improve what you don't measure. A second brain is evaluated against a trusted gold standard with precision/recall, ranked predictions with Hits@K and MRR, confidence with calibration — and, uniquely for a symbolic system, logical consistency against your ontology.",
  prerequisites: ["sb-construction", "sb-kgml"],
  objectives: [
    "Measure an extractor against a gold standard with precision, recall, F1.",
    "Use Hits@K / MRR for ranked link prediction and calibration for confidence.",
    "Add the logical-consistency metric pure ML can't give you.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Right and complete",
      body: `Measure against a **@c{gold-standard}** (hand-verified facts):

- **@c{precision-recall}** — precision = of what you extracted, how much is right; recall = of what's right, how much you found. They trade off.
- **@c{f1}** — their harmonic mean, one number that punishes being lopsided.

A high-precision/low-recall extractor is cautious; high-recall/low-precision is greedy. F1 keeps you honest.`,
    },
    {
      heading: "Ranking, confidence, and consistency",
      body: `For learned models:

- **@c{hits-at-k}** (Hits@K / MRR) — for @c{link-prediction}, is the true @c{triple} ranked near the top?
- **@c{calibration}** — when the model says 0.9, is it right ~90% of the time? Uncalibrated scores can't be trusted as confidence.

And the metric only a *symbolic* brain affords:

- **@c{logical-consistency-eval}** — what fraction of outputs pass the reasoner without violating your @c{ontology}? Pure ML metrics can't see a logical contradiction; yours can.`,
    },
  ],
  visualizations: [
    {
      id: "pr",
      kind: "typed-graph",
      title: "Precision vs recall against a gold standard",
      textualSummary:
        "Of the extractor's outputs, the overlap with the gold standard is the true positives; precision divides that by all outputs, recall divides it by all gold facts. F1 is their harmonic mean.",
      layers: ["system"],
      nodes: [
        { id: "out", type: "System", layer: "system", label: "extracted (10)", position: { x: 40, y: 90 } },
        { id: "tp", type: "System", layer: "system", label: "correct overlap (8)", position: { x: 340, y: 90 } },
        { id: "gold", type: "System", layer: "system", label: "gold standard (12)", position: { x: 660, y: 90 } },
      ],
      edges: [
        { id: "p", source: "out", target: "tp", type: "relates", label: "precision 8/10", layer: "system" },
        { id: "r", source: "gold", target: "tp", type: "relates", label: "recall 8/12", layer: "system" },
      ],
    },
  ],
  confusions: [
    { misconception: "High accuracy means a good knowledge graph.", correction: "Precision and recall trade off — a cautious extractor has high precision but misses facts (low recall). Report F1, and separately measure logical consistency against your ontology." },
    { misconception: "A confidence score is automatically trustworthy.", correction: "Only if it's calibrated — when it says 0.9 it should be right ~90% of the time. An uncalibrated 0.9 is just a number." },
  ],
  quiz: [
    { id: "ev-q1", type: "multiple-choice", prompt: "Of what you extracted, how much is correct, is…", options: ["recall", "precision", "F1", "calibration"], correct: 1, explanation: "Precision = correct / extracted; recall = correct / all-true." },
    { id: "ev-q2", type: "true-false", prompt: "True or false: @c{calibration} asks whether a model's stated confidence matches how often it's actually right.", correct: true, explanation: "Calibrated 0.9 ⇒ right ~90% of the time." },
    { id: "ev-q3", type: "true-false", prompt: "True or false: a symbolic brain can measure logical consistency against its ontology, which pure ML metrics can't.", correct: true, explanation: "Consistency checking is a uniquely symbolic evaluation." },
  ],
  masteryCheckpoint:
    "You can evaluate with precision/recall/F1 against a gold standard, use Hits@K/MRR and calibration for learned models, and add the logical-consistency metric.",
};
