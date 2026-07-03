"use client";

import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Editable from "@/components/cms/Editable";
import Icon from "@/components/ui/Icon";
import HeroObject from "./HeroObject";

const ASCII = `▄▀█ █░█ █ █▀▄   █▄▀ █ █▄█ ▄▀█
█▀█ ▀▄▀ █ █▄▀   █░█ █ ░█░ █▀█
░░░ A V I D   D E V H U B ░░░`;

export default function HeroSection() {
  const { language } = useApp();
  const { state, resolve } = useCms();
  const d = state.dashboard;
  const id = state.identity;
  const hasHeroObject = state.heroObject.kind !== "none" && state.heroObject.src;

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-6 sm:p-10">
      <div className="scan" />
      <div className="ascii-center">
        <pre className="ascii-mark">{ASCII}</pre>
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-end gap-6">
        {/* Left column: badge + title + description + CTAs + langs */}
        <div className="flex-1 space-y-5">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight"
            style={{
              background: "var(--chip-bg)",
              border: "1px solid var(--glass-border-hover)",
              color: "var(--primary-bright)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full pulse"
              style={{ background: "var(--accent-emerald)" }}
            />
            <Editable path="dashboard.heroTag" editable={d.heroTag} as="span" />
          </div>

          <h1
            className="font-extrabold tracking-tight leading-[1.02] text-4xl sm:text-6xl"
            style={{ color: "var(--on-surface)" }}
          >
            <Editable path="dashboard.heroTitleA" editable={d.heroTitleA} as="span" />
            <br />
            <Editable
              path="dashboard.heroTitleB"
              editable={d.heroTitleB}
              as="span"
              className="grad-text glow-text"
            />
          </h1>

          <Editable
            path="dashboard.heroDescription"
            editable={d.heroDescription}
            as="p"
            multiline
            className="text-base sm:text-lg max-w-xl font-light leading-relaxed"
            style={{ color: "var(--on-surface-variant)" }}
          />

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/projects" className="btn btn-primary">
              <Icon name="code" size={16} />
              <Editable path="dashboard.ctaPrimary" editable={d.ctaPrimary} as="span" />
            </Link>
            <Link href="/about" className="btn btn-outline">
              <Icon name="forum" size={16} />
              <Editable path="dashboard.ctaSecondary" editable={d.ctaSecondary} as="span" />
            </Link>
            <Link href="/resume" className="btn btn-ghost">
              <Icon name="print" size={16} />
              <span>{language === "fa" ? "چاپ رزومه" : "Print CV"}</span>
            </Link>
          </div>

          {/* Language chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["Python", "Node.js", "TypeScript", "Go", "PostgreSQL", "Redis", "Docker", "Kubernetes"].map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
        </div>

        {/* Right column: hero object OR mini stats card */}
        {hasHeroObject ? (
          <div className="md:w-72 shrink-0">
            <HeroObject />
          </div>
        ) : (
          <div
            className="md:w-72 shrink-0 p-5 rounded-2xl"
            style={{
              background: "var(--surface-container-low)",
              border: "1px solid var(--outline-variant)",
            }}
          >
            <div
              className="text-[10px] font-mono uppercase tracking-widest mb-3"
              style={{ color: "var(--outline)" }}
            >
              {language === "fa" ? "پروفایل" : "PROFILE"}
            </div>
            <div className="space-y-3 text-sm">
              <MiniRow icon="location_on" label={language === "fa" ? "مکان" : "Location"} value={resolve(id.location)} />
              <MiniRow icon="mail" label="Email" value={id.email} mono />
              <MiniRow
                icon="workspace_premium"
                label={language === "fa" ? "تجربه" : "Experience"}
                value={
                  language === "fa"
                    ? `${id.yearsExperience}+ سال`
                    : `${id.yearsExperience}+ Years`
                }
              />
              <MiniRow
                icon="bolt"
                label={language === "fa" ? "وضعیت" : "Status"}
                value={language === "fa" ? "آماده کار" : "Available"}
                accent
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniRow({
  icon,
  label,
  value,
  mono,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon name={icon} size={14} color="var(--primary-bright)" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--outline)" }}>
          {label}
        </div>
        <div
          className="text-sm truncate"
          style={{
            color: accent ? "var(--accent-emerald)" : "var(--on-surface)",
            fontFamily: mono ? "var(--font-mono)" : undefined,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
