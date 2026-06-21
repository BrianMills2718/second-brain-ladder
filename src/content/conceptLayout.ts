/**
 * Pure layout for the concept-graph view — shared by the React component
 * (ConceptGraphView) and the deterministic layout-sanity gate (validate-content.mjs)
 * so a single implementation is both rendered and tested. Lays concepts out by
 * curriculum stage (x advances per stage, spaced by sub-columns), wrapping a deep
 * stage into a grid. The collapse bug (every concept in one x=20 column because a
 * regex returned stage 0 for all) is exactly what `layoutSanity` now fails in CI.
 */
import type { Concept } from "../types";
import { conceptTopoOrder } from "./concepts";

export const LAYOUT = { ROWS: 9, COLW: 178, ROWH: 86, STAGE_GAP: 56, X0: 20, Y0: 20 };

/** concept id → {x,y}. `stageNum` maps a lesson/stage id to its ordinal. */
export function conceptPositions(
  concepts: Concept[],
  stageNum: (introducedIn: string | undefined) => number,
): Record<string, { x: number; y: number }> {
  const rank: Record<string, number> = {};
  conceptTopoOrder().forEach((id, i) => (rank[id] = i));
  const byStage: Record<number, string[]> = {};
  for (const c of concepts) (byStage[stageNum(c.introducedIn)] ??= []).push(c.id);
  const pos: Record<string, { x: number; y: number }> = {};
  let x0 = LAYOUT.X0;
  for (const k of Object.keys(byStage).map(Number).sort((a, b) => a - b)) {
    const ids = byStage[k].sort((a, b) => (rank[a] ?? 0) - (rank[b] ?? 0));
    const cols = Math.max(1, Math.ceil(ids.length / LAYOUT.ROWS));
    ids.forEach((id, i) => {
      pos[id] = { x: x0 + Math.floor(i / LAYOUT.ROWS) * LAYOUT.COLW, y: LAYOUT.Y0 + (i % LAYOUT.ROWS) * LAYOUT.ROWH };
    });
    x0 += cols * LAYOUT.COLW + LAYOUT.STAGE_GAP;
  }
  return pos;
}

/** R11 layout-sanity: stages must be HORIZONTALLY SEPARATED — each x-column belongs
 *  to one curriculum stage. The collapse bug (stageNum→0 for all) mixes every stage
 *  into shared columns; this is its signature, and grid-wrap hides a naive
 *  column-count check, so we test stage-separation directly. */
export function layoutSanity(
  concepts: Concept[],
  stageNum: (introducedIn: string | undefined) => number,
): string[] {
  if (concepts.length === 0) return [];
  const pos = conceptPositions(concepts, stageNum);
  const byId: Record<string, Concept> = Object.fromEntries(concepts.map((c) => [c.id, c]));
  const col: Record<number, string[]> = {};
  for (const [id, p] of Object.entries(pos)) (col[p.x] ??= []).push(id);
  const fail: string[] = [];
  const distinctStages = new Set(concepts.map((c) => c.introducedIn)).size;
  if (Object.keys(col).length < distinctStages)
    fail.push(`layout-sanity: ${Object.keys(col).length} x-columns for ${distinctStages} stages — collapsed/under-spread`);
  for (const [x, ids] of Object.entries(col)) {
    const stagesHere = new Set(ids.map((id) => byId[id]?.introducedIn));
    if (stagesHere.size > 1)
      fail.push(`layout-sanity: x=${x} mixes stages {${[...stagesHere].join(", ")}} — stages not horizontally separated (the collapse signature)`);
  }
  // NOTE (limit, per the 2026-06-21 review): this catches a COLLAPSE / under-spread,
  // not a valid-but-scrambled stage *order*. It can't — `stageNum` is the only
  // ordering signal it has, so the x-order always agrees with it tautologically.
  // Correct ordering is instead guaranteed structurally: the component and this gate
  // both derive stageNum from the SAME lesson.stage, so they can't diverge the way the
  // original regex-vs-lesson collapse did.
  return fail;
}
