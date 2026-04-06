"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { StatBar, ActivityFeed, StatusDot } from "@clawchi/ui";
import { Live2DCanvas } from "@/components/live2d-canvas";
import { MOCK_PROFILE, MOCK_ACTIVITY, MOCK_FEATURED } from "@/lib/mock-data";
import type { ClawchiProfile } from "@clawchi/types";
import Link from "next/link";

const STAT_COLORS: Record<string, string> = {
  Mood: "#F77EB3",
  Enrg: "#FDCB6E",
  Socl: "#74D4A0",
  Actv: "#74B9FF",
};

function Hearts({ value, color }: { value: number; color: string }) {
  const filled = Math.round((value / 100) * 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="text-[10px] leading-none"
          style={{ color: i < filled ? color : "var(--bg-raised)", transition: "color 0.3s" }}
        >{"\u2665"}</span>
      ))}
    </div>
  );
}

function HorizontalStat({ label, value }: { label: string; value: number }) {
  const color = STAT_COLORS[label] || "#F77EB3";
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-3">
      <span className="font-pixel text-[10px] w-10 shrink-0 uppercase" style={{ color }}>
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-raised)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      <Hearts value={clamped} color={color} />
    </div>
  );
}

function useLayout() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    setReady(true);
    function onChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { isDesktop, ready };
}

function resolveProfile(agentname: string): ClawchiProfile {
  const featured = MOCK_FEATURED.find((f) => f.agentName === agentname);
  if (featured) {
    return {
      ...featured,
      xp: featured.level * 350,
      xpToNext: (featured.level + 1) * 500,
      age: featured.level * 6 + 3,
      activity: MOCK_ACTIVITY,
    };
  }
  return MOCK_PROFILE;
}

export default function AgentPage() {
  const params = useParams<{ agentname: string }>();
  const profile = resolveProfile(params.agentname);
  const { isDesktop, ready } = useLayout();

  const xpPercent = profile.xpToNext > 0 ? Math.round((profile.xp / profile.xpToNext) * 100) : 0;

  return (
    <div
      className={`flex flex-col transition-opacity duration-500 ease-out ${isDesktop ? "h-screen overflow-hidden" : "min-h-screen"}`}
      style={{ opacity: ready ? 1 : 0 }}
    >
      {/* Top Bar */}
      <header className="glass-strong border-b border-claw-purple/5 px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/"
              className="text-txt-muted hover:text-claw-pink transition-colors duration-200 text-lg shrink-0"
            >
              &larr;
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold text-txt-primary truncate">
                {profile.clawchiName}
              </h1>
              <p className="text-sm text-txt-muted mt-0.5 truncate">
                owned by {profile.agentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-pixel text-xs text-claw-pink">
                Lv.{profile.level}
              </span>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-surface)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${xpPercent}%`,
                      background: "linear-gradient(90deg, #F77EB3, #B98FD4)",
                    }}
                  />
                </div>
                <span className="font-pixel text-[10px] text-txt-muted">
                  {profile.xp}/{profile.xpToNext}
                </span>
              </div>
            </div>

            <span className="hidden sm:inline font-pixel text-[11px] text-txt-muted">
              {profile.age}d old
            </span>

            {!isDesktop && <StatusDot status={profile.status} />}
          </div>
        </div>
      </header>

      {/* Mobile / Tablet layout */}
      {!isDesktop && (
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="relative w-full h-[55vh] shrink-0" style={{ background: "rgba(24, 18, 34, 0.85)" }}>
            <div className="absolute top-3 right-3 z-10">
              <StatusDot status={profile.status} showLabel />
            </div>
            <Live2DCanvas
              mood={profile.mood}
              modelId={profile.modelId}
              colorPalette={profile.appearance.colorPalette}
              fillRatio={0.75}
            />
          </div>

          <div className="px-4 py-5 space-y-3">
            <HorizontalStat label="Mood" value={profile.stats.mood} />
            <HorizontalStat label="Enrg" value={profile.stats.energy} />
            <HorizontalStat label="Socl" value={profile.stats.social} />
            <HorizontalStat label="Actv" value={profile.stats.activity} />
          </div>

          <div className="px-4 pb-8 flex-1">
            <h2 className="font-pixel text-xs text-txt-secondary mb-3">
              Activity
            </h2>
            <ActivityFeed entries={profile.activity} />
          </div>
        </main>
      )}

      {/* Desktop layout */}
      {isDesktop && (
        <main className="flex-1 min-h-0 p-4">
          <div className="grid grid-cols-[100px_1fr_280px] gap-4 h-full max-w-7xl mx-auto">
            <div className="surface rounded-3xl p-3 flex flex-col items-center justify-center gap-3 overflow-hidden">
              <StatBar label="Mood" value={profile.stats.mood} />
              <StatBar label="Enrg" value={profile.stats.energy} />
              <StatBar label="Socl" value={profile.stats.social} />
              <StatBar label="Actv" value={profile.stats.activity} />
            </div>

            <div className="surface rounded-3xl relative overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <StatusDot status={profile.status} showLabel />
              </div>
              <Live2DCanvas
                mood={profile.mood}
                modelId={profile.modelId}
                colorPalette={profile.appearance.colorPalette}
              />
            </div>

            <div className="surface rounded-3xl p-4 flex flex-col overflow-hidden">
              <h2 className="font-pixel text-xs text-txt-secondary mb-4 px-1 shrink-0">
                Activity
              </h2>
              <div className="flex-1 overflow-y-auto min-h-0">
                <ActivityFeed entries={profile.activity} />
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
