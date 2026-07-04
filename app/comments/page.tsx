"use client";

import React, { useState } from "react";
import RootPageLayout from "@/components/layout/RootPageLayout";
import { useCms } from "@/contexts/CmsContext";
import { Icon } from "@/components/ui/Icons";

export default function CommentsPage() {
  const { t, state, resolve, locale } = useCms();
  const [form, setForm] = useState({ name: "", email: "", position: "", rating: 5, text: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const approved = state.comments.filter((c) => c.approved).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("sent");
      setForm({ name: "", email: "", position: "", rating: 5, text: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("idle");
    }
  };

  const Stars = ({ count, interactive = false, onChange }: { count: number; interactive?: boolean; onChange?: (n: number) => void }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onChange?.(n)}
          className={`${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"} transition`}
          disabled={!interactive}
        >
          <Icon name="Star" size={18} className={n <= count ? "text-amber-400 fill-amber-400" : "text-[var(--color-text-subtle)]"} />
        </button>
      ))}
    </div>
  );

  return (
    <RootPageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <h1 className="text-3xl font-black gradient-text">{t("comments", "title")}</h1>

        {/* Write Comment */}
        <div className="glass p-6 space-y-4">
          <h2 className="font-bold text-lg">{t("comments", "writeComment")}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("comments", "name")}
                required
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t("comments", "email")}
                type="email"
                required
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
            </div>
            <input
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder={t("comments", "position")}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">{t("comments", "rating")}:</span>
              <Stars count={form.rating} interactive onChange={(n) => setForm({ ...form, rating: n })} />
            </div>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder={t("comments", "text")}
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm resize-none"
            />
            <button
              type="submit"
              disabled={status !== "idle"}
              className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:brightness-110 transition disabled:opacity-50"
            >
              {status === "sent" ? "✓ " + t("common", "success") : t("comments", "submit")}
            </button>
          </form>
          <p className="text-xs text-[var(--color-text-subtle)]">{t("comments", "pending")}</p>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {approved.map((comment) => (
            <div key={comment.id} className={`glass p-6 ${comment.pinned ? "border-[var(--color-amber)]/30" : ""}`}>
              {comment.pinned && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold mb-3">
                  <Icon name="Pin" size={10} />
                  {t("announcements", "pinned")}
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold shrink-0">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{comment.name}</span>
                    {comment.position && <span className="text-xs text-[var(--color-text-subtle)]">({comment.position})</span>}
                    <Stars count={comment.rating} />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">{comment.text}</p>
                  <div className="text-[10px] text-[var(--color-text-subtle)] mt-2">
                    {new Date(comment.createdAt).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RootPageLayout>
  );
}
