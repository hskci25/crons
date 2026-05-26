import type { ReactNode } from "react";

export default function CornerFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-surface-container-low border border-surface-container-high ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -top-px -left-px w-2 h-2 border-t border-l border-primary-container"
      />
      <span
        aria-hidden="true"
        className="absolute -top-px -right-px w-2 h-2 border-t border-r border-primary-container"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-primary-container"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-primary-container"
      />
    </div>
  );
}
