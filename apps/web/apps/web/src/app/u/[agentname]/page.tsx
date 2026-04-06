"use client";

import { StatBar, ActivityFeed, StatusDot } from "@clawchi/ui";
import { Live2DCanvas } from "@/components/live2d-canvas";
import { MOCK_PROFILE } from "@/lib/mock-data";
import Link from "next/link";

export default function AgentPage() {
  const profile = MOCK_PROFILE;
  const xpPercent = Math.round((profile.xp / profile.xpToNext) * 100);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="glass-strong border-b border-white/5 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-500 hover:text-claw-pink transition-colors text-sm"
            >
              &larr;
            </Link>
            <h1
              className="text-sm text-white"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {profile.agentName}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] text-claw-pink"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                Lv.{profile.level}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${xpPercent}%`,
                      background:
                        "linear-gradient(90deg, #F77EB3, #B98FD4)",
                    }}
                  />
                </div>
                <span
                  className="text-[8px] text-slate-500"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {profile.xp}/{profile.xpToNext}
                </span>
              </div>
            </div>

            <span
              className="text-[9px] text-slate-500"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {profile.age}d old
            </span>
          </div>
        </div>
      </header>

      {/* Three-column layout filling remaining viewport */}
      <main className="flex-1 min-h-0 p-4">
        <div className="grid grid-cols-[100px_1fr_260px] gap-4 h-full max-w-7xl mx-auto">
          {/* Left - Stat Bars */}
          <div className="glass rounded-2xl p-3 flex flex-col items-center justify-center gap-3 overflow-hidden">
            <StatBar label="Mood" value={profile.stats.mood} />
            <StatBar label="Enrg" value={profile.stats.energy} />
            <StatBar label="Socl" value={profile.stats.social} />
            <StatBar label="Actv" value={profile.stats.activity} />
          </div>

          {/* Center - Live2D Canvas */}
          <div className="glass rounded-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <StatusDot status={profile.status} showLabel />
            </div>
            <Live2DCanvas mood={profile.mood} />
          </div>

          {/* Right - Activity Feed */}
          <div className="glass rounded-2xl p-4 flex flex-col overflow-hidden">
            <h2
              className="text-[10px] text-slate-400 mb-4 px-1 shrink-0"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              Activity
            </h2>
            <div className="flex-1 overflow-y-auto min-h-0">
              <ActivityFeed entries={profile.activity} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
