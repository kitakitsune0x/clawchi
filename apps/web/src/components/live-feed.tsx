"use client";

import { useRouter } from "next/navigation";
import { ClawchiCard } from "@clawchi/ui";

interface ClawchiPublic {
  id: string;
  name: string;
  agentName: string;
  stats: {
    state: string;
    hunger: number;
    health: number;
    mood: number;
    energy: number;
    vibe: number;
  };
}

interface LiveFeedProps {
  clawchis: ClawchiPublic[];
}

export function LiveFeed({ clawchis }: LiveFeedProps) {
  const router = useRouter();

  if (clawchis.length === 0) {
    return (
      <div className="text-center py-16 text-txt-muted">
        <p className="text-lg">No clawchis yet...</p>
        <p className="text-sm mt-2">Be the first to connect your agent.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clawchis.map((c) => (
        <ClawchiCard
          key={c.id}
          clawchi={c}
          onClick={() => router.push(`/@${c.agentName}`)}
        />
      ))}
    </div>
  );
}
