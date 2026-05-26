import type { QuestionFile } from "./types/questions";

/** True when starter source was overwritten with test code (common copy-paste mistake). */
export function isCorruptStarterFile(path: string, content: string): boolean {
  if (!path.includes("src/main/java") || !path.endsWith(".java")) return false;
  if (/org\.junit\.jupiter/.test(content)) return true;
  if (/class\s+SolutionTest\b/.test(content)) return true;
  if (/class\s+SolutionHiddenTest\b/.test(content)) return true;
  if (/class\s+PairMatchServiceTest\b/.test(content)) return true;
  if (path.endsWith("Solution.java") && !/class\s+Solution\b/.test(content)) {
    return true;
  }
  if (
    path.endsWith("PairMatchService.java") &&
    !/class\s+PairMatchService\b/.test(content)
  ) {
    return true;
  }
  return false;
}

export function sanitizeWorkspaceFiles(
  workspace: Record<string, string>,
  questionFiles: QuestionFile[],
): Record<string, string> {
  const next = { ...workspace };
  for (const f of questionFiles) {
    if (f.kind === "starter" && isCorruptStarterFile(f.path, next[f.path] ?? "")) {
      next[f.path] = f.content;
    }
    if (f.kind === "readonly" || f.kind === "hidden_test") {
      if (isTestPath(f.path)) {
        next[f.path] = f.content;
      }
    }
  }
  return next;
}

function isTestPath(p: string): boolean {
  return p.includes("/test/") || p.includes("\\test\\");
}
