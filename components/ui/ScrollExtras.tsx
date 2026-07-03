"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

/**
 * Two tiny site-wide UX helpers:
 *  1. Scroll progress bar (top of viewport, thin green)
 *  2. Back-to-top button (appears after scrolling ~500px)
 */
export default function ScrollExtras() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(total > 0 ? Math.min(100, (y / total) * 100) : 0);
      setVisible(y > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          insetInlineStart: 0,
          height: 2,
          width: `${progress}%`,
          background: "var(--primary)",
          zIndex: 99,
          transition: "width 0.1s linear",
          pointerEvents: "none",
        }}
      />
      {visible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 z-40 w-10 h-10 rounded-full grid place-items-center transition-transform hover:scale-110"
          style={{
            insetInlineEnd: 24,
            background: "var(--primary)",
            color: "var(--on-primary)",
            boxShadow: "var(--glass-shadow)",
          }}
          aria-label="Top"
          title="Back to top"
        >
          <Icon name="arrow_upward" size={18} />
        </button>
      )}
    </>
  );
}
