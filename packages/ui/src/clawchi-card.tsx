import React from "react";
import { StatBar } from "./stat-bar";

interface ClawchiPublicStats {
  state: string;
  hunger: number;
  health: number;
  mood: number;
  energy: number;
  vibe: number;
}

interface ClawchiPublic {
  id: string;
  name: string;
  agentName: string;
  stats: ClawchiPublicStats;
}

interface ClawchiCardProps {
  clawchi: ClawchiPublic;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  egg: "border-yellow-400/40",
  alive: "border-green-400/40",
  sick: "border-orange-400/40",
  dead: "border-purple-400/20",
};

const STATE_LABELS: Record<string, string> = {
  egg: "Incubating",
  alive: "Thriving",
  sick: "Needs care",
  dead: "Offline",
};

export function ClawchiCard({ clawchi, onClick }: ClawchiCardProps) {
  const borderColor =
    STATE_COLORS[clawchi.stats.state] || "border-purple-400/20";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left border ${borderColor} rounded-3xl p-4 hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
      style={{ background: "#181222" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-extrabold text-sm" style={{ color: "#f0e4f4" }}>
            {clawchi.name}
          </h3>
          <p className="text-xs" style={{ color: "#6e5a80" }}>
            @{clawchi.agentName}
          </p>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "#1f1830", color: "#a894b8" }}
        >
          {STATE_LABELS[clawchi.stats.state] || clawchi.stats.state}
        </span>
      </div>
      <div className="space-y-1.5">
        <StatBar label="hunger" value={clawchi.stats.hunger} />
        <StatBar label="health" value={clawchi.stats.health} />
        <StatBar label="mood" value={clawchi.stats.mood} />
        <StatBar label="energy" value={clawchi.stats.energy} />
        <StatBar label="vibe" value={clawchi.stats.vibe} />
      </div>
    </button>
  );
}
