"use client";

import { useEffect, useState } from "react";
import { useCms } from "@/contexts/CmsContext";

/**
 * Animated showcase object shown beside the hero text.
 * Supports:
 *  - static image (PNG / JPG / SVG / GIF / WebP)
 *  - 3D model (.glb / .gltf) via Google's <model-viewer> web component
 *  - `kind:"none"` → renders nothing (gracefully hides column)
 */
export default function HeroObject() {
  const { state, resolve } = useCms();
  const h = state.heroObject;
  const [mvReady, setMvReady] = useState(false);

  // Lazy-load <model-viewer> only when a 3D model is configured
  useEffect(() => {
    if (h.kind !== "model3d") return;
    if (typeof window === "undefined") return;
    if ((window as any).customElements?.get("model-viewer")) {
      setMvReady(true);
      return;
    }
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    s.onload = () => setMvReady(true);
    document.head.appendChild(s);
  }, [h.kind]);

  if (h.kind === "none" || !h.src) return null;

  const alt = h.alt ? resolve(h.alt) : "Hero object";

  return (
    <div
      className="w-full max-w-[380px] mx-auto relative"
      style={{ aspectRatio: "1/1" }}
    >
      {/* Soft green halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(33,241,168,0.18), transparent 70%)",
        }}
      />

      {h.kind === "image" && (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ animation: "hero-float 6s ease-in-out infinite" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={h.src}
            alt={alt}
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))" }}
          />
        </div>
      )}

      {h.kind === "model3d" && mvReady && (
        // @ts-ignore — model-viewer is a custom element
        <model-viewer
          src={h.src}
          poster={h.posterSrc || undefined}
          alt={alt}
          camera-controls={"" as any}
          auto-rotate={h.autoRotate ? ("" as any) : undefined}
          exposure="1"
          shadow-intensity="1"
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        />
      )}
      {h.kind === "model3d" && !mvReady && h.posterSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={h.posterSrc} alt={alt} className="w-full h-full object-contain" />
      )}

      <style jsx>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(-8px) rotate(-1deg); }
          50%      { transform: translateY(8px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}
