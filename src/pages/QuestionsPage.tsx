import { useEffect, useMemo, useState } from "react";
import TopNavBar from "../components/TopNavBar";
import QuestionCard from "../components/questions/QuestionCard";
import { fetchQuestions } from "../lib/questions";
import {
  countByDifficulty,
  questionKind,
  type QuestionKind,
} from "../lib/questionDisplay";
import type { Question } from "../lib/types/questions";

type FilterKind = "all" | QuestionKind;
type FilterDifficulty = "all" | "easy" | "medium" | "hard";

function QuestionCardSkeleton() {
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low/50 p-5 animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="h-9 w-9 rounded-lg bg-surface-container-high" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-surface-container-high" />
          <div className="h-3 w-1/2 rounded bg-surface-container-high" />
        </div>
      </div>
      <div className="h-10 rounded bg-surface-container-high mb-4" />
      <div className="h-8 rounded bg-surface-container-high" />
    </div>
  );
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<FilterKind>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>("all");

  useEffect(() => {
    fetchQuestions().then((q) => {
      setQuestions(q);
      setLoading(false);
    });
  }, []);

  const counts = useMemo(() => countByDifficulty(questions), [questions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return questions.filter((item) => {
      if (kindFilter !== "all" && questionKind(item.tags) !== kindFilter) {
        return false;
      }
      if (difficultyFilter !== "all" && item.difficulty !== difficultyFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.slug.includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q))
      );
    });
  }, [questions, search, kindFilter, difficultyFilter]);

  const kindCounts = useMemo(() => {
    const c = { debugging: 0, feature: 0, general: 0 };
    for (const item of questions) {
      c[questionKind(item.tags)] += 1;
    }
    return c;
  }, [questions]);

  return (
    <>
      <TopNavBar />
      <main className="min-h-screen w-full bg-background text-on-surface pt-20 pb-24">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative px-margin max-w-container-max mx-auto">
          {/* Hero */}
          <section className="py-10 md:py-14 border-b border-outline-variant/40 mb-10">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-3">
              Interview practice
            </p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface max-w-2xl mb-4">
              Real codebases, real constraints
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8">
              Each challenge is a mini Spring-style repo. No LeetCode prompts — read
              the code, fix bugs or ship features, and let tests be your spec.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-low px-4 py-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  inventory_2
                </span>
                <span className="font-code-md text-code-md text-on-surface">
                  {loading ? "—" : questions.length} challenges
                </span>
              </div>
              {!loading && (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-tertiary/30 bg-tertiary/5 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-tertiary" />
                    <span className="font-code-md text-code-md text-on-surface-variant">
                      {counts.easy} easy
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-code-md text-code-md text-on-surface-variant">
                      {counts.medium} medium
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-error/30 bg-error/5 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-error" />
                    <span className="font-code-md text-code-md text-on-surface-variant">
                      {kindCounts.debugging} bug fixes · {kindCounts.feature} features
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Filters */}
          <section className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">
                search
              </span>
              <input
                type="search"
                placeholder="Search by name or tag…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low pl-10 pr-4 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-shadow"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/50 self-center mr-1">
                  Type
                </span>
                {(
                  [
                    ["all", "All", null],
                    ["debugging", "Bug fix", "bug_report"],
                    ["feature", "Feature", "add_circle"],
                  ] as const
                ).map(([value, label, icon]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setKindFilter(value)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 font-code-md text-code-md transition-all ${
                      kindFilter === value
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-outline-variant/60 text-on-surface-variant hover:border-outline hover:text-on-surface"
                    }`}
                  >
                    {icon && (
                      <span className="material-symbols-outlined text-[16px]">
                        {icon}
                      </span>
                    )}
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/50 self-center mr-1">
                  Level
                </span>
                {(["all", "easy", "medium", "hard"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficultyFilter(d)}
                    className={`rounded-lg border px-3 py-1.5 font-code-md text-code-md capitalize transition-all ${
                      difficultyFilter === d
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-outline-variant/60 text-on-surface-variant hover:border-outline hover:text-on-surface"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <QuestionCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low/50 py-16 text-center">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-3">
                search_off
              </span>
              <p className="font-headline-sm text-headline-sm text-on-surface mb-2">
                No challenges match
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Try clearing filters or a different search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setKindFilter("all");
                  setDifficultyFilter("all");
                }}
                className="mt-6 inline-flex items-center gap-1 rounded-lg border border-outline-variant px-4 py-2 font-code-md text-code-md text-primary hover:bg-surface-container-high transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <p className="font-code-md text-label-sm text-on-surface-variant/60 mb-4">
                Showing {filtered.length} of {questions.length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((q, i) => (
                  <QuestionCard key={q.id} question={q} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
