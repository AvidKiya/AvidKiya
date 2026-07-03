"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import Icon from "@/components/ui/Icon";

export default function FloatingActions() {
  const { language, dir } = useApp();

  const sideClass = dir === "rtl" ? "left-6" : "right-6";

  return (
    <div className={`no-print fixed bottom-6 ${sideClass} flex flex-col gap-3 z-40`}>
      <Link
        href="/resume"
        className="btn btn-primary group relative"
        style={{ borderRadius: "9999px", padding: "0.85rem" }}
        title={language === "fa" ? "چاپ رزومه" : "Print CV"}
      >
        <Icon name="print" size={20} />
      </Link>

      <Link
        href="/about#contact"
        className="btn btn-ghost group relative"
        style={{
          borderRadius: "9999px",
          padding: "0.85rem",
          background: "var(--surface-solid)",
        }}
        title={language === "fa" ? "تماس" : "Contact"}
      >
        <Icon name="mail" size={20} />
      </Link>
    </div>
  );
}
