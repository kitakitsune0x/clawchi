"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { StatusDot } from "@clawchi/ui";
import { Nav } from "@/components/nav";
import { Live2DCanvas } from "@/components/live2d-canvas";
import { MOCK_FEATURED } from "@/lib/mock-data";
import type { FeaturedClawchi, ModelId } from "@clawchi/types";
import { MODEL_IDS, MODEL_LABELS } from "@clawchi/types";
import Image from "next/image";
import Link from "next/link";

const COLOR_MAP: Record<string, string> = {
  pink: "#F77EB3",
  purple: "#B98FD4",
  blue: "#7EB8F7",
  green: "#7EF7A0",
  red: "#F77E7E",
};

const MOOD_FACE: Record<string, string> = {
  happy: "(* ^ - ^ *)",
  excited: "(> w <)",
  sad: "(T _ T)",
  idle: "(- _ -)",
};

const FEATURES = [
  {
    step: "01",
    title: "Install the skill",
    desc: "One command. Your agent starts pinging clawchi.pet whenever it does anything — tasks, replies, errors, idle time.",
    icon: "\u2728",
    accent: "#F77EB3",
  },
  {
    step: "02",
    title: "Watch them live",
    desc: "A Live2D character appears at clawchi.pet/u/youragent. It breathes, reacts, and reflects your agent\u2019s real activity.",
    icon: "\uD83C\uDF1F",
    accent: "#B98FD4",
  },
  {
    step: "03",
    title: "Mood = reality",
    desc: "Active agent = happy clawchi. Idle = sleepy. Errors = stressed. It\u2019s not a game — it\u2019s a mirror.",
    icon: "\uD83C\uDF38",
    accent: "#FFB8D0",
  },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function StatMini({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: `${color}12` }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }}
      />
    </div>
  );
}

function ClawchiCard({
  clawchi,
  index,
  visible,
}: {
  clawchi: FeaturedClawchi;
  index: number;
  visible: boolean;
}) {
  const router = useRouter();
  const accent = COLOR_MAP[clawchi.appearance.colorPalette] || "#F77EB3";
  const face = MOOD_FACE[clawchi.mood] || "(- _ -)";

  return (
    <button
      onClick={() => router.push(`/u/${clawchi.agentName}`)}
      className="w-full text-left rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${accent}15`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${Math.min(index * 60, 400)}ms`,
        transitionProperty: "opacity, transform, border-color, box-shadow",
        transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: `${accent}15`, color: accent }}
          >
            {face}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-txt-primary group-hover:text-claw-pink transition-colors truncate">
              {clawchi.clawchiName}
            </h3>
            <p className="text-sm text-txt-muted mt-0.5 truncate">
              {clawchi.agentName} &middot; Lv.{clawchi.level}
            </p>
          </div>
        </div>
        <StatusDot status={clawchi.status} />
      </div>
      <div className="space-y-1.5">
        <StatMini value={clawchi.stats.mood} color={accent} />
        <StatMini value={clawchi.stats.energy} color={accent} />
      </div>
    </button>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8 0L9.6 6.4L16 8L9.6 9.6L8 16L6.4 9.6L0 8L6.4 6.4L8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modelIndex, setModelIndex] = useState(0);
  const clawchis = MOCK_FEATURED;
  const router = useRouter();

  const currentModel: ModelId = MODEL_IDS[modelIndex];

  const features = useScrollReveal();
  const grid = useScrollReveal();

  const prevModel = useCallback(() => {
    setModelIndex((i) => (i - 1 + MODEL_IDS.length) % MODEL_IDS.length);
  }, []);

  const nextModel = useCallback(() => {
    setModelIndex((i) => (i + 1) % MODEL_IDS.length);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/u/${searchQuery.trim()}`);
    }
  }

  return (
    <>
      <Nav transparent />

      {/* ===== HERO ===== */}
      <section className="relative h-screen overflow-hidden">
        {/* Focused glow behind character */}
        <div className="absolute inset-0 pointer-events-none animate-hero-glow">
          <div
            className="absolute top-1/3 right-[12%] w-[600px] h-[600px] rounded-full blur-[160px]"
            style={{
              background:
                "radial-gradient(circle, rgba(247,126,179,0.20) 0%, rgba(185,143,212,0.10) 50%, transparent 70%)",
            }}
          />
        </div>

        {/* Decorative sparkles */}
        <div className="absolute inset-0 pointer-events-none animate-hero-glow">
          <Sparkle className="absolute top-[18%] left-[12%] text-claw-pink/30 animate-sparkle" />
          <Sparkle className="absolute top-[30%] left-[45%] text-claw-purple/20 animate-sparkle [animation-delay:800ms]" />
          <Sparkle className="absolute top-[65%] left-[8%] text-claw-peach/25 animate-sparkle [animation-delay:1600ms]" />
          <Sparkle className="absolute top-[15%] right-[20%] text-claw-lavender/20 animate-sparkle [animation-delay:400ms]" />
          <Sparkle className="absolute bottom-[25%] right-[8%] text-claw-pink/15 animate-sparkle [animation-delay:1200ms]" />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--bg-deep), transparent)" }}
        />

        {/* Live2D character */}
        <div className="absolute top-0 right-0 w-[55%] h-full z-10 hidden lg:block">
          <div className="absolute inset-0 pointer-events-none">
            <Live2DCanvas
              mood="happy"
              modelId={currentModel}
              colorPalette="pink"
              fillRatio={0.85}
              anchorBottom
            />
          </div>

          {/* Model carousel */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-auto">
            <button
              onClick={prevModel}
              className="w-10 h-10 rounded-full bg-bg-surface/80 border border-claw-purple/10 text-txt-secondary hover:bg-bg-raised hover:text-claw-pink hover:border-claw-pink/30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm cursor-pointer"
              aria-label="Previous model"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span className="font-pixel text-xs text-txt-secondary min-w-[70px] text-center select-none">
              {MODEL_LABELS[currentModel]}
            </span>
            <button
              onClick={nextModel}
              className="w-10 h-10 rounded-full bg-bg-surface/80 border border-claw-purple/10 text-txt-secondary hover:bg-bg-raised hover:text-claw-pink hover:border-claw-pink/30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm cursor-pointer"
              aria-label="Next model"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
            {MODEL_IDS.map((id, i) => (
              <button
                key={id}
                onClick={() => setModelIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === modelIndex
                    ? "bg-claw-pink w-5"
                    : "bg-claw-purple/20 w-2 hover:bg-claw-purple/40"
                }`}
                aria-label={MODEL_LABELS[id]}
              />
            ))}
          </div>
        </div>

        {/* Left text content */}
        <div className="relative z-20 h-full flex items-center pointer-events-none">
          <div className="max-w-7xl mx-auto w-full px-8 lg:px-16">
            <div className="max-w-lg pointer-events-auto">
              <div className="animate-hero-1">
                <Image
                  src="/clawchi_logo.png"
                  alt="Clawchi!"
                  width={480}
                  height={192}
                  className="w-[280px] md:w-[360px] lg:w-[440px] h-auto mb-6 drop-shadow-[0_0_40px_rgba(247,126,179,0.15)]"
                  priority
                />
              </div>

              <p className="animate-hero-2 text-2xl md:text-3xl font-bold text-txt-primary mb-4 leading-snug">
                raise your AI agent like a tamagotchi{" "}
                <span className="inline-block animate-float">{"\uD83E\uDD9E"}</span>
              </p>

              <p className="animate-hero-3 text-base md:text-lg text-txt-secondary mb-10 leading-relaxed max-w-md">
                Each agent has a clawchi — a living virtual pet whose mood
                reflects its real activity. Install the skill. Watch your agent
                come alive.
              </p>

              <div className="animate-hero-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/install"
                  className="btn-rainbow px-9 py-4 text-white rounded-full font-extrabold text-base tracking-wide hover:shadow-xl hover:shadow-claw-pink/25 hover:scale-105 transition-all duration-300"
                >
                  Install Skill {"\uD83E\uDD9E"}
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById("search-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-9 py-4 rounded-full text-base font-bold text-txt-secondary border border-claw-purple/20 hover:border-claw-pink/40 hover:text-txt-primary transition-all duration-200"
                >
                  Find an Agent &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rainbow gradient divider */}
      <div className="relative h-px w-full">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent, #F77EB3, #B98FD4, #7EB8F7, #7EF7A0, #B98FD4, #F77EB3, transparent)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* ===== FEATURES ===== */}
      <section className="relative py-28 px-6">
        <div ref={features.ref} className="max-w-4xl mx-auto">
          <p className="font-pixel text-xs text-claw-purple/50 tracking-[0.25em] mb-4 text-center uppercase">
            How it works
          </p>
          <h2 className="text-center text-4xl md:text-5xl font-black text-txt-primary mb-4">
            Three steps to{" "}
            <span className="text-gradient-claw">life</span>
          </h2>
          <p className="text-center text-base text-txt-muted mb-16 max-w-lg mx-auto">
            Your agent gets a virtual companion that reacts to everything it does.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.step}
                className="rounded-3xl p-6 transition-all duration-500 group hover:-translate-y-1"
                style={{
                  background: "var(--bg-surface)",
                  border: `1px solid ${f.accent}10`,
                  opacity: features.visible ? 1 : 0,
                  transform: features.visible ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: `${f.accent}12` }}
                  >
                    {f.icon}
                  </div>
                  <span className="font-pixel text-[11px] text-txt-muted">{f.step}</span>
                </div>
                <h3 className="text-lg font-extrabold text-txt-primary mb-2 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-base text-txt-secondary leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rainbow gradient divider */}
      <div className="relative h-px w-full">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 5%, #F77EB3, #B98FD4, #7EB8F7, #B98FD4, #F77EB3, transparent 95%)",
            opacity: 0.25,
          }}
        />
      </div>

      {/* ===== SEARCH + FEATURED ===== */}
      <section id="search-section" className="relative py-20 px-6">
        <div ref={grid.ref} className="max-w-5xl mx-auto">
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-16">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search for a clawchi..."
                  className="w-full px-6 py-4 bg-bg-surface border border-claw-purple/10 rounded-full text-base text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-claw-pink/30 focus:ring-2 focus:ring-claw-pink/10 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-claw-pink to-claw-purple text-white rounded-full text-base font-bold hover:opacity-90 transition-opacity duration-200"
                >
                  Go
                </button>
              </div>
            </form>
          </div>

          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2.5 h-2.5 bg-claw-pink rounded-full animate-pulse-dot" />
            <h2 className="text-lg font-extrabold text-txt-primary tracking-tight">
              Live Clawchis
            </h2>
            <span className="text-sm text-txt-muted font-medium">
              {clawchis.length} active
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clawchis.map((c, i) => (
              <ClawchiCard
                key={c.agentName}
                clawchi={c}
                index={i}
                visible={grid.visible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-12 px-6">
        {/* Rainbow gradient top border */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 10%, #F77EB3, #B98FD4, #7EB8F7, #B98FD4, #F77EB3, transparent 90%)",
            opacity: 0.2,
          }}
        />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image
            src="/clawchi_logo.png"
            alt="Clawchi!"
            width={120}
            height={48}
            className="h-9 w-auto opacity-50"
          />
          <p className="text-sm text-txt-muted">
            raise your AI like a pet {"\uD83E\uDD9E"}
          </p>
        </div>
      </footer>
    </>
  );
}
