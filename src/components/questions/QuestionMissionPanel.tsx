import {
  DIFFICULTY_STYLES,
  formatQuestionTitle,
  KIND_STYLES,
  questionKind,
  type Difficulty,
} from "../../lib/questionDisplay";
import { getQuestionMission } from "../../lib/questionMissions";

interface QuestionMissionPanelProps {
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
}

export default function QuestionMissionPanel({
  title,
  slug,
  difficulty,
  tags,
}: QuestionMissionPanelProps) {
  const diff = DIFFICULTY_STYLES[difficulty as Difficulty] ?? DIFFICULTY_STYLES.medium;
  const kind = questionKind(tags);
  const kindStyle = KIND_STYLES[kind];
  const displayTitle = formatQuestionTitle(title || slug);
  const mission = getQuestionMission(slug, tags);

  return (
    <aside className="flex flex-col h-full min-h-0 bg-surface-container-low border-r border-outline-variant/60 overflow-hidden">
      <div className="shrink-0 px-4 py-4 border-b border-outline-variant/50 bg-gradient-to-b from-surface-container to-transparent">
        <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-1">
          Mission brief
        </p>
        <h1 className="font-headline-sm text-headline-sm text-on-surface leading-snug">
          {displayTitle}
        </h1>
        <div className="flex flex-wrap gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-label-sm text-label-sm ${diff.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
            {diff.label}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-label-sm text-label-sm ${kindStyle.badge}`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {kindStyle.icon}
            </span>
            {kind === "debugging" ? "Bug fix" : kind === "feature" ? "Feature" : "Repo"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {mission.summary}
        </p>

        <div>
          <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/70 mb-2">
            How to approach
          </h3>
          <ol className="space-y-2">
            {mission.steps.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 font-body-md text-body-md text-on-surface-variant"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container/20 text-primary font-code-md text-label-sm">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-outline-variant/50 bg-surface-container/80 p-3 space-y-2">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              lock
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wide">
              Read-only
            </span>
          </div>
          <p className="font-code-md text-label-sm text-on-surface-variant/80 leading-relaxed">
            <span className="text-tertiary">◇</span> pom, controllers, tests —{" "}
            <span className="text-primary">◆</span> service file is yours to edit
          </p>
        </div>
      </div>
    </aside>
  );
}
