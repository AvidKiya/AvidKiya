"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";
import Editable from "@/components/cms/Editable";
import { ListItem, AddButton } from "@/components/cms/EditableList";
import type { ActivityLog, MiniProject, QuickLink, SystemMetric } from "@/lib/cms/schema";
import { fetchUser } from "@/lib/github";
import ContactForm from "./ContactForm";
import Icon from "@/components/ui/Icon";

/**
 * Command-Center page — recreated 1:1 from the reference mockup:
 *  - No tabs (single scroll)
 *  - Header + 3-column body + status footer
 *  - RTL mirrors the WHOLE layout (asides swap sides automatically via
 *    `flex-row-reverse` and CSS logical properties)
 */
export default function CommandCenter() {
  const { t, dir, language } = useApp();
  const { state, resolveEditable, editMode, isAdmin, addToList } = useCms();
  const a = state.about;

  const [uptime, setUptime] = useState("245:12:04");
  const [followers, setFollowers] = useState<number | null>(null);

  useEffect(() => {
    let sec = 245 * 3600 + 12 * 60 + 4;
    const id = setInterval(() => {
      sec++;
      const h = String(Math.floor(sec / 3600)).padStart(3, "0");
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    fetchUser(state.settings.githubUsername).then((u) => setFollowers(u.followers)).catch(() => {});
    return () => clearInterval(id);
  }, [state.settings.githubUsername]);

  const heatCells = useMemo(
    () =>
      Array.from({ length: 28 }, () => {
        const o = Math.random();
        return o < 0.3 ? 0.05 : o;
      }),
    []
  );

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "var(--bg)",
        backgroundImage:
          "linear-gradient(rgba(33,241,168,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(33,241,168,0.03) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      <div
        className="pointer-events-none fixed left-0 right-0 z-40"
        style={{
          height: 2,
          background: "rgba(33,241,168,0.05)",
          animation: "aboutScan 4s linear infinite",
        }}
      />

      {/* ─── Top nav ───────────────────────────────────────── */}
      <header
        className="h-16 border-b glass-panel flex items-center justify-between px-6 z-40 shrink-0"
        style={{ borderColor: "var(--outline-variant)" }}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                background: "var(--primary)",
                boxShadow: "0 0 10px rgba(33,241,168,0.4)",
              }}
            />
            <Editable
              path="about.version"
              editable={a.version}
              className="font-bold tracking-widest text-sm"
              style={{ color: "var(--primary)" }}
            />
          </Link>
          <nav
            className="hidden xl:flex gap-6 text-xs font-bold uppercase tracking-wider opacity-70"
            style={{ color: "var(--on-surface)" }}
          >
            <Link href="/" className="hover:opacity-100 transition-opacity">
              {t("navWorkspace")}
            </Link>
            <Link href="/projects" className="hover:opacity-100 transition-opacity">
              {t("navProjects")}
            </Link>
            <Link
              href="/about"
              className="hover:opacity-100 transition-opacity"
              style={{ color: "var(--primary)", opacity: 1 }}
            >
              {t("navAbout")}
            </Link>
          </nav>
        </div>

        <div className="flex-1 flex justify-center">
          <div
            className="w-9 h-9 rounded-lg grid place-items-center font-bold text-lg"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            {state.brand.logoLetter}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`hidden sm:block ${dir === "rtl" ? "text-left" : "text-right"}`}>
            <Editable
              path="about.locationLabel"
              editable={a.locationLabel}
              as="div"
              className="text-[10px] uppercase"
              style={{ color: "var(--outline)" }}
            />
            <Editable
              path="about.locationValue"
              editable={a.locationValue}
              as="div"
              className="text-xs"
              style={{ color: "var(--primary)" }}
            />
          </div>
          <LangThemeSwitcher />
        </div>
      </header>

      {/* ─── 3-column body ─────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4 ${
          dir === "rtl" ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* LEFT column — anchored to viewport start */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 lg:overflow-y-auto shrink-0">
          {/* System status */}
          <section
            className="glass-panel rounded-lg p-4 flex flex-col gap-4"
            style={{ background: "rgba(13,21,16,0.8)" }}
          >
            <div
              className="flex justify-between items-center pb-2 border-b"
              style={{ borderColor: "var(--outline-variant)" }}
            >
              <Editable
                path="about.statusTitle"
                editable={a.statusTitle}
                className="text-[11px] font-bold"
                style={{ color: "var(--primary)" }}
              />
              <span className="text-[10px]" style={{ color: "var(--outline)" }}>
                LIVE_FEED
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {a.metrics.map((m, i) => (
                <ListItem
                  key={m.id}
                  path="about.metrics"
                  index={i}
                  onEdit={() => openMetricEditor(state, i)}
                >
                  <Metric metric={m} language={language} />
                </ListItem>
              ))}
              <AddButton
                compact
                label="Add metric"
                onClick={() =>
                  addToList<SystemMetric>("about.metrics", {
                    id: `metric-${Date.now()}`,
                    label: { fa: "معیار جدید", en: "New Metric" },
                    percent: 50,
                    valueFa: "۵۰٪",
                    valueEn: "50%",
                  })
                }
              />
            </div>
          </section>

          {/* Quick links */}
          <section
            className="glass-panel rounded-lg p-4 flex flex-col gap-2 flex-1"
            style={{ background: "rgba(13,21,16,0.8)" }}
          >
            <Editable
              path="about.quickLinksTitle"
              editable={a.quickLinksTitle}
              className="text-[11px] font-bold pb-2 mb-1 border-b block"
              style={{ color: "var(--primary)", borderColor: "var(--outline-variant)" }}
            />
            {a.quickLinks.map((q, i) => (
              <ListItem key={q.id} path="about.quickLinks" index={i}>
                <QuickLinkRow link={q} />
              </ListItem>
            ))}
            <AddButton
              compact
              label="Add link"
              onClick={() =>
                addToList<QuickLink>("about.quickLinks", {
                  id: `qlink-${Date.now()}`,
                  label: { fa: "لینک جدید", en: "New Link" },
                  href: "#",
                  icon: "link",
                })
              }
            />

            <div
              className="mt-auto pt-4 border-t"
              style={{ borderColor: "var(--outline-variant)" }}
            >
              <Editable
                path="about.quote"
                editable={a.quote}
                as="div"
                multiline
                className="p-3 rounded text-[11px] leading-relaxed italic"
                style={{
                  background: "rgba(46,55,49,0.5)",
                  color: "var(--on-surface-variant)",
                }}
              />
            </div>
          </section>
        </aside>

        {/* CENTER column — terminal (single scroll, no tabs) */}
        <main className="flex-1 flex flex-col gap-4 overflow-hidden min-w-0">
          <div className="flex-1 glass-panel rounded-lg flex flex-col overflow-hidden relative" style={{ background: "rgba(13,21,16,0.8)" }}>
            {/* Terminal chrome */}
            <div
              className="h-10 flex items-center justify-between px-4 border-b shrink-0"
              style={{
                background: "rgba(25,34,28,0.8)",
                borderColor: "var(--outline-variant)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,180,171,0.5)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(239,192,81,0.5)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(33,241,168,0.5)" }} />
                <Editable
                  path="about.terminalHeader"
                  editable={a.terminalHeader}
                  className="ms-4 text-[11px] opacity-50 tracking-widest font-mono"
                  style={{ color: "var(--on-surface-variant)" }}
                />
              </div>
              <div className="text-[10px] font-mono" style={{ color: "var(--primary)", opacity: 0.7 }}>
                {resolveEditable(a.uptimeLabel)}: {uptime}
              </div>
            </div>

            {/* Terminal content */}
            <div
              className="flex-1 p-6 overflow-y-auto font-mono leading-relaxed"
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* init lines */}
              <div className="space-y-1">
                <Editable
                  path="about.initSession"
                  editable={a.initSession}
                  as="div"
                  className="text-sm"
                  style={{ color: "var(--primary)" }}
                >
                  # {resolveEditable(a.initSession)}
                </Editable>
                {a.initLines.map((line, i) => (
                  <ListItem key={i} path="about.initLines" index={i}>
                    <Editable
                      path={`about.initLines.${i}`}
                      editable={line}
                      as="div"
                      className="opacity-80 text-sm"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      &gt; {resolveEditable(line)}
                    </Editable>
                  </ListItem>
                ))}
                <AddButton
                  compact
                  label="Add line"
                  onClick={() =>
                    addToList("about.initLines", { value: { fa: "خط جدید", en: "new line" } })
                  }
                />
              </div>

              {/* welcome block */}
              <div
                className="py-2"
                style={{
                  borderInlineStart: "2px solid var(--primary)",
                  paddingInlineStart: "16px",
                  background: "rgba(33,241,168,0.05)",
                }}
              >
                <Editable
                  path="about.welcomeTitle"
                  editable={a.welcomeTitle}
                  as="h2"
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ color: "var(--primary)" }}
                />
                <Editable
                  path="about.welcomeBody"
                  editable={a.welcomeBody}
                  as="p"
                  multiline
                  className="text-sm max-w-2xl leading-loose"
                  style={{ color: "var(--on-surface-variant)" }}
                />
              </div>

              {/* mini projects */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {a.miniProjects.map((mp, i) => (
                    <ListItem
                      key={mp.id}
                      path="about.miniProjects"
                      index={i}
                      onEdit={() => openMiniProjectEditor(state, i)}
                    >
                      <MiniProjectCard mp={mp} indexPath={i} />
                    </ListItem>
                  ))}
                </div>
                <div className="mt-4">
                  <AddButton
                    label="Add project"
                    onClick={() =>
                      addToList<MiniProject>("about.miniProjects", {
                        id: `mini-${Date.now()}`,
                        name: { fa: "پروژه جدید", en: "New Project" },
                        desc: { fa: "توضیحات پروژه", en: "Project description" },
                        status: "STABLE",
                        cta: { fa: "[ مشاهده ]", en: "[ VIEW ]" },
                        href: "#",
                      })
                    }
                  />
                </div>
              </div>

              {/* Inline contact form */}
              <ContactForm />
            </div>

            {/* prompt strip */}
            <div
              className="h-10 border-t flex items-center px-4 shrink-0"
              style={{
                background: "rgba(25,34,28,0.5)",
                borderColor: "var(--outline-variant)",
              }}
            >
              <div className="text-xs flex items-center gap-2" style={{ color: "var(--primary)" }}>
                <span>$</span>
                <Editable
                  path="about.promptText"
                  editable={a.promptText}
                  as="span"
                />
                <span
                  className="w-2 h-4 inline-block align-middle"
                  style={{
                    background: "var(--primary)",
                    animation: "aboutBlink 1s step-end infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT column — anchored to viewport end */}
        <aside className="w-full lg:w-80 flex flex-col gap-4 lg:overflow-y-auto shrink-0">
          {/* Github heatmap */}
          <section
            className="glass-panel rounded-lg p-4 flex flex-col gap-4"
            style={{ background: "rgba(13,21,16,0.8)" }}
          >
            <div className="text-[11px] font-bold border-b pb-2 flex justify-between items-center" style={{ color: "var(--primary)", borderColor: "var(--outline-variant)" }}>
              <Editable path="about.ghActivityTitle" editable={a.ghActivityTitle} />
              <Editable path="about.ghActivitySub" editable={a.ghActivitySub} className="text-[10px] opacity-60" />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {heatCells.map((o, i) => (
                <div
                  key={i}
                  className="w-full aspect-square rounded-sm"
                  style={{ background: `rgba(33,241,168,${o})` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--on-surface-variant)" }}>
              <span>{t("less")}</span>
              <div className="flex gap-1">
                {[0.1, 0.4, 0.7, 1].map((op, i) => (
                  <div key={i} className="w-2 h-2 rounded-sm" style={{ background: `rgba(33,241,168,${op})` }} />
                ))}
              </div>
              <span>{t("more")}</span>
            </div>
            {followers !== null && (
              <div className="text-[10px] text-center opacity-70 pt-1" style={{ color: "var(--on-surface-variant)" }}>
                @{state.settings.githubUsername} · {followers} followers
              </div>
            )}
          </section>

          {/* Recent activity */}
          <section
            className="glass-panel rounded-lg p-4 flex flex-col gap-4 flex-1"
            style={{ background: "rgba(13,21,16,0.8)" }}
          >
            <Editable
              path="about.recentActivityTitle"
              editable={a.recentActivityTitle}
              as="div"
              className="text-[11px] font-bold border-b pb-2"
              style={{ color: "var(--primary)", borderColor: "var(--outline-variant)" }}
            />
            <div className="flex flex-col gap-4 overflow-y-auto">
              {a.recentActivity.map((it, i) => (
                <ListItem key={it.id} path="about.recentActivity" index={i}>
                  <ActivityRow item={it} indexPath={i} />
                </ListItem>
              ))}
              <AddButton
                compact
                label="Add activity"
                onClick={() =>
                  addToList<ActivityLog>("about.recentActivity", {
                    id: `act-${Date.now()}`,
                    when: { fa: "امروز", en: "Today" },
                    what: { fa: "فعالیت جدید", en: "New activity" },
                  })
                }
              />
            </div>

            <a
              href={`mailto:${state.identity.email}`}
              className="mt-auto w-full py-3 rounded font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              <Icon name="rocket_launch" className="text-sm" />
              <Editable path="about.ctaStartProject" editable={a.ctaStartProject} as="span" />
            </a>
          </section>
        </aside>
      </div>

      {/* Footer status bar */}
      <footer
        className="h-8 glass-panel border-t flex items-center justify-between px-6 text-[10px] font-mono z-40 shrink-0"
        style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface-variant)" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full active-status" style={{ background: "var(--primary)" }} />
            <span>{t("connectedTo")}</span>
          </div>
          <div className="hidden md:block border-inline-end pe-4" style={{ borderInlineEndWidth: 1, borderInlineEndStyle: "solid", borderColor: "var(--outline-variant)" }}>
            IP: 104.21.55.104
          </div>
          <div className="hidden md:block">{t("latency")}: 14ms</div>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: "var(--primary)" }}>UTF-8</span>
          <span style={{ color: "var(--primary)" }} className="hidden sm:inline">
            {language === "fa" ? "PERSIAN_LOKAL" : "ENGLISH"}
          </span>
          <Link
            href="/admin"
            className="px-2 py-0.5 font-bold"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            ADMIN_LEVEL_7
          </Link>
        </div>
      </footer>

      <style jsx>{`
        @keyframes aboutScan {
          0% { top: -2px; }
          100% { top: 100vh; }
        }
        @keyframes aboutBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────── sub-components ─────────────── */

function Metric({ metric, language }: { metric: SystemMetric; language: "fa" | "en" }) {
  const { resolve } = useCms();
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span style={{ color: "var(--on-surface-variant)" }}>{resolve(metric.label)}</span>
        <span style={{ color: "var(--primary)" }}>
          {language === "fa" ? metric.valueFa : metric.valueEn}
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: "var(--surface-container-highest)" }}
      >
        <div
          className="h-full"
          style={{
            width: `${metric.percent}%`,
            background: "var(--primary)",
          }}
        />
      </div>
    </div>
  );
}

function QuickLinkRow({ link }: { link: QuickLink }) {
  const { resolve } = useCms();
  return (
    <a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-center justify-between p-2 rounded border border-transparent transition-all"
      style={{ color: "var(--on-surface)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(33,241,168,0.08)";
        e.currentTarget.style.borderColor = "rgba(33,241,168,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      <span className="text-xs">{resolve(link.label)}</span>
      <Icon name={link.icon} size={14} />
    </a>
  );
}

function MiniProjectCard({ mp, indexPath }: { mp: MiniProject; indexPath: number }) {
  const { resolve } = useCms();
  const badgeColor =
    mp.status === "ACTIVE"
      ? "var(--primary)"
      : mp.status === "STABLE"
      ? "#efc051"
      : mp.status === "BETA"
      ? "#48ffb6"
      : "#84958a";
  return (
    <div
      className="border p-4 rounded transition-colors cursor-pointer"
      style={{
        borderColor: "var(--outline-variant)",
        background: "rgba(25,34,28,0.3)",
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <Editable
          path={`about.miniProjects.${indexPath}.name`}
          raw={mp.name}
          className="text-xs font-bold"
          style={{ color: "var(--primary)" }}
        />
        <span
          className="text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: badgeColor, color: "#003824" }}
        >
          {mp.status}
        </span>
      </div>
      <Editable
        path={`about.miniProjects.${indexPath}.desc`}
        raw={mp.desc}
        multiline
        as="p"
        className="text-[11px] mb-4"
        style={{ color: "var(--on-surface-variant)" }}
      />
      <a href={mp.href} target={mp.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        <button
          className="w-full py-2 border text-[10px] uppercase tracking-widest transition-all"
          style={{
            borderColor: "rgba(33,241,168,0.3)",
            color: "var(--primary)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--primary)";
            e.currentTarget.style.color = "var(--on-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--primary)";
          }}
        >
          {resolve(mp.cta)}
        </button>
      </a>
    </div>
  );
}

function ActivityRow({ item, indexPath }: { item: ActivityLog; indexPath: number }) {
  return (
    <div
      className="relative ps-4"
      style={{
        borderInlineStart: `1px solid ${
          item.active ? "rgba(33,241,168,0.3)" : "var(--outline-variant)"
        }`,
      }}
    >
      <div
        className="absolute top-0 w-2 h-2 rounded-full"
        style={{
          background: item.active ? "var(--primary)" : "var(--surface-container-highest)",
          boxShadow: item.active ? "0 0 8px var(--primary)" : "none",
          insetInlineStart: -4.5,
        }}
      />
      <Editable
        path={`about.recentActivity.${indexPath}.when`}
        raw={item.when}
        as="div"
        className="text-[10px]"
        style={{ color: "var(--outline)" }}
      />
      <Editable
        path={`about.recentActivity.${indexPath}.what`}
        raw={item.what}
        as="div"
        className="text-[11px]"
        style={{ color: "var(--on-surface)" }}
      />
    </div>
  );
}

// Placeholder editors — the admin panel offers rich editors, but users can
// still edit i18n text inline via the Editable pencil.
function openMetricEditor(_: any, __: number) {
  alert("Use the ✎ pencil to rename, or the /admin panel for full editing.");
}
function openMiniProjectEditor(_: any, __: number) {
  alert("Use the ✎ pencil to edit text, or the /admin panel for full editing.");
}
