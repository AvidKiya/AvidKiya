"use client";

import React from "react";
import RootPageLayout from "@/components/layout/RootPageLayout";
import { useCms } from "@/contexts/CmsContext";
import { Icon } from "@/components/ui/Icons";
import { PersianClock, PersianCalendarFull } from "@/components/ui/PersianCalendar";
import { toPersianDigits } from "@/lib/persian-calendar";

export default function HomePage() {
  const { t, state, resolve, locale } = useCms();

  const handlePrint = () => {
    window.location.href = "/resume?print=1";
  };

  return (
    <RootPageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Hero Panel */}
        <section className="relative">
          <div className="glass relative overflow-hidden">
            {/* Scan animation */}
            <div className="scan-line" />

            {/* ASCII art background */}
            <pre className="absolute top-2 end-4 text-[8px] sm:text-[10px] font-mono text-[var(--color-text-subtle)] opacity-20 select-none hidden md:block leading-tight">
{`    _    ___   _      _    ____  ____  
   / \\  |_ _| | |    / \\  |  _ \\|  _ \\ 
  / _ \\  | |  | |   / _ \\ | | | | |_) |
 / ___ \\ | |  | |__/ ___ \\| |_| |  __/ 
/_/   \\_\\___| |____/_/   \\_\\____/|_|    `}
            </pre>

            <div className="relative p-6 sm:p-10 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
                <span className="pulse-dot" />
                {locale === "fa" ? "آماده همکاری" : "Available for hire"}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black gradient-text">
                  {resolve(state.dashboard.heroTitleA)}
                </h1>
                <p className="text-lg sm:text-xl text-[var(--color-text-muted)]">
                  {resolve(state.dashboard.heroTag)}
                </p>
              </div>

              {/* Description */}
              <p className="max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
                {resolve(state.dashboard.heroDescription)}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="/projects"
                  className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-110 transition shadow-lg shadow-[#5d7ae6]/20"
                >
                  {resolve(state.dashboard.ctaPrimary)}
                </a>
                <a
                  href="/about"
                  className="px-6 py-3 rounded-xl border border-[#5d7ae6]/30 text-[var(--color-primary)] font-bold hover:bg-[#5d7ae6]/10 transition"
                >
                  {resolve(state.dashboard.ctaSecondary)}
                </a>
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 rounded-xl border border-[var(--color-bg-alt)] text-[var(--color-text-muted)] font-medium hover:bg-[var(--color-bg-alt)] transition flex items-center gap-2"
                >
                  <Icon name="Printer" size={16} />
                  {t("resume", "print")}
                </button>
              </div>

              {/* Tech chips */}
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "Node.js", "Go", "Rust", "PostgreSQL", "Redis", "Kubernetes", "Cloudflare"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg bg-[var(--color-bg-alt)] text-xs font-medium text-[var(--color-text-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Calendar + Profile row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clock + Date + Events */}
            <div className="glass p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Live Clock */}
                <div className="text-center sm:text-start space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    {t("calendar", "liveTime")}
                  </h3>
                  <PersianClock />
                </div>

                {/* Today Event */}
                <div className="text-center sm:text-end space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    {t("calendar", "todayEvents")}
                  </h3>
                  <div className="text-sm">
                    {locale === "fa" ? "امروز مناسبت خاصی ثبت نشده" : "No special event today"}
                  </div>
                  <div className="text-xs text-[var(--color-text-subtle)]">
                    {locale === "fa" ? "تقویم هخامنشی فعال است" : "Achaemenid calendar active"}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Calendar */}
            <PersianCalendarFull />
          </div>

          {/* Profile Card */}
          <div className="space-y-6">
            <div className="glass p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-2xl font-black">
                  {state.brand.logoLetter[0]}
                </div>
                <div>
                  <h3 className="font-bold">{state.identity.fullName[locale] || state.identity.fullName.en}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{state.identity.location[locale] || state.identity.location.en}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Icon name="Mail" size={14} />
                  <span>{state.identity.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Icon name="Briefcase" size={14} />
                  <span>
                    {locale === "fa"
                      ? `${toPersianDigits(state.identity.yearsExperience)} سال تجربه`
                      : `${state.identity.yearsExperience} years exp.`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="pulse-dot" />
                  <span className="text-emerald-500 text-xs font-medium">
                    {locale === "fa" ? "آنلاین" : "Online"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="glass p-4">
              <h4 className="text-xs font-bold text-[var(--color-text-subtle)] uppercase tracking-wider mb-3">
                {t("dashboard", "statsTitle")}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {state.dashboard.stats.map((stat) => (
                  <div key={stat.id} className="text-center p-3 rounded-xl bg-[var(--color-bg-alt)]">
                    <div className="text-xl font-black gradient-text">{stat.value}</div>
                    <div className="text-xs text-[var(--color-text-subtle)]">
                      {stat.label[locale] || stat.label.en}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black">{t("dashboard", "featuredWork")}</h2>
            <a href="/projects" className="text-sm text-[var(--color-primary)] hover:underline">
              {t("dashboard", "viewAll")} →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.dashboard.projects.filter(p => p.featured).map((project) => (
              <div key={project.id} className="glass p-6 hover:border-[#5d7ae6]/30 transition group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5d7ae6]/10 flex items-center justify-center">
                    <Icon name="FolderGit2" size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="flex gap-1">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-[var(--color-bg-alt)] text-[10px] font-medium text-[var(--color-text-subtle)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-[var(--color-primary)] transition">
                  {project.title[locale] || project.title.en}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {project.description[locale] || project.description.en}
                </p>
                <a
                  href={project.github ? `https://github.com/${project.github}` : "#"}
                  target="_blank"
                  rel="noopener"
                  className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                  <Icon name="Github" size={12} />
                  {locale === "fa" ? "مشاهده در GitHub" : "View on GitHub"}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        {state.dashboard.newsletterEnabled && (
          <section className="glass p-8 text-center space-y-4">
            <h2 className="text-xl font-black">{t("dashboard", "newsletterTitle")}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">{t("dashboard", "newsletterSubtitle")}</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder={t("dashboard", "emailPlaceholder")}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <button className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:brightness-110 transition">
                {t("dashboard", "subscribe")}
              </button>
            </div>
          </section>
        )}
      </div>
    </RootPageLayout>
  );
}
