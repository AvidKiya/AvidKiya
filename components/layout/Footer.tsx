"use client";

import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  const { t, language } = useApp();
  const { state } = useCms();

  const enabled = state.socials.filter((s) => s.enabled);

  return (
    <footer
      className="border-t py-8 px-6 text-center relative z-10"
      style={{ borderColor: "var(--outline-variant)" }}
    >
      <div className="flex justify-center gap-6 mb-4 flex-wrap">
        {enabled.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.platform}
            title={s.platform}
            className="opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center"
            style={{
              color: "var(--on-surface)",
              width: 32,
              height: 32,
            }}
          >
            <Icon name={s.icon} size={22} />
          </a>
        ))}
      </div>
      <p
        className="text-[10px] font-mono opacity-40 tracking-widest uppercase"
        style={{ color: "var(--on-surface-variant)" }}
      >
        © {new Date().getFullYear()}{" "}
        {language === "fa" ? state.brand.brandName.fa : state.brand.brandName.en}
      </p>
    </footer>
  );
}
