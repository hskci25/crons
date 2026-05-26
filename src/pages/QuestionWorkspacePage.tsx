import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import AssistantChatPanel from "../components/assistant/AssistantChatPanel";
import CodeEditor from "../components/questions/CodeEditor";
import EditorTabs from "../components/questions/EditorTabs";
import FileTree from "../components/questions/FileTree";
import QuestionMissionPanel from "../components/questions/QuestionMissionPanel";
import QuestionSpecPanel from "../components/questions/QuestionSpecPanel";
import ResizeHandle from "../components/questions/ResizeHandle";
import RunTestsBar from "../components/questions/RunTestsBar";
import TestResultsPanel from "../components/questions/TestResultsPanel";
import WorkspaceHeader from "../components/questions/WorkspaceHeader";
import { useAuth } from "../hooks/useAuth";
import { usePanelResize } from "../hooks/usePanelResize";
import {
  fetchQuestionBySlug,
  fetchSubmission,
  filesToWorkspace,
  readonlyPaths,
  runTests,
  saveSubmissionRun,
  upsertSubmission,
} from "../lib/questions";
import { sanitizeWorkspaceFiles } from "../lib/workspaceFiles";
import type { QuestionWithFiles } from "../lib/types/questions";
import { useWorkspaceStore } from "../stores/workspaceStore";

function WorkspaceSkeleton() {
  return (
    <>
      <TopNavBar />
      <main className="fixed inset-0 top-12 flex flex-col bg-background">
        <div className="h-12 border-b border-outline-variant/50 bg-surface-container-low animate-pulse" />
        <div className="flex flex-1 min-h-0">
          <div className="w-64 border-r border-outline-variant/50 bg-surface-container-low animate-pulse hidden lg:block" />
          <div className="flex-1 bg-[#0A0A0A] animate-pulse" />
        </div>
      </main>
    </>
  );
}

export default function QuestionWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [question, setQuestion] = useState<QuestionWithFiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const fileTree = usePanelResize(220, {
    min: 160,
    max: 420,
    axis: "horizontal",
    grow: "end",
    storageKey: "crons:panel:fileTree",
  });
  const testResults = usePanelResize(220, {
    min: 120,
    max: 480,
    axis: "vertical",
    grow: "end",
    storageKey: "crons:panel:testResults",
  });
  const chatPanel = usePanelResize(360, {
    min: 280,
    max: 560,
    axis: "horizontal",
    grow: "start",
    storageKey: "crons:panel:chat",
  });
  const missionPanel = usePanelResize(300, {
    min: 240,
    max: 400,
    axis: "horizontal",
    grow: "end",
    storageKey: "crons:panel:mission",
  });
  const specPanel = usePanelResize(320, {
    min: 240,
    max: 520,
    axis: "horizontal",
    grow: "end",
    storageKey: "crons:panel:spec",
  });

  const {
    files,
    readonlyPaths: roPaths,
    activePath,
    openTabs,
    lastRun,
    running,
    chatOpen,
    setFiles,
    setActivePath,
    openTab,
    closeTab,
    updateFile,
    setLastRun,
    setRunning,
    setChatOpen,
  } = useWorkspaceStore();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchQuestionBySlug(slug).then(async (q) => {
      if (!q) {
        setError("Question not found");
        setLoading(false);
        return;
      }
      setQuestion(q);
      let workspace = filesToWorkspace(q.files);
      if (user) {
        const sub = await fetchSubmission(user.id, q.id);
        if (sub?.files && Object.keys(sub.files).length > 0) {
          workspace = { ...workspace, ...(sub.files as Record<string, string>) };
        }
        if (sub?.status === "passed") setSubmitted(true);
      }
      workspace = sanitizeWorkspaceFiles(workspace, q.files);
      setFiles(workspace, readonlyPaths(q.files));
      setLoading(false);
    });
  }, [slug, user?.id, setFiles]);

  const handleRun = useCallback(async () => {
    if (!slug || !question) return;
    setRunning(true);
    setError(null);
    try {
      const result = await runTests(slug, files, roPaths);
      setLastRun(result);
      if (user) {
        await saveSubmissionRun(user.id, question.id, result);
        await upsertSubmission(user.id, question.id, files, "in_progress");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed");
      setLastRun(null);
    } finally {
      setRunning(false);
    }
  }, [slug, question, files, roPaths, user, setLastRun, setRunning]);

  const handleResetStarter = useCallback(() => {
    if (!question) return;
    const next = { ...files };
    for (const file of question.files.filter((x) => x.kind === "starter")) {
      next[file.path] = file.content;
    }
    setFiles(next, roPaths);
    setLastRun(null);
  }, [question, files, roPaths, setFiles, setLastRun]);

  const handleSubmit = useCallback(async () => {
    if (!user || !question || !lastRun) return;
    if (lastRun.passed !== lastRun.total || lastRun.total === 0) return;
    await upsertSubmission(user.id, question.id, files, "passed");
    setSubmitted(true);
  }, [user, question, files, lastRun]);

  const canSubmit =
    !!lastRun &&
    lastRun.total > 0 &&
    lastRun.passed === lastRun.total &&
    !lastRun.compileError;

  const chatContext = useMemo(
    () =>
      question
        ? {
            specMd: question.spec_md,
            title: question.title,
            difficulty: question.difficulty,
            tags: question.tags,
            files,
            lastRunResults: lastRun,
          }
        : null,
    [question, files, lastRun],
  );

  const hasSpec = Boolean(question?.spec_md.trim());
  const showChat = Boolean(user && chatContext && chatOpen);

  if (loading) {
    return <WorkspaceSkeleton />;
  }

  if (!question) {
    return (
      <>
        <TopNavBar />
        <main className="min-h-screen pt-20 px-margin flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/20 mb-4">
            folder_off
          </span>
          <p className="font-headline-sm text-headline-sm text-on-surface mb-2">
            {error ?? "Challenge not found"}
          </p>
          <Link
            to="/questions"
            className="inline-flex items-center gap-1 mt-4 rounded-lg border border-outline-variant px-4 py-2 font-code-md text-code-md text-primary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to challenges
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNavBar />
      <main className="fixed inset-0 top-12 flex flex-col bg-background">
        <WorkspaceHeader
          title={question.title}
          slug={question.slug}
          difficulty={question.difficulty}
          chatOpen={chatOpen}
          onToggleChat={() => setChatOpen(!chatOpen)}
          showChatToggle={Boolean(user)}
        />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Mission / spec sidebar */}
          {hasSpec ? (
            <>
              <div
                className="hidden lg:flex flex-col min-h-0 shrink-0 overflow-hidden"
                style={{ width: specPanel.size }}
              >
                <QuestionSpecPanel
                  title={question.title}
                  difficulty={question.difficulty}
                  tags={question.tags}
                  specMd={question.spec_md}
                />
              </div>
              <div className="hidden lg:block">
                <ResizeHandle
                  orientation="vertical"
                  onPointerDown={specPanel.onPointerDown}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className="hidden lg:flex flex-col min-h-0 shrink-0 overflow-hidden"
                style={{ width: missionPanel.size }}
              >
                <QuestionMissionPanel
                  title={question.title}
                  slug={question.slug}
                  difficulty={question.difficulty}
                  tags={question.tags}
                />
              </div>
              <div className="hidden lg:block">
                <ResizeHandle
                  orientation="vertical"
                  onPointerDown={missionPanel.onPointerDown}
                />
              </div>
            </>
          )}

          {/* Editor area */}
          <div className="flex flex-col flex-1 min-w-0 min-h-0 bg-[#0A0A0A]">
            <RunTestsBar
              passed={lastRun?.passed ?? 0}
              total={lastRun?.total ?? 0}
              running={running}
              canSubmit={canSubmit}
              submitted={submitted}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onResetStarter={handleResetStarter}
            />
            {error && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-error/10 border-b border-error/20 text-error font-code-md text-label-sm shrink-0">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                {error}
              </div>
            )}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <FileTree
                files={files}
                activePath={activePath}
                readonlyPaths={roPaths}
                onSelect={openTab}
                width={fileTree.size}
              />
              <ResizeHandle
                orientation="vertical"
                onPointerDown={fileTree.onPointerDown}
              />
              <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
                <EditorTabs
                  tabs={openTabs}
                  activePath={activePath}
                  readonlyPaths={roPaths}
                  onSelect={setActivePath}
                  onClose={closeTab}
                />
                <div className="flex-1 min-h-0 overflow-hidden">
                  {activePath ? (
                    <CodeEditor
                      path={activePath}
                      value={files[activePath] ?? ""}
                      readOnly={roPaths.has(activePath)}
                      onChange={(filePath, v) => updateFile(filePath, v)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-center p-8">
                      <div>
                        <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 mb-3">
                          code
                        </span>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Select a file from the explorer to start editing
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <ResizeHandle
                  orientation="horizontal"
                  onPointerDown={testResults.onPointerDown}
                />
                <TestResultsPanel
                  lastRun={lastRun}
                  compileError={lastRun?.compileError}
                  height={testResults.size}
                />
              </div>
            </div>
          </div>

          {showChat && (
            <>
              <ResizeHandle
                orientation="vertical"
                onPointerDown={chatPanel.onPointerDown}
              />
              <div
                className="flex min-h-0 shrink-0 overflow-hidden border-l border-outline-variant/60"
                style={{ width: chatPanel.size }}
              >
                <AssistantChatPanel
                  open={chatOpen}
                  onClose={() => setChatOpen(false)}
                  userId={user!.id}
                  questionId={question.id}
                  questionSlug={question.slug}
                  context={chatContext!}
                />
              </div>
            </>
          )}
        </div>

        {/* Mobile mission brief */}
        {!hasSpec && (
          <div className="lg:hidden max-h-40 overflow-y-auto border-t border-outline-variant/60 shrink-0">
            <QuestionMissionPanel
              title={question.title}
              slug={question.slug}
              difficulty={question.difficulty}
              tags={question.tags}
            />
          </div>
        )}
        {hasSpec && (
          <div className="lg:hidden max-h-48 overflow-y-auto border-t border-outline-variant shrink-0">
            <QuestionSpecPanel
              title={question.title}
              difficulty={question.difficulty}
              tags={question.tags}
              specMd={question.spec_md}
            />
          </div>
        )}
      </main>
    </>
  );
}
