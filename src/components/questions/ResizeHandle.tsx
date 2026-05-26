interface ResizeHandleProps {
  orientation: "vertical" | "horizontal";
  onPointerDown: (e: React.PointerEvent) => void;
}

export default function ResizeHandle({
  orientation,
  onPointerDown,
}: ResizeHandleProps) {
  const vertical = orientation === "vertical";
  return (
    <div
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      tabIndex={0}
      onPointerDown={onPointerDown}
      className={`shrink-0 z-10 touch-none select-none transition-colors ${
        vertical
          ? "w-1.5 cursor-col-resize hover:bg-primary-container/40 active:bg-primary-container/60"
          : "h-1.5 cursor-row-resize hover:bg-primary-container/40 active:bg-primary-container/60"
      } bg-outline-variant/25`}
    />
  );
}
