import { useEffect, useRef } from "react";

export default function SchematicBackdrop() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.005;
      targetY = (e.clientY - window.innerHeight / 2) * 0.005;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.02)`;
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-cover bg-center transition-transform duration-[600ms] ease-out"
      style={{
        backgroundImage: "url('/auth-backdrop.jpg')",
        transform: "scale(1.02)",
      }}
    />
  );
}
