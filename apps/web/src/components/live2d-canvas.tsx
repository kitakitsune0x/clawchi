"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ClawchiMood, ColorPalette, ModelId } from "@clawchi/types";

const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/Live2D/CubismWebSamples@develop/Samples/Resources";

const MODEL_URLS: Record<ModelId, string> = {
  haru: `${CDN_BASE}/Haru/Haru.model3.json`,
  hiyori: `${CDN_BASE}/Hiyori/Hiyori.model3.json`,
  mao: `${CDN_BASE}/Mao/Mao.model3.json`,
  mark: `${CDN_BASE}/Mark/Mark.model3.json`,
  natori: `${CDN_BASE}/Natori/Natori.model3.json`,
  rice: `${CDN_BASE}/Rice/Rice.model3.json`,
};

const TINT_MAP: Record<ColorPalette, number> = {
  pink: 0xf7a0c8,
  purple: 0xc9a0f0,
  blue: 0xa0c8f7,
  green: 0xa0f0b8,
  red: 0xf0a0a0,
};

interface Live2DCanvasProps {
  mood: ClawchiMood;
  modelId?: ModelId;
  colorPalette?: ColorPalette;
  className?: string;
  fillRatio?: number;
  anchorBottom?: boolean;
}

export function Live2DCanvas({
  mood,
  modelId = "haru",
  colorPalette,
  className = "",
  fillRatio = 0.65,
  anchorBottom = false,
}: Live2DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const live2dRef = useRef<any>(null);
  const loadedModelIdRef = useRef<ModelId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);

  const fitModel = useCallback((model: any, w: number, h: number) => {
    const origH = model.height / model.scale.y;
    const targetH = h * fillRatio;
    const scale = targetH / origH;
    model.scale.set(scale);
    model.x = (w - model.width) / 2;
    if (anchorBottom) {
      model.y = h - model.height;
    } else {
      model.y = (h - model.height) / 2 + h * 0.02;
    }
  }, [fillRatio, anchorBottom]);

  // Initialize PIXI app once
  useEffect(() => {
    let mounted = true;

    async function initApp() {
      try {
        const PIXI = await import("pixi.js");
        (window as any).PIXI = PIXI;

        const live2dModule = await import("pixi-live2d-display/cubism4");
        live2dRef.current = live2dModule;

        if (!mounted || !containerRef.current || !canvasRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.floor(rect.width);
        const h = Math.floor(rect.height);

        const app = new PIXI.Application({
          view: canvasRef.current,
          width: w,
          height: h,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        appRef.current = app;
        setAppReady(true);

        const ro = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (!entry) return;
          const nw = Math.floor(entry.contentRect.width);
          const nh = Math.floor(entry.contentRect.height);
          if (nw > 0 && nh > 0) {
            app.renderer.resize(nw, nh);
            if (modelRef.current) {
              fitModel(modelRef.current, nw, nh);
            }
          }
        });
        ro.observe(containerRef.current);

      } catch (err) {
        if (mounted) {
          console.error("Live2D init error:", err);
          setError(err instanceof Error ? err.message : "Failed to initialize");
          setLoading(false);
        }
      }
    }

    initApp();

    return () => {
      mounted = false;
      setAppReady(false);
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      modelRef.current = null;
      live2dRef.current = null;
      loadedModelIdRef.current = null;
    };
  }, [fitModel]);

  // Load/swap model when modelId, colorPalette, or app readiness changes
  useEffect(() => {
    if (!appReady || !appRef.current || !live2dRef.current) return;
    if (loadedModelIdRef.current === modelId) return;

    let cancelled = false;

    async function loadModel() {
      const app = appRef.current;
      const { Live2DModel } = live2dRef.current;
      if (!app) return;

      const modelUrl = MODEL_URLS[modelId] || MODEL_URLS.haru;

      try {
        const newModel = await Live2DModel.from(modelUrl, {
          autoInteract: false,
        });

        if (cancelled) return;

        // Remove old model
        if (modelRef.current) {
          app.stage.removeChild(modelRef.current);
          modelRef.current.destroy();
        }

        modelRef.current = newModel;
        loadedModelIdRef.current = modelId;

        const rect = containerRef.current?.getBoundingClientRect();
        const w = rect ? Math.floor(rect.width) : app.renderer.width;
        const h = rect ? Math.floor(rect.height) : app.renderer.height;

        fitModel(newModel, w, h);

        if (colorPalette && TINT_MAP[colorPalette]) {
          (newModel as any).tint = TINT_MAP[colorPalette];
        }

        app.stage.addChild(newModel as any);

        try {
          await newModel.motion("idle", 0);
        } catch {
          // motion group may not exist
        }

        setLoading(false);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error("Model load error:", err);
          setError(err instanceof Error ? err.message : "Failed to load model");
          setLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      cancelled = true;
    };
  }, [appReady, modelId, colorPalette, fitModel]);

  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;

    try {
      switch (mood) {
        case "happy":
          model.expression?.(1);
          model.motion?.("tap_body", 0);
          break;
        case "sad":
          model.expression?.(2);
          break;
        case "excited":
          model.expression?.(3);
          model.motion?.("flick_head", 0);
          break;
        default:
          model.expression?.(0);
          model.motion?.("idle", 0);
          break;
      }
    } catch {
      // expression/motion not available
    }
  }, [mood]);

  useEffect(() => {
    const model = modelRef.current;
    if (!model || !colorPalette) return;
    if (TINT_MAP[colorPalette]) {
      (model as any).tint = TINT_MAP[colorPalette];
    }
  }, [colorPalette]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-claw-pink border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-pixel text-[10px] text-txt-muted mt-4">
              Loading...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-5xl mb-4 animate-float">
              {"\uD83E\uDD9E"}
            </div>
            <p className="font-pixel text-[10px] text-txt-secondary mb-2">
              Model offline
            </p>
            <p className="text-[10px] text-txt-muted leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
