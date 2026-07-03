"use client";

import { useEffect, useRef, useState } from "react";
import { useCms } from "@/contexts/CmsContext";
import Icon from "./Icon";

/**
 * Site-wide background music.
 * • Reads config from `state.music`
 * • Autoplays if enabled (with a graceful fallback: browsers block autoplay
 *   without a user gesture, so we show a "▶ play" pill until the visitor
 *   interacts).
 * • Small floating widget at bottom-inline-start with mute/play toggle.
 */
export default function BgMusic() {
  const { state } = useCms();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  const cfg = state.music;

  useEffect(() => {
    if (!cfg.enabled || !cfg.src) return;
    const a = audio.current;
    if (!a) return;
    a.volume = Math.max(0, Math.min(1, cfg.volume));
    a.loop = cfg.loop;
    if (cfg.autoplay) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setNeedsGesture(true));
    }
  }, [cfg.enabled, cfg.src, cfg.volume, cfg.loop, cfg.autoplay]);

  if (!cfg.enabled || !cfg.src) return null;

  function toggle() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => {
        setPlaying(true);
        setNeedsGesture(false);
      });
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audio} src={cfg.src} preload="auto" />
      <button
        onClick={toggle}
        title={cfg.title || "Music"}
        className="fixed bottom-6 z-40 rounded-full flex items-center gap-2 px-3 py-2 text-xs font-bold border transition-transform hover:scale-105"
        style={{
          insetInlineStart: 24,
          background: playing ? "var(--primary)" : "var(--surface-container-solid)",
          color: playing ? "var(--on-primary)" : "var(--on-surface)",
          borderColor: playing ? "var(--primary)" : "var(--outline-variant)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <Icon
          name={playing ? "check_circle" : "rocket_launch"}
          size={16}
          style={{
            animation: playing ? "pulse-soft 2s infinite" : undefined,
          }}
        />
        {needsGesture ? "Play music" : cfg.title || (playing ? "♪" : "▶")}
      </button>
    </>
  );
}
