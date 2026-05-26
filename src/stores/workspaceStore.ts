import { create } from "zustand";
import type { RunTestsResponse } from "../lib/types/questions";

interface WorkspaceState {
  files: Record<string, string>;
  readonlyPaths: Set<string>;
  activePath: string | null;
  openTabs: string[];
  dirty: boolean;
  lastRun: RunTestsResponse | null;
  running: boolean;
  chatOpen: boolean;
  setFiles: (files: Record<string, string>, readonlyPaths: Set<string>) => void;
  setActivePath: (path: string) => void;
  openTab: (path: string) => void;
  closeTab: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  setLastRun: (run: RunTestsResponse | null) => void;
  setRunning: (v: boolean) => void;
  setChatOpen: (v: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  files: {},
  readonlyPaths: new Set(),
  activePath: null,
  openTabs: [],
  dirty: false,
  lastRun: null,
  running: false,
  chatOpen: true,

  setFiles: (files, readonlyPaths) => {
    const paths = Object.keys(files).sort();
    const first =
      paths.find((p) => p.includes("PairMatchService.java")) ??
      paths.find((p) => p.includes("/service/") && p.endsWith(".java")) ??
      paths[0] ??
      null;
    set({
      files: { ...files },
      readonlyPaths,
      openTabs: first ? [first] : [],
      activePath: first,
      dirty: false,
      lastRun: null,
    });
  },

  setActivePath: (path) => set({ activePath: path }),

  openTab: (path) => {
    const tabs = get().openTabs;
    if (!tabs.includes(path)) {
      set({ openTabs: [...tabs, path], activePath: path });
    } else {
      set({ activePath: path });
    }
  },

  closeTab: (path) => {
    const tabs = get().openTabs.filter((t) => t !== path);
    const active = get().activePath;
    let next = active;
    if (active === path) {
      next = tabs[tabs.length - 1] ?? null;
    }
    set({ openTabs: tabs, activePath: next });
  },

  updateFile: (path, content) => {
    if (get().readonlyPaths.has(path)) return;
    set((s) => ({
      files: { ...s.files, [path]: content },
      dirty: true,
    }));
  },

  setLastRun: (run) => set({ lastRun: run }),
  setRunning: (v) => set({ running: v }),
  setChatOpen: (v) => set({ chatOpen: v }),
}));
