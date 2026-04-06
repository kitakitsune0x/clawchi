import React from "react";
import type { ActivityEntry, ActivityType } from "@clawchi/types";

interface ActivityFeedProps {
  entries: ActivityEntry[];
  className?: string;
}

const TYPE_LABELS: Record<ActivityType, string> = {
  task_complete: "completed a task",
  reply: "sent a reply",
  message: "sent a message",
  error: "hit an error",
  went_idle: "went idle",
  came_online: "came back online",
};

function formatEntry(entry: ActivityEntry): string {
  const label = TYPE_LABELS[entry.type] || entry.type;
  if (entry.detail) {
    return `${label} \u00b7 ${entry.detail}`;
  }
  return label;
}

export function ActivityFeed({ entries, className = "" }: ActivityFeedProps) {
  if (entries.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p
          className="text-[10px]"
          style={{ fontFamily: '"Press Start 2P", monospace', color: "#6e5a80" }}
        >
          No activity yet...
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className="flex items-start gap-2 px-3 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <span className="text-sm mt-0.5 shrink-0">{"\uD83E\uDD9E"}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-relaxed" style={{ color: "#f0e4f4" }}>
              {formatEntry(entry)}
            </p>
            <p
              className="text-[9px] mt-0.5"
              style={{ fontFamily: '"Press Start 2P", monospace', color: "#6e5a80" }}
            >
              {entry.relativeTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
