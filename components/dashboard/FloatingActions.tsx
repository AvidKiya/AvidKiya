"use client";

import { useApp } from "@/contexts/AppContext";

export default function FloatingActions() {
  const { t, dir } = useApp();

  // Anchor to end-side (bottom-right in LTR, bottom-left in RTL)
  const sideClass = dir === "rtl" ? "left-6 md:left-8" : "right-6 md:right-8";
  const tipSideClass = dir === "rtl" ? "left-full ml-4" : "right-full mr-4";

  return (
    <div className={`fixed bottom-6 md:bottom-8 ${sideClass} flex flex-col gap-4 z-40`}>
      <button
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform group relative"
        style={{
          background: "var(--primary)",
          color: "var(--on-primary)",
          boxShadow: "0 10px 30px -10px rgba(33,241,168,0.5)",
        }}
        onClick={() => window.print()}
        aria-label={t("printCV")}
      >
        <span className="material-symbols-outlined">print</span>
        <span
          className={`absolute ${tipSideClass} px-3 py-1 text-[10px] rounded border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity`}
          style={{
            background: "var(--surface-container-solid)",
            color: "var(--on-surface)",
            borderColor: "var(--outline-variant)",
          }}
        >
          {t("printCV")}
        </span>
      </button>

      <a
        href="#contact"
        className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:scale-110 transition-transform group relative"
        aria-label={t("connect")}
      >
        <span className="material-symbols-outlined" style={{ color: "var(--on-surface)" }}>
          forum
        </span>
        <span
          className={`absolute ${tipSideClass} px-3 py-1 text-[10px] rounded border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity`}
          style={{
            background: "var(--surface-container-solid)",
            color: "var(--on-surface)",
            borderColor: "var(--outline-variant)",
          }}
        >
          {t("connect")}
        </span>
      </a>
    </div>
  );
}
