/**
 * Frozen degenerate fixture (R12): a near-linear 11-concept chain like the original
 * thin stub that started this whole investigation. The richness gate (R1) MUST FAIL
 * this — it is the regression test that the gate can't quietly drift to passing
 * everything. Do not "fix" this graph; it is supposed to be bad.
 */
export const THIN_CONCEPTS = [
  { id: "a", term: "alpha", layer: "data", introducedIn: "s1", prerequisites: [] },
  { id: "b", term: "bravo", layer: "data", introducedIn: "s1", prerequisites: ["a"] },
  { id: "c", term: "charlie", layer: "data", introducedIn: "s2", prerequisites: ["b"] },
  { id: "d", term: "delta", layer: "data", introducedIn: "s2", prerequisites: ["c"] },
  { id: "e", term: "echo", layer: "schema", introducedIn: "s3", prerequisites: ["d"] },
  { id: "f", term: "foxtrot", layer: "schema", introducedIn: "s3", prerequisites: ["e"] },
  { id: "g", term: "golf", layer: "logic", introducedIn: "s4", prerequisites: ["f"] },
  { id: "h", term: "hotel", layer: "logic", introducedIn: "s4", prerequisites: ["g"] },
  { id: "i", term: "india", layer: "neural", introducedIn: "s5", prerequisites: ["h"] },
  { id: "j", term: "juliet", layer: "neural", introducedIn: "s5", prerequisites: ["i"] },
  { id: "k", term: "kilo", layer: "system", introducedIn: "s6", prerequisites: ["j"] },
];
