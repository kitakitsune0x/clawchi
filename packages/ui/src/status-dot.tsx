import React from "react";
import type { AgentStatus } from "@clawchi/types";

interface StatusDotProps {
  status: AgentStatus;
  showLabel?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  AgentStatus,
  { color: string; glow: string; label: string }
> = {
  active: {
    color: "bg-green-400",
    glow: "shadow-green-400/50",
    label: "active",
  },
  idle: {
    color: "bg-yellow-400",
    glow: "shadow-yellow-400/50",
    label: "idle",
  },
  sleeping: {
    color: "bg-red-400",
    glow: "shadow-red-400/50",
    label: "sleeping",
  },
};

export function StatusDot({
  status,
  showLabel = false,
  className = "",
}: StatusDotProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full ${config.color} shadow-lg ${config.glow} ${
            status === "active" ? "animate-pulse-dot" : ""
          }`}
        />
        {status === "active" && (
          <div
            className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping opacity-40`}
          />
        )}
      </div>
      {showLabel && (
        <span
          className="text-[8px] uppercase"
          style={{ fontFamily: '"Press Start 2P", monospace', color: "#a894b8" }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
