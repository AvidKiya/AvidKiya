"use client";

import { useMemo, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import type { Announcement } from "@/lib/cms/schema";

type FilterTab = "active" | "archive" | "all";

export default function AnnouncementsPage() {
  const { t, language } = useApp();
  const { state, isAdmin, update } = useCms();
  const [tab, setTab] = useState<FilterTab>("active");

  const now = Date.now();
  const items = state.announcements.filter((a) => (isAdmin ? true : !a.hidden));

  const active = items.filter(
    (a) =>
      !a.archived &&
      (!a.expiresAt || new Date(a.expiresAt).getTime() > now)
  );
  const archive = items.filter(
    (a) =>
      a.archived ||
      (a.expiresAt && new Date(a.expiresAt).getTime() <= now)
  );

  const view = tab === "active" ? active : tab === "archive" ? archive : items;

  // Pinned first, then newest
  const sorted = useMemo(() => {
    return [...view].sort((a, b) => {
      if ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) !== 0) {
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [view]);

  return (
    <>
      <TopNav />
      <main className="relative z-10 pt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{
              background: "rgba(33,241,168,0.1)",
              border: "1px solid rgba(33,241,168,0.25)",
              color: "var(--primary)",
            }}
          >
            <Icon name="campaign" size={14} />
            {t("navAnnouncements")}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: "var(--on-surface)" }}
          >
            {language === "fa" ? "اعلان‌ها و اخبار" : "Announcements & News"}
          </h1>
          <p
            className="opacity-70 text-sm"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {language === "fa"
              ? "آخرین بروزرسانی‌ها، نظرسنجی‌ها و مطالب"
              : "Latest updates, polls, and posts"}
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {(
            [
              { id: "active", label: language === "fa" ? "فعال" : "Active", n: active.length },
              { id: "archive", label: language === "fa" ? "آرشیو" : "Archive", n: archive.length },
              { id: "all", label: language === "fa" ? "همه" : "All", n: items.length },
            ] as { id: FilterTab; label: string; n: number }[]
          ).map((x) => (
            <button
              key={x.id}
              onClick={() => setTab(x.id)}
              className="px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
              style={{
                background: tab === x.id ? "var(--primary)" : "var(--surface-container-solid)",
                color: tab === x.id ? "var(--on-primary)" : "var(--on-surface)",
                border: `1px solid ${tab === x.id ? "var(--primary)" : "var(--outline-variant)"}`,
              }}
            >
              {x.label}
              <span className="opacity-70 text-[10px]">({x.n})</span>
            </button>
          ))}
        </div>

        {/* List */}
        {sorted.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl glass-panel"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <Icon name="inbox" size={40} />
            <p className="mt-3 text-sm opacity-70">
              {language === "fa" ? "چیزی برای نمایش نیست." : "Nothing to show."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((a, i) => {
              const idx = state.announcements.findIndex((x) => x.id === a.id);
              return (
                <AnnouncementCard
                  key={a.id}
                  a={a}
                  isAdmin={isAdmin}
                  onArchive={() => update(`announcements.${idx}.archived`, true)}
                  onUnarchive={() => update(`announcements.${idx}.archived`, false)}
                  onHide={() => update(`announcements.${idx}.hidden`, true)}
                  onUnhide={() => update(`announcements.${idx}.hidden`, false)}
                  onPin={() => update(`announcements.${idx}.pinned`, !a.pinned)}
                  onVote={(optIdx) => {
                    const opt = a.poll?.options[optIdx];
                    if (!opt) return;
                    update(
                      `announcements.${idx}.poll.options.${optIdx}.votes`,
                      (opt.votes || 0) + 1
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

/* ─────────── card ─────────── */

function AnnouncementCard({
  a,
  isAdmin,
  onArchive,
  onUnarchive,
  onHide,
  onUnhide,
  onPin,
  onVote,
}: {
  a: Announcement;
  isAdmin: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  onHide: () => void;
  onUnhide: () => void;
  onPin: () => void;
  onVote: (i: number) => void;
}) {
  const { language, dir } = useApp();
  const { resolve } = useCms();
  const [votedId, setVotedId] = useState<string | null>(null);

  const now = Date.now();
  const isExpired = a.expiresAt && new Date(a.expiresAt).getTime() <= now;
  const isArchived = a.archived || isExpired;

  const kindIcon: Record<string, string> = {
    news: "campaign",
    text: "description",
    image: "image",
    poll: "poll",
    map: "map",
    custom: "star",
  };

  return (
    <article
      className="glass-panel rounded-xl overflow-hidden transition-all"
      style={{
        background: "var(--surface-container-solid)",
        borderLeft: a.pinned ? "3px solid var(--primary)" : undefined,
        opacity: a.hidden ? 0.5 : 1,
      }}
    >
      {a.image && a.kind !== "poll" && (
        <div style={{ background: "var(--surface-container-highest)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.image}
            alt={resolve(a.title)}
            style={{
              width: "100%",
              maxHeight: 320,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <div className="p-5 md:p-6">
        <div
          className="flex items-start justify-between gap-3 mb-3"
          style={{ flexDirection: dir === "rtl" ? "row-reverse" : "row" }}
        >
          <div
            className="flex items-center gap-2"
            style={{ flexDirection: dir === "rtl" ? "row-reverse" : "row" }}
          >
            <div
              className="w-9 h-9 rounded-lg grid place-items-center"
              style={{
                background: "rgba(33,241,168,0.12)",
                color: "var(--primary)",
              }}
            >
              <Icon name={kindIcon[a.kind]} size={18} />
            </div>
            <div>
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--on-surface)" }}
              >
                {resolve(a.title)}
              </h3>
              <div
                className="text-[11px] opacity-60 mt-0.5 flex gap-2 flex-wrap"
                style={{ color: "var(--on-surface-variant)" }}
              >
                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                {a.pinned && (
                  <span style={{ color: "var(--primary)" }}>
                    ★ {language === "fa" ? "سنجاق شده" : "PINNED"}
                  </span>
                )}
                {isExpired && (
                  <span style={{ color: "#efc051" }}>
                    ⌛ {language === "fa" ? "منقضی" : "EXPIRED"}
                  </span>
                )}
                {a.archived && !isExpired && (
                  <span style={{ color: "var(--outline)" }}>
                    📦 {language === "fa" ? "آرشیو" : "ARCHIVED"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-1">
              <MiniIconBtn
                icon="star"
                title="Pin"
                active={a.pinned}
                onClick={onPin}
              />
              <MiniIconBtn
                icon={isArchived ? "arrow_upward" : "arrow_downward"}
                title={isArchived ? "Un-archive" : "Archive"}
                onClick={isArchived ? onUnarchive : onArchive}
              />
              <MiniIconBtn
                icon={a.hidden ? "visibility_off" : "visibility"}
                title={a.hidden ? "Show" : "Hide"}
                onClick={a.hidden ? onUnhide : onHide}
              />
            </div>
          )}
        </div>

        {a.body && (
          <p
            className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap"
            style={{ color: "var(--on-surface)" }}
          >
            {resolve(a.body)}
          </p>
        )}

        {/* Poll */}
        {a.kind === "poll" && a.poll && (
          <div className="mt-4 space-y-2">
            <div
              className="text-xs font-bold uppercase opacity-70"
              style={{ color: "var(--primary)" }}
            >
              {resolve(a.poll.question)}
            </div>
            {(() => {
              const total = a.poll.options.reduce((s, o) => s + (o.votes || 0), 0);
              return a.poll.options.map((opt, i) => {
                const pct = total > 0 ? Math.round(((opt.votes || 0) / total) * 100) : 0;
                const voted = votedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (votedId) return;
                      setVotedId(opt.id);
                      onVote(i);
                    }}
                    disabled={!!votedId}
                    className="w-full text-start relative overflow-hidden rounded-md border py-2 px-3 transition-all"
                    style={{
                      borderColor: voted ? "var(--primary)" : "var(--outline-variant)",
                      background: "var(--surface-container-high)",
                      color: "var(--on-surface)",
                      cursor: votedId ? "default" : "pointer",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        insetInlineStart: 0,
                        top: 0,
                        bottom: 0,
                        width: `${pct}%`,
                        background: "rgba(33,241,168,0.15)",
                        transition: "width 0.4s ease",
                      }}
                    />
                    <div className="relative flex justify-between items-center text-sm">
                      <span>{resolve(opt.label)}</span>
                      <span className="font-mono text-xs opacity-70">
                        {pct}% · {opt.votes}
                      </span>
                    </div>
                  </button>
                );
              });
            })()}
            <div
              className="text-[10px] mt-2 opacity-60"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {votedId
                ? language === "fa"
                  ? "✓ رای شما ثبت شد"
                  : "✓ Your vote counted"
                : language === "fa"
                ? "برای رای دادن روی گزینه کلیک کنید"
                : "Click an option to vote"}
            </div>
          </div>
        )}

        {/* Map */}
        {a.kind === "map" && a.map && (
          <div
            className="mt-4 rounded-lg overflow-hidden border"
            style={{ borderColor: "var(--outline-variant)" }}
          >
            <iframe
              title="map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${a.map.lng - 0.02},${a.map.lat - 0.02},${a.map.lng + 0.02},${a.map.lat + 0.02}&layer=mapnik&marker=${a.map.lat},${a.map.lng}`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
            />
            {a.map.label && (
              <div
                className="p-2 text-xs text-center"
                style={{
                  background: "var(--surface-container-high)",
                  color: "var(--on-surface-variant)",
                }}
              >
                📍 {resolve(a.map.label)}
              </div>
            )}
          </div>
        )}

        {a.href && (
          <div className="mt-4">
            <a
              href={a.href}
              target={a.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
              style={{
                background: "var(--primary)",
                color: "var(--on-primary)",
              }}
            >
              {a.hrefLabel ? resolve(a.hrefLabel) : language === "fa" ? "مشاهده" : "View"}
              <Icon name="arrow_outward" size={14} />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

function MiniIconBtn({
  icon,
  title,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-md grid place-items-center transition-all"
      style={{
        background: active ? "var(--primary)" : "var(--surface-container-high)",
        color: active ? "var(--on-primary)" : "var(--on-surface-variant)",
        border: "1px solid var(--outline-variant)",
      }}
    >
      <Icon name={icon} size={14} />
    </button>
  );
}
