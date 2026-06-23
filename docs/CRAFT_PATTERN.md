# Craft pattern — how a page should actually teach (the full bar)

The gates enforce *structure*; they cannot enforce *good teaching*. This is the authoring
pattern that meets the craft bar (godel `METHODOLOGY.md` §11, after N. Case "How To Explain
Things Real Good"). **Worked template: `src/content/lessons/sb-kg.ts` (Knowledge Graphs) —
copy its shape.**

A page is a *narrative*, authored in this order:

1. **Hook — "show what made you care."** Open with a concrete *want* or *pain*, not a
   definition. No jargon yet. *(sb-kg: "you've got a year of notes and want to ask them a
   connected question — a folder can't answer it.")*
2. **Picture/analogy FIRST (PEA), then name the parts.** Paint a familiar concrete image,
   *then* map the concept onto it. Concrete before abstract. *(sb-kg: a detective's evidence
   board — photos + labeled string you can trace; then photo = entity, string = relation,
   one string = a fact.)* Don't bury the diagram below all the prose — lead with the image.
3. **A Therefore / But spine — not a listicle.** Every section after the picture arrives as
   a *consequence* (Therefore) or a *new problem* (But), so the page reads as one story:
   - **Therefore** to store a fact → the **triple**.
   - **But** symmetric / n-ary facts don't fit three slots → it's a modeling *choice*.
   - **Therefore** triples need a home → **RDF / Turtle** (every symbol explained).
   - **But** that's not the only home → **property graph / Cypher**.
   - **Therefore** two homes → how to **choose** (and kill the "can't reason" myth).
4. **Mechanical floor (already required, non-negotiable):** explain *every* symbol and
   acronym; concept before syntax; quiz distractors that each encode a real misconception
   (+ `wrongExplanations`); ≥1 judged activity; anticipate the learner's confusion inline.
5. **Neutrality:** where options compete, present a fair menu honestly costed; the author's
   preference is one option, never the spine.

**Anti-patterns this replaces** (what the *floor* rewrite of sb-kg still did wrong, before
this pass): opening with a definition; the picture buried at the bottom; "here's X, here's
Y, here's how to choose" exposition; no analogy; no motivating hook.

**Gate note — why this needs discipline, not a checklist.** Rows 1–3 are **soft**: no
deterministic gate enforces a hook, an analogy-first opening, or a Therefore/But spine. They
are caught only by *reading* the page (the feedback sidebar) and by adversarial review.
Treat them as a required authoring discipline. The mechanical floor (row 4) is partly
gate-checked; the *soul* (rows 1–3) is on the author.
