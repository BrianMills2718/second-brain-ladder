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
import { sbEval } from "./sb-eval";
import { sbReasoningAdv } from "./sb-reasoning-adv";
import { sbGovernance } from "./sb-governance";
import { sbGnn } from "./sb-gnn";
import { sbRetrieve } from "./sb-retrieve";
import { sbFraming } from "./sb-framing";

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
  sbEval,
  sbReasoningAdv,
  sbGovernance,
  sbGnn,
  sbRetrieve,
  sbFraming,
];

export const UPCOMING: { stage: number; title: string }[] = [
  { stage: 19, title: "Capstone: Design & Operate Your Second Brain" },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
