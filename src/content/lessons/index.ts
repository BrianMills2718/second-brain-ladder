/**
 * The ordered lesson list. UPCOMING shows the not-yet-authored topics greyed.
 */
import type { Lesson } from "../../types";
import { sbOrientation } from "./sb-orientation";
import { sbKg } from "./sb-kg";
import { sbOnto } from "./sb-onto";
import { sbReasoning } from "./sb-reasoning";
import { sbNeural } from "./sb-neural";
import { sbNeurosymbolic } from "./sb-neurosymbolic";

export const LESSONS: Lesson[] = [
  sbOrientation,
  sbKg,
  sbOnto,
  sbReasoning,
  sbNeural,
  sbNeurosymbolic,
];

export const UPCOMING: { stage: number; title: string }[] = [
  { stage: 6, title: "Capstone: Design Your Second Brain" },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
