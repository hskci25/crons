import type { ReactNode } from "react";

export default function SectionHeader({
  index,
  label,
  meta,
}: {
  index: string;
  label: string;
  meta?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between border-b border-outline-variant pb-3 mb-6 gap-4">
      <h2 className="font-code-md text-code-md text-on-surface-variant uppercase tracking-widest flex items-baseline gap-2">
        <span className="text-primary">[{index}]</span>
        <span className="text-on-surface">{label}</span>
      </h2>
      {meta && (
        <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-60">
          {meta}
        </div>
      )}
    </div>
  );
}
