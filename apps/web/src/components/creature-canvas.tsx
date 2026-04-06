"use client";

import { useEffect, useRef } from "react";

interface CreatureCanvasProps {
  stats: any;
  width?: number;
  height?: number;
  className?: string;
}

export function CreatureCanvas({
  stats,
  width = 400,
  height = 400,
  className = "",
}: CreatureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let mounted = true;

    async function init() {
      const { ClawchiGame } = await import("@clawchi/game");
      if (!mounted || !containerRef.current) return;
      gameRef.current = new ClawchiGame({
        parent: containerRef.current,
        width,
        height,
        stats,
      });
    }

    init();

    return () => {
      mounted = false;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    gameRef.current?.updateStats(stats);
  }, [stats]);

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ width, height }}
    />
  );
}
