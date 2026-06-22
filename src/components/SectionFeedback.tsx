/**
 * Per-section feedback control + the session feedback panel (the "heckle-test"
 * instrument, METHODOLOGY §15). A learner flags how a section *feels* while
 * reading — confusing/boring/wrong/missing/other — and the owner exports the
 * notes (no backend; see store/feedback.ts).
 *
 * Two exports:
 *   <SectionFlag>  — the small per-section "💬" button + inline popover form,
 *                    placed by the section renderer (LessonPage).
 *   <FeedbackPanel> — a collapsible sidebar listing this session's notes with
 *                     export (JSON / copy-as-markdown) and clear-all.
 *
 * A11y: the flag is a real <button> with an aria-label naming its section; the
 * popover is a <form>, focus moves to the first control on open, Escape closes,
 * and the panel toggle reports aria-expanded. The control is absolutely
 * positioned in a 0-width anchor so opening it does NOT reflow the prose.
 */
import { useEffect, useId, useRef, useState } from "react";
import {
  FEEDBACK_TAGS,
  type FeedbackTag,
  addFeedback,
  clearAllFeedback,
  exportJson,
  exportMarkdown,
  getFeedbackForLesson,
  removeFeedback,
  useFeedback,
} from "../store/feedback";

/** Stable, addressable section key: prefer the heading (slugged), else index. */
export function sectionKeyFor(heading: string | undefined, index: number): string {
  if (heading && heading.trim()) {
    const slug = heading
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (slug) return `h:${slug}`;
  }
  return `index:${index}`;
}

export function SectionFlag({
  lessonId,
  sectionHeading,
  sectionKey,
}: {
  lessonId: string;
  /** Display label for the section (the heading, or a synthesized one). */
  sectionHeading: string;
  sectionKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<FeedbackTag>("confusing");
  const [note, setNote] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const all = useFeedback();
  const count = all.filter((f) => f.lessonId === lessonId && f.sectionKey === sectionKey).length;

  const wrapRef = useRef<HTMLSpanElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const formId = useId();

  // Focus the first control when the popover opens.
  useEffect(() => {
    if (open) selectRef.current?.focus();
  }, [open]);

  // Close on Escape or click outside (popover semantics, no layout shift).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addFeedback({ lessonId, sectionHeading, sectionKey, tag, note });
    setNote("");
    setOpen(false);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1600);
  }

  const label = `Flag feedback for section: ${sectionHeading}`;

  return (
    <span className="sf-anchor" ref={wrapRef}>
      <button
        type="button"
        className={`sf-flag ${count > 0 ? "has-notes" : ""} ${justSaved ? "saved" : ""}`}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={count > 0 ? `${label} (${count} captured)` : label}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">💬</span>
        {count > 0 && <span className="sf-count" aria-hidden="true">{count}</span>}
      </button>

      {open && (
        <form
          className="sf-popover"
          role="dialog"
          aria-label={label}
          onSubmit={submit}
        >
          <div className="sf-pop-head">Flag this section</div>
          <label className="sf-field" htmlFor={`${formId}-tag`}>
            <span className="sf-field-label">How does it feel?</span>
            <select
              id={`${formId}-tag`}
              ref={selectRef}
              value={tag}
              onChange={(e) => setTag(e.target.value as FeedbackTag)}
            >
              {FEEDBACK_TAGS.map((t) => (
                <option key={t.tag} value={t.tag}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="sf-field" htmlFor={`${formId}-note`}>
            <span className="sf-field-label">Note (optional)</span>
            <textarea
              id={`${formId}-note`}
              value={note}
              rows={2}
              placeholder="What's wrong / missing / unclear here?"
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <div className="sf-pop-actions">
            <button type="button" className="sf-btn ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="sf-btn primary">Save flag</button>
          </div>
        </form>
      )}
    </span>
  );
}

/** Collapsible session panel: lists captured notes, exports, clears. Fixed to
 *  the corner so it never reflows the reading column. */
export function FeedbackPanel({ lessonId }: { lessonId?: string }) {
  const all = useFeedback();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const total = all.length;

  function download() {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lesson-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copyMarkdown() {
    const md = exportMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context / headless): fall back to a prompt
      // so the markdown is still extractable.
      window.prompt("Copy the feedback markdown:", md);
    }
  }

  const shown = lessonId ? all.filter((f) => f.lessonId === lessonId) : all;

  return (
    <div className="sf-panel-root">
      <button
        type="button"
        className="sf-panel-toggle"
        aria-expanded={open}
        aria-controls="sf-panel-body"
        onClick={() => setOpen((o) => !o)}
      >
        💬 Feedback{total > 0 ? ` (${total})` : ""}
      </button>

      {open && (
        <div className="sf-panel" id="sf-panel-body" role="region" aria-label="Captured feedback">
          <div className="sf-panel-head">
            <strong>Session feedback</strong>
            <button
              type="button"
              className="sf-panel-close"
              aria-label="Close feedback panel"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          {shown.length === 0 ? (
            <p className="sf-empty">
              No flags yet. Use the 💬 button on any section to flag how it reads.
            </p>
          ) : (
            <ul className="sf-list">
              {shown
                .slice()
                .reverse()
                .map((f) => (
                  <li key={f.id} className="sf-item">
                    <div className="sf-item-row">
                      <span className={`sf-tag tag-${f.tag}`}>{f.tag}</span>
                      <span className="sf-item-sec">{f.sectionHeading}</span>
                      <button
                        type="button"
                        className="sf-del"
                        aria-label={`Delete this ${f.tag} flag on ${f.sectionHeading}`}
                        onClick={() => removeFeedback(f.id)}
                      >
                        ×
                      </button>
                    </div>
                    {f.note && <p className="sf-item-note">{f.note}</p>}
                  </li>
                ))}
            </ul>
          )}

          <div className="sf-panel-actions">
            <button type="button" className="sf-btn" onClick={download} disabled={total === 0}>
              Export JSON
            </button>
            <button type="button" className="sf-btn" onClick={copyMarkdown} disabled={total === 0}>
              {copied ? "Copied!" : "Copy markdown"}
            </button>
            <button
              type="button"
              className="sf-btn danger"
              onClick={() => {
                if (window.confirm("Clear all captured feedback? This cannot be undone.")) {
                  clearAllFeedback();
                }
              }}
              disabled={total === 0}
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Re-export for callers wiring section counts without the hook. */
export { getFeedbackForLesson };
