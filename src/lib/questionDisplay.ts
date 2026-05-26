import type { Question } from "./types/questions";

export type QuestionKind = "debugging" | "feature" | "general";
export type Difficulty = "easy" | "medium" | "hard";

export function questionKind(tags: string[]): QuestionKind {
  if (tags.includes("debugging")) return "debugging";
  if (tags.includes("feature")) return "feature";
  return "general";
}

export function formatQuestionTitle(slugOrTitle: string): string {
  if (!slugOrTitle.includes("-")) return slugOrTitle;
  return slugOrTitle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const DIFFICULTY_STYLES: Record<
  Difficulty,
  { badge: string; dot: string; label: string }
> = {
  easy: {
    badge: "bg-tertiary/15 text-tertiary border-tertiary/30",
    dot: "bg-tertiary",
    label: "Easy",
  },
  medium: {
    badge: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary",
    label: "Medium",
  },
  hard: {
    badge: "bg-error/15 text-error border-error/30",
    dot: "bg-error",
    label: "Hard",
  },
};

export const KIND_STYLES: Record<
  QuestionKind,
  { badge: string; icon: string; description: string }
> = {
  debugging: {
    badge: "bg-error/10 text-error border-error/25",
    icon: "bug_report",
    description: "Find and fix bugs in an existing service",
  },
  feature: {
    badge: "bg-tertiary/10 text-tertiary border-tertiary/25",
    icon: "add_circle",
    description: "Implement missing behavior from tests",
  },
  general: {
    badge: "bg-surface-container-high text-on-surface-variant border-outline-variant",
    icon: "folder_code",
    description: "Explore the repo and make tests pass",
  },
};

export function countByDifficulty(questions: Question[]) {
  return questions.reduce(
    (acc, q) => {
      const d = q.difficulty as Difficulty;
      if (d in acc) acc[d] += 1;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 } as Record<Difficulty, number>,
  );
}
