import React from "react";

interface StatBarProps {
  label: string;
  value: number;
  className?: string;
}

const STAT_COLORS: Record<string, string> = {
  Mood: "#F77EB3",
  Enrg: "#FDCB6E",
  Socl: "#74D4A0",
  Actv: "#74B9FF",
};

export function StatBar({ label, value, className = "" }: StatBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = STAT_COLORS[label] || "#F77EB3";
  const hearts = Math.round((clamped / 100) * 5);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <span
        className="text-[10px] tabular-nums"
        style={{ fontFamily: '"Press Start 2P", monospace', color }}
      >
        {clamped}
      </span>

      <div
        className="relative w-7 h-36 rounded-full overflow-hidden"
        style={{ background: "#181222", border: `1px solid ${color}15` }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            height: `${clamped}%`,
            background: color,
            boxShadow: clamped > 50 ? `0 0 10px ${color}40` : "none",
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className="text-[7px] leading-none"
            style={{ color: i < hearts ? color : "#2a2240", transition: "color 0.3s" }}
          >{"\u2665"}</span>
        )).reverse()}
      </div>

      <span
        className="text-[8px] uppercase tracking-widest"
        style={{ fontFamily: '"Press Start 2P", monospace', color, opacity: 0.7 }}
      >
        {label}
      </span>
    </div>
  );
}
