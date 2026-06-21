/**
 * The ordered lesson list (one per module/page). Order = stage order, the
 * recommended path. UPCOMING shows not-yet-authored topics greyed.
 */
import type { Lesson } from "../../types";
import { sbOrientation } from "./sb-orientation";
import { sbKg } from "./sb-kg";
import { sbQuery } from "./sb-query";
import { sbModeling } from "./sb-modeling";
import { sbOnto } from "./sb-onto";
import { sbOntoEng } from "./sb-onto-eng";
import { sbReasoning } from "./sb-reasoning";
import { sbExpressivity } from "./sb-expressivity";
import { sbNeural } from "./sb-neural";
import { sbNeurosymbolic } from "./sb-neurosymbolic";
import { sbConstruction } from "./sb-construction";
import { sbLlmKg } from "./sb-llm-kg";
import { sbKgml } from "./sb-kgml";

export const LESSONS: Lesson[] = [
  sbOrientation,
  sbKg,
  sbQuery,
  sbModeling,
  sbOnto,
  sbOntoEng,
  sbReasoning,
  sbExpressivity,
  sbNeural,
  sbNeurosymbolic,
  sbConstruction,
  sbLlmKg,
  sbKgml,
];

export const UPCOMING: { stage: number; title: string }[] = [
  { stage: 13, title: "Evaluation & Governance (FAIR, metrics, epistemic status)" },
  { stage: 14, title: "Reasoning families (Datalog, chaining, non-monotonic)" },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
