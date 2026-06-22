/**
 * Per-section reading feedback ("heckle-test" instrument, METHODOLOGY §15).
 *
 * WHY this exists: a learner reading a lesson must be able to flag how a section
 * *feels* — confusing/boring/wrong/missing — in the moment, before any quiz. This
 * is the early-signal mechanism. It measures the felt difficulty of a place in the
 * text, so each note must be ADDRESSABLE to a specific section.
 *
 * WHY localStorage + pub/sub (no backend): the site is a static GitHub Pages
 * bundle; there is no server and none is wanted. This mirrors store/progress.ts:
 * a tiny pub/sub over a localStorage-backed array, surfaced via
 * useSyncExternalStore. The owner gets notes OUT via export-as-JSON / copy-as-
 * markdown (round-trippable) — no network call, no new dependency.
 */
import { useSyncExternalStore } from "react";

export type FeedbackTag = "confusing" | "boring" | "wrong" | "missing" | "other";

export const FEEDBACK_TAGS: { tag: FeedbackTag; label: string }[] = [
  { tag: "confusing", label: "Confusing" },
  { tag: "boring", label: "Boring" },
  { tag: "wrong", label: "Wrong" },
  { tag: "missing", label: "Missing" },
  { tag: "other", label: "Other" },
];

export interface FeedbackItem {
  /** Stable unique id for this note (used as React key + dedupe target). */
  id: string;
  /** Which lesson the section belongs to. */
  lessonId: string;
  /** Human-readable section heading, or a synthesized label when headingless. */
  sectionHeading: string;
  /** Stable, addressable key for the section within the lesson (heading slug,
   *  else `index:<n>`). This is what makes a note point back to ONE place. */
  sectionKey: string;
  tag: FeedbackTag;
  /** Optional free-text elaboration. */
  note?: string;
  /** Epoch ms when captured. */
  timestamp: number;
}

const KEY = "godel-ladder:feedback:v1";

function load(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as FeedbackItem[]) : [];
  } catch {
    return [];
  }
}

let state: FeedbackItem[] = load();
const listeners = new Set<() => void>();

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full / disabled — keep working in-memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function makeId(): string {
  // crypto.randomUUID is available in all evergreen browsers + jsdom; fall back
  // to a timestamp+random id if it is somehow absent (keeps SSR/old WebViews ok).
  try {
    return crypto.randomUUID();
  } catch {
    return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export function addFeedback(input: {
  lessonId: string;
  sectionHeading: string;
  sectionKey: string;
  tag: FeedbackTag;
  note?: string;
}): void {
  const item: FeedbackItem = {
    id: makeId(),
    lessonId: input.lessonId,
    sectionHeading: input.sectionHeading,
    sectionKey: input.sectionKey,
    tag: input.tag,
    note: input.note?.trim() || undefined,
    timestamp: Date.now(),
  };
  state = [...state, item];
  emit();
}

export function removeFeedback(id: string): void {
  const next = state.filter((f) => f.id !== id);
  if (next.length === state.length) return;
  state = next;
  emit();
}

export function clearAllFeedback(): void {
  if (state.length === 0) return;
  state = [];
  emit();
}

/** All notes, in capture order. */
export function getAllFeedback(): FeedbackItem[] {
  return state;
}

/** Notes for one lesson (for the per-section count badges). */
export function getFeedbackForLesson(lessonId: string): FeedbackItem[] {
  return state.filter((f) => f.lessonId === lessonId);
}

// ---- export affordances (round-trippable) --------------------------------

/** The captured notes as pretty JSON — the canonical export. Re-importing this
 *  array verbatim reconstructs the store (round-trip), so the owner can paste it
 *  back or diff it. */
export function exportJson(): string {
  return JSON.stringify(state, null, 2);
}

/** A readable markdown digest grouped by lesson → section, for pasting into an
 *  issue / doc. Lossy-by-design (no ids/timestamps in the body header) but every
 *  field is still present per row, so it remains addressable. */
export function exportMarkdown(): string {
  if (state.length === 0) return "# Lesson feedback\n\n_(none captured)_\n";
  const byLesson = new Map<string, FeedbackItem[]>();
  for (const f of state) {
    const arr = byLesson.get(f.lessonId) ?? [];
    arr.push(f);
    byLesson.set(f.lessonId, arr);
  }
  const lines: string[] = ["# Lesson feedback", ""];
  for (const [lessonId, items] of byLesson) {
    lines.push(`## ${lessonId}`, "");
    for (const f of items) {
      const when = new Date(f.timestamp).toISOString();
      const note = f.note ? ` — ${f.note}` : "";
      lines.push(`- **${f.tag}** @ _${f.sectionHeading}_ (${f.sectionKey})${note}  \`${when}\``);
    }
    lines.push("");
  }
  return lines.join("\n");
}

/** React hook over the whole list (panel + badges re-render on change). */
export function useFeedback(): FeedbackItem[] {
  return useSyncExternalStore(subscribe, getAllFeedback, getAllFeedback);
}
