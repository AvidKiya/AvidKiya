"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Editable from "@/components/cms/Editable";
import Icon from "@/components/ui/Icon";

export default function HeroSection() {
  const { dir } = useApp();
  const { state } = useCms();
  const d = state.dashboard;

  return (
    <section className="flex flex-col md:flex-row gap-10 items-start md:items-end">
      <div className="flex-1 space-y-5">
        <Editable
          path="dashboard.heroTag"
          editable={d.heroTag}
          as="div"
          className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(33,241,168,0.1)",
            border: "1px solid rgba(33,241,168,0.25)",
            color: "var(--primary)",
          }}
        />
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ color: "var(--on-surface)" }}
        >
          <Editable path="dashboard.heroTitleA" editable={d.heroTitleA} as="span" /> <br />
          <Editable
            path="dashboard.heroTitleB"
            editable={d.heroTitleB}
            as="span"
            className="glow-text"
            style={{ color: "var(--primary)" }}
          />
        </h1>
        <Editable
          path="dashboard.heroDescription"
          editable={d.heroDescription}
          as="p"
          multiline
          className="text-base md:text-lg opacity-70 max-w-xl font-light leading-relaxed"
          style={{ color: "var(--on-surface-variant)" }}
        />
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-[1.02]"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <Editable path="dashboard.ctaPrimary" editable={d.ctaPrimary} as="span" />
            <Icon name={dir === "rtl" ? "arrow_back" : "arrow_forward"} size={18} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border"
            style={{
              borderColor: "var(--outline-variant)",
              color: "var(--on-surface)",
            }}
          >
            <Editable path="dashboard.ctaSecondary" editable={d.ctaSecondary} as="span" />
            <Icon name="alternate_email" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
