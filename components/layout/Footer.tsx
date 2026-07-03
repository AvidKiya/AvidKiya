"use client";

import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  const { language } = useApp();
  const { state } = useCms();
  const enabled = state.socials.filter((s) => s.enabled);
  const year = new Date().getFullYear();
  const brand = language === "fa" ? state.brand.brandName.fa : state.brand.brandName.en;

  return (
    <footer
      className="no-print relative z-10 border-t py-7 px-6 text-center"
      style={{ borderColor: "var(--outline-variant)" }}
    >
      <div className="flex justify-center gap-6 mb-3 flex-wrap">
        {enabled.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.platform}
            title={s.platform}
            className="opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "var(--on-surface)" }}
          >
            <Icon name={s.icon} size={22} />
          </a>
        ))}
      </div>
      <p
        className="text-[10px] font-mono tracking-widest uppercase"
        style={{ color: "var(--outline)" }}
      >
        © {year} {brand} · DEVHUB_OS ·{" "}
        {language === "fa" ? "ساخته شده با" : "Built with"} Python ❤ &amp; Node.js
      </p>
    </footer>
  );
}
