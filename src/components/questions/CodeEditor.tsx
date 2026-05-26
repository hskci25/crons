import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef } from "react";

interface CodeEditorProps {
  path: string | null;
  value: string;
  readOnly: boolean;
  onChange: (path: string, value: string) => void;
}

export default function CodeEditor({
  path,
  value,
  readOnly,
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const pathRef = useRef(path);
  pathRef.current = path;

  const handleMount: OnMount = useCallback((ed) => {
    editorRef.current = ed;
  }, []);

  // Sync when file content changes externally (e.g. Reset starter) on the same tab
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed || !path) return;
    const current = ed.getValue();
    if (current !== value) {
      ed.setValue(value);
    }
  }, [path, value]);

  useEffect(() => {
    return () => {
      editorRef.current = null;
    };
  }, [path]);

  if (!path) {
    return (
      <div className="flex-1 flex items-center justify-center text-on-surface-variant font-code-md text-code-md h-full">
        Select a file to edit
      </div>
    );
  }

  return (
    <Editor
      key={path}
      height="100%"
      language="java"
      theme="vs-dark"
      value={value}
      onMount={handleMount}
      onChange={(v) => {
        const filePath = pathRef.current;
        if (filePath && !readOnly) {
          onChange(filePath, v ?? "");
        }
      }}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'JetBrains Mono', monospace",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: "on",
      }}
    />
  );
}
