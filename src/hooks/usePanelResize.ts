import { useCallback, useEffect, useRef, useState } from "react";

type Axis = "horizontal" | "vertical";
/** Which side of the handle grows when dragging in the positive axis direction. */
type Grow = "start" | "end";

function readStored(key: string | undefined, fallback: number): number {
  if (!key) return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export function usePanelResize(
  initial: number,
  options: {
    min: number;
    max: number;
    axis: Axis;
    grow: Grow;
    storageKey?: string;
  },
) {
  const { min, max, axis, grow, storageKey } = options;
  const [size, setSize] = useState(() => readStored(storageKey, initial));
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, String(size));
    } catch {
      /* ignore */
    }
  }, [size, storageKey]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const startPos = axis === "horizontal" ? e.clientX : e.clientY;
      const startSize = sizeRef.current;

      const onMove = (ev: PointerEvent) => {
        const pos = axis === "horizontal" ? ev.clientX : ev.clientY;
        let delta = pos - startPos;
        if (grow === "start") delta = -delta;
        const next = Math.min(max, Math.max(min, startSize + delta));
        setSize(next);
      };

      const onUp = () => {
        target.releasePointerCapture(e.pointerId);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor =
        axis === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [axis, grow, min, max],
  );

  return { size, setSize, onPointerDown };
}
