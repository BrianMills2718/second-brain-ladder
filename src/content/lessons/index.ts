/**
 * The ordered lesson list. UPCOMING shows the not-yet-authored topics greyed in
 * the sidebar so the learner sees where the ladder is heading.
 */
import type { Lesson } from "../../types";
import { sbOrientation } from "./sb-orientation";
import { sbKg } from "./sb-kg";
import { sbOnto } from "./sb-onto";

export const LESSONS: Lesson[] = [sbOrientation, sbKg, sbOnto];

/** Not-yet-authored topics, shown greyed in the sidebar. */
export const UPCOMING: { stage: number; title: string }[] = [
  { stage: 3, title: "Just-Enough Logic (FOL → Description Logic)" },
  { stage: 4, title: "Reasoning & the Open World" },
  { stage: 5, title: "Identity & Entity Resolution" },
  { stage: 6, title: "The Neural Side (Embeddings, LLM Extraction)" },
  { stage: 7, title: "Neurosymbolic: Propose & Verify" },
  { stage: 8, title: "Capstone: Design Your Second Brain" },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
