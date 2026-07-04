"use client";

import React, { useState } from "react";
import RootPageLayout from "@/components/layout/RootPageLayout";
import { useCms } from "@/contexts/CmsContext";
import { Icon } from "@/components/ui/Icons";

export default function AnnouncementsPage() {
  const { t, state, resolve, locale } = useCms();
  const [activeTab, setActiveTab] = useState<"active" | "archive" | "all">("active");

  const now = new Date();
  const filtered = state.announcements.filter((a) => {
    if (a.hidden) return false;
    const isArchived = a.archived || (a.expiresAt && new Date(a.expiresAt) < now);
    if (activeTab === "active") return !isArchived;
    if (activeTab === "archive") return isArchived;
    return true;
  });

  const pinned = filtered.filter((a) => a.pinned);
  const regular = filtered.filter((a) => !a.pinned);
  const sorted = [...pinned, ...regular];

  return (
    <RootPageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="text-3xl font-black gradient-text">{t("announcements", "title")}</h1>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          {(["active", "archive", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                activeTab === tab
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]"
              }`}
            >
              {t("announcements", tab)}
            </button>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="glass p-12 text-center text-[var(--color-text-subtle)]">
            <Icon name="Inbox" size={32} className="mx-auto mb-3 opacity-30" />
            {locale === "fa" ? "اعلانی وجود ندارد" : "No announcements"}
          </div>
        )}

        {sorted.map((ann) => (
          <article key={ann.id} className={`glass p-6 ${ann.pinned ? "border-[var(--color-amber)]/30" : ""}`}>
            {ann.pinned && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold mb-3">
                <Icon name="Pin" size={10} />
                {t("announcements", "pinned")}
              </div>
            )}
            <h2 className="text-lg font-bold mb-2">{resolve(ann.title)}</h2>
            {ann.type === "text" || ann.type === "news" ? (
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">{resolve(ann.content)}</p>
            ) : ann.type === "poll" ? (
              <div className="space-y-2 mt-3">
                {ann.pollOptions?.map((opt) => {
                  const total = ann.pollOptions!.reduce((sum, o) => sum + o.votes, 0) || 1;
                  const pct = Math.round((opt.votes / total) * 100);
                  return (
                    <div key={opt.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{resolve(opt.label)}</span>
                        <span className="text-[var(--color-text-subtle)]">{opt.votes} رای ({pct}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : ann.type === "image" && ann.image ? (
              <img src={ann.image} alt={resolve(ann.title)} className="w-full rounded-xl mt-3" />
            ) : ann.type === "map" && ann.mapCenter ? (
              <div className="mt-3 rounded-xl overflow-hidden h-64">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${ann.mapCenter.lng - 0.05}%2C${ann.mapCenter.lat - 0.03}%2C${ann.mapCenter.lng + 0.05}%2C${ann.mapCenter.lat + 0.03}&layer=mapnik`}
                />
              </div>
            ) : null}
            <div className="text-xs text-[var(--color-text-subtle)] mt-3">
              {new Date(ann.createdAt).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}
            </div>
          </article>
        ))}
      </div>
    </RootPageLayout>
  );
}
