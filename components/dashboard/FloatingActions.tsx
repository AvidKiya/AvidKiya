"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import Icon from "@/components/ui/Icon";

export default function FloatingActions() {
  const { t, dir } = useApp();

  const sideClass = dir === "rtl" ? "left-6 md:left-8" : "right-6 md:right-8";
  const tipSideClass = dir === "rtl" ? "left-full ml-4" : "right-full mr-4";

  return (
    <div className={`fixed bottom-6 md:bottom-8 ${sideClass} flex flex-col gap-4 z-40`}>
      {/* Open the dedicated resume page (which itself has a "Print CV" button) */}
      <Link
        href="/resume"
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform group relative"
        style={{
          background: "var(--primary)",
          color: "var(--on-primary)",
          boxShadow: "0 10px 30px -10px rgba(33,241,168,0.5)",
        }}
        aria-label={t("printCV")}
      >
        <Icon name="print" size={22} />
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
      </Link>

      <Link
        href="/about#contact"
        className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform group relative"
        style={{
          background: "var(--surface-container-solid)",
          border: "1px solid var(--outline-variant)",
          backdropFilter: "blur(20px)",
        }}
        aria-label={t("connect")}
      >
        <Icon name="mail" size={20} color="var(--primary)" />
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
      </Link>
    </div>
  );
}
