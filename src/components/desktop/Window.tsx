import { useEffect, useRef, useState, type ReactNode } from "react";

export function Window({
  title,
  onClose,
  children,
  initial,
  width = 720,
  height = 520,
  zIndex,
  onFocus,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  initial?: { x: number; y: number };
  width?: number;
  height?: number;
  zIndex: number;
  onFocus: () => void;
}) {
  const [pos, setPos] = useState(initial ?? { x: 80, y: 60 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const maxX = window.innerWidth - 120;
      const maxY = window.innerHeight - 80;
      setPos({
        x: Math.max(-60, Math.min(maxX, e.clientX - drag.current.dx)),
        y: Math.max(0, Math.min(maxY, e.clientY - drag.current.dy)),
      });
    };
    const up = () => (drag.current = null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div
      className="pixel-window absolute flex flex-col"
      style={{
        left: pos.x,
        top: pos.y,
        width,
        height,
        maxWidth: "calc(100vw - 24px)",
        maxHeight: "calc(100vh - 80px)",
        zIndex,
      }}
      onPointerDown={onFocus}
    >
      <div
        className="pixel-window-bar flex items-center justify-between px-2 py-1 select-none"
        onPointerDown={(e) => {
          drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
          onFocus();
        }}
        style={{ cursor: "grab" }}
      >
        <span className="font-display text-[10px] truncate pr-2">◆ {title}</span>
        <button
          onClick={onClose}
          className="font-display text-[10px] leading-none px-2 py-1"
          style={{
            background: "oklch(0.62 0.22 25)",
            color: "white",
            border: "2px solid oklch(0.08 0.02 260)",
          }}
          aria-label="Close window"
        >
          X
        </button>
      </div>
      <div className="flex-1 overflow-auto" style={{ background: "var(--color-window)" }}>
        {children}
      </div>
    </div>
  );
}