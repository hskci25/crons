import { Link } from "react-router-dom";
import type { Question } from "../../lib/types/questions";
import {
  DIFFICULTY_STYLES,
  formatQuestionTitle,
  KIND_STYLES,
  questionKind,
  type Difficulty,
} from "../../lib/questionDisplay";
import { questionSummary } from "../../lib/questionMissions";

interface QuestionCardProps {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
  const difficulty = question.difficulty as Difficulty;
  const diff = DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.medium;
  const kind = questionKind(question.tags);
  const kindStyle = KIND_STYLES[kind];
  const title = formatQuestionTitle(question.title || question.slug);

  return (
    <Link
      to={`/questions/${question.slug}`}
      className="group relative flex flex-col rounded-xl border border-outline-variant/60 bg-surface-container-low/80 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-surface-container hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100 rounded-t-xl" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high border border-outline-variant/50 text-primary">
            <span className="material-symbols-outlined text-[20px]">
              {kindStyle.icon}
            </span>
          </span>
          <div className="min-w-0">
            <h2 className="font-headline-sm text-headline-sm text-on-surface truncate group-hover:text-primary transition-colors">
              {title}
            </h2>
            <p className="font-code-md text-label-sm text-on-surface-variant/70 truncate mt-0.5">
              {question.slug}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-label-sm text-label-sm uppercase tracking-wide ${diff.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
          {diff.label}
        </span>
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4 line-clamp-2 flex-1">
        {questionSummary(question)}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-label-sm text-label-sm ${kindStyle.badge}`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {kindStyle.icon}
          </span>
          {kind === "debugging" ? "Bug fix" : kind === "feature" ? "Feature" : "Repo"}
        </span>
        {question.tags
          .filter((t) => t !== "debugging" && t !== "feature")
          .slice(0, 3)
          .map((t) => (
            <span
              key={t}
              className="rounded-md bg-surface-container-high/80 px-2 py-0.5 font-code-md text-label-sm text-on-surface-variant capitalize"
            >
              {t}
            </span>
          ))}
        {question.time_limit_min && (
          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-code-md text-label-sm text-on-surface-variant/60">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {question.time_limit_min}m
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
        <span className="font-code-md text-label-sm text-on-surface-variant/50">
          Repo-only · tests define behavior
        </span>
        <span className="inline-flex items-center gap-1 font-code-md text-code-md text-primary opacity-80 group-hover:opacity-100 transition-opacity">
          Open workspace
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </span>
      </div>
    </Link>
  );
}
