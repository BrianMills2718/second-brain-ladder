/**
 * Renders one lesson, in the pedagogical order the spec mandates: objectives →
 * definitions → explanation → visualizations → common-confusion boxes → quiz →
 * mastery checkpoint, with prev/next navigation. Pure presentation over the
 * Lesson data object.
 */
import { useEffect } from "react";
import type { Lesson } from "../types";
import { LESSONS } from "../content/lessons";
import { RichText, RichLine } from "./Math";
import { VizRenderer } from "./viz/VizRenderer";
import { Quiz } from "./Quiz";
import { NotationPanel, ConceptPanel, PrereqPretest } from "./Definitions";
import { markVisited, useProgress } from "../store/progress";
import { SectionFlag, FeedbackPanel, sectionKeyFor } from "./SectionFeedback";

/**
 * A lesson-block heading with an inline per-section feedback flag. The flag sits
 * in a 0-width anchor at the end of the heading row, so it never reflows the
 * prose; sections without a heading get a flag of their own (labelled by a
 * synthesized name) so EVERY block is addressable.
 */
function BlockTitle({
  lessonId,
  heading,
  sectionKey,
}: {
  lessonId: string;
  heading: string;
  sectionKey: string;
}) {
  return (
    <h3 className="lesson-block-h">
      <span>{heading}</span>
      <SectionFlag lessonId={lessonId} sectionHeading={heading} sectionKey={sectionKey} />
    </h3>
  );
}

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const progress = useProgress(lesson.id);

  useEffect(() => {
    markVisited(lesson.id);
    document.getElementById("main")?.scrollTo({ top: 0 });
  }, [lesson.id]);

  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];

  return (
    <article className="lesson">
      <FeedbackPanel lessonId={lesson.id} />
      <header className="lesson-head">
        <div className="lesson-stage-badge">Stage {lesson.stage}</div>
        <h2 className="lesson-title">{lesson.title}</h2>
        <p className="lesson-summary">
          <RichLine text={lesson.summary} />
        </p>
        {lesson.prerequisites.length > 0 && (
          <p className="lesson-prereq">
            Prerequisite:{" "}
            {lesson.prerequisites
              .map((id) => LESSONS.find((l) => l.id === id)?.title ?? id)
              .join(", ")}
          </p>
        )}
      </header>

      <PrereqPretest lesson={lesson} />
      <ConceptPanel lesson={lesson} />
      <NotationPanel lesson={lesson} />

      <section className="lesson-block">
        <BlockTitle lessonId={lesson.id} heading="What you'll be able to do" sectionKey="objectives" />
        <ul className="objectives">
          {lesson.objectives.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </section>

      <section className="lesson-block">
        <BlockTitle lessonId={lesson.id} heading="Definitions" sectionKey="definitions" />
        <dl className="definitions">
          {lesson.definitions.map((d) => (
            <div className="def" key={d.term}>
              <dt>{d.term}</dt>
              <dd>
                <RichLine text={d.short} />
                {d.expanded && (
                  <span className="def-expanded">
                    {" "}
                    <RichLine text={d.expanded} />
                  </span>
                )}
                {d.example && (
                  <div className="def-example">
                    e.g. <RichLine text={d.example} />
                  </div>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {lesson.sections.map((s, i) => {
        const key = sectionKeyFor(s.heading, i);
        const label = s.heading?.trim() || `Section ${i + 1}`;
        return (
          <section className="lesson-block prose" key={i}>
            {s.heading ? (
              <BlockTitle lessonId={lesson.id} heading={s.heading} sectionKey={key} />
            ) : (
              <div className="lesson-block-flagbar">
                <SectionFlag lessonId={lesson.id} sectionHeading={label} sectionKey={key} />
              </div>
            )}
            <RichText text={s.body} />
          </section>
        );
      })}

      {lesson.visualizations.map((v) => (
        <section className="lesson-block" key={v.id}>
          <div className="lesson-block-flagbar">
            <SectionFlag
              lessonId={lesson.id}
              sectionHeading={`Visualization: ${v.title}`}
              sectionKey={`viz:${v.id}`}
            />
          </div>
          <VizRenderer viz={v} />
        </section>
      ))}

      {lesson.confusions.length > 0 && (
        <section className="lesson-block">
          <BlockTitle lessonId={lesson.id} heading="Common confusions" sectionKey="confusions" />
          <div className="confusions">
            {lesson.confusions.map((c, i) => (
              <div className="confusion" key={i}>
                <div className="confusion-wrong">
                  <span className="confusion-tag tag-wrong">myth</span>
                  <RichLine text={c.misconception} />
                </div>
                <div className="confusion-right">
                  <span className="confusion-tag tag-right">actually</span>
                  <RichLine text={c.correction} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="lesson-block">
        <BlockTitle lessonId={lesson.id} heading="Check yourself" sectionKey="quiz" />
        <Quiz lessonId={lesson.id} questions={lesson.quiz} />
      </section>

      <section className={`mastery ${progress.mastered ? "is-mastered" : ""}`}>
        <span className="mastery-icon">{progress.mastered ? "✓" : "◎"}</span>
        <div>
          <strong>Mastery checkpoint</strong>
          <p>{lesson.masteryCheckpoint}</p>
          {progress.mastered ? (
            <p className="mastery-done">You aced this quiz. Ready for the next stage.</p>
          ) : (
            <p className="mastery-hint">
              Recommended before moving on — but navigation is never locked.
            </p>
          )}
        </div>
      </section>

      <nav className="lesson-nav" aria-label="Lesson navigation">
        {prev ? (
          <a className="lnav prev" href={`#/${prev.id}`}>
            ← Stage {prev.stage}: {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a className="lnav next" href={`#/${next.id}`}>
            Stage {next.stage}: {next.title} →
          </a>
        )}
      </nav>
    </article>
  );
}
