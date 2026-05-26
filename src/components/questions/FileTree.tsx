import { useMemo } from "react";

interface TreeNode {
  name: string;
  path?: string;
  children: TreeNode[];
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "", children: [] };
  for (const p of paths.sort()) {
    const parts = p.split("/");
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      let child = node.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, children: [], path: isFile ? p : undefined };
        node.children.push(child);
      }
      node = child;
    }
  }
  return root;
}

function fileIcon(name: string, isReadonly: boolean): string {
  if (name.endsWith(".java")) {
    return isReadonly ? "description" : "edit_document";
  }
  if (name === "pom.xml") return "settings";
  return "draft";
}

function TreeItem({
  node,
  depth,
  activePath,
  readonlyPaths,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  activePath: string | null;
  readonlyPaths: Set<string>;
  onSelect: (path: string) => void;
}) {
  if (node.path) {
    const ro = readonlyPaths.has(node.path);
    const active = activePath === node.path;
    const isTest = node.path.includes("/test/");
    return (
      <button
        type="button"
        onClick={() => onSelect(node.path!)}
        className={`group w-full text-left flex items-center gap-2 py-1.5 pr-2 rounded-md mx-1 font-code-md text-label-sm transition-colors ${
          active
            ? "bg-primary/15 text-primary"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/80"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        title={node.path}
      >
        <span
          className={`material-symbols-outlined text-[16px] shrink-0 ${
            isTest ? "text-tertiary/70" : ro ? "text-on-surface-variant/40" : "text-primary/70"
          }`}
        >
          {isTest ? "science" : fileIcon(node.name, ro)}
        </span>
        <span className="truncate flex-1">{node.name}</span>
        {ro && (
          <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-40 shrink-0">
            lock
          </span>
        )}
      </button>
    );
  }
  return (
    <>
      {node.name ? (
        <div
          className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant/50 uppercase py-1.5 mt-1 first:mt-0"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <span className="material-symbols-outlined text-[14px]">folder</span>
          {node.name}
        </div>
      ) : null}
      {node.children.map((c) => (
        <TreeItem
          key={c.path ?? c.name}
          node={c}
          depth={depth + (node.name ? 1 : 0)}
          activePath={activePath}
          readonlyPaths={readonlyPaths}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

interface FileTreeProps {
  files: Record<string, string>;
  activePath: string | null;
  readonlyPaths: Set<string>;
  onSelect: (path: string) => void;
  width?: number;
}

export default function FileTree({
  files,
  activePath,
  readonlyPaths,
  onSelect,
  width = 220,
}: FileTreeProps) {
  const tree = useMemo(() => buildTree(Object.keys(files)), [files]);
  const editableCount = Object.keys(files).filter((p) => !readonlyPaths.has(p)).length;

  return (
    <div
      className="shrink-0 flex flex-col border-r border-outline-variant/50 bg-[#0c0c0c] h-full min-h-0"
      style={{ width }}
    >
      <div className="shrink-0 px-3 py-3 border-b border-outline-variant/40">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Explorer
          </span>
          <span className="font-code-md text-label-sm text-on-surface-variant/50">
            {Object.keys(files).length}
          </span>
        </div>
        <p className="font-code-md text-label-sm text-on-surface-variant/40 mt-1">
          {editableCount} editable
        </p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {tree.children.map((c) => (
          <TreeItem
            key={c.path ?? c.name}
            node={c}
            depth={0}
            activePath={activePath}
            readonlyPaths={readonlyPaths}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
