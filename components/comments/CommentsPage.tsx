"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import { fetchComments, submitComment } from "@/lib/cms/api";
import type { Comment } from "@/lib/cms/schema";

export default function CommentsPage() {
  const { language } = useApp();
  const { state } = useCms();
  const [remote, setRemote] = useState<Comment[] | null>(null);

  // On mount, try to fetch approved comments from the server
  useEffect(() => {
    fetchComments().then((list) => {
      if (list) setRemote(list as Comment[]);
    });
  }, []);

  // Prefer server list; fall back to CMS state (which admin has curated)
  const list = (remote ?? state.comments).filter((c) => c.approved);

  // Pinned first, then newest
  const sorted = [...list].sort((a, b) => {
    if ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) !== 0)
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    return new Date(b.at).getTime() - new Date(a.at).getTime();
  });

  return (
    <>
      <TopNav />
      <main className="relative z-10 pt-24 pb-16 px-4 md:px-6 max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{
              background: "rgba(33,241,168,0.1)",
              border: "1px solid rgba(33,241,168,0.25)",
              color: "var(--primary)",
            }}
          >
            <Icon name="message" size={14} />
            {t2(language, "نظرات کاربران", "User Reviews")}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: "var(--on-surface)" }}
          >
            {t2(language, "نظرات و تجربیات", "Testimonials")}
          </h1>
          <p
            className="opacity-70 text-sm max-w-xl mx-auto"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {t2(
              language,
              "نظرات کسانی که با من همکاری کرده‌اند یا از خدمات من استفاده کرده‌اند.",
              "What people who worked with me or used my services have to say."
            )}
          </p>
        </header>

        {sorted.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-xl opacity-70">
            <Icon name="message" size={40} />
            <p className="mt-3">
              {t2(language, "هنوز نظری ثبت نشده", "No reviews yet")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {sorted.map((c) => (
              <CommentCard key={c.id} c={c} />
            ))}
          </div>
        )}

        <SubmitForm />
      </main>
      <Footer />
    </>
  );
}

function t2(lang: "fa" | "en", fa: string, en: string) {
  return lang === "fa" ? fa : en;
}

function CommentCard({ c }: { c: Comment }) {
  return (
    <article
      className="glass-panel rounded-xl p-5"
      style={{
        background: "var(--surface-container-solid)",
        borderTop: c.pinned ? "3px solid var(--primary)" : undefined,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full grid place-items-center font-bold shrink-0"
          style={{
            background: "var(--primary)",
            color: "var(--on-primary)",
          }}
        >
          {c.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.avatar}
              alt={c.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            c.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold" style={{ color: "var(--on-surface)" }}>
              {c.name}
            </span>
            {c.pinned && <span style={{ color: "var(--primary)" }}>★</span>}
          </div>
          {c.role && (
            <div
              className="text-[11px] opacity-70"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {c.role}
            </div>
          )}
          {c.rating && (
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < c.rating! ? "#ffb400" : "var(--outline-variant)",
                    fontSize: 14,
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
        <div
          className="text-[10px] opacity-60 shrink-0"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {new Date(c.at).toLocaleDateString()}
        </div>
      </div>
      <p
        className="text-sm leading-relaxed whitespace-pre-wrap"
        style={{ color: "var(--on-surface)" }}
      >
        {c.message}
      </p>
      {c.reply && (
        <div
          className="mt-3 pt-3 ps-3 border-t"
          style={{
            borderColor: "var(--outline-variant)",
            borderInlineStart: "2px solid var(--primary)",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest opacity-70 mb-1"
            style={{ color: "var(--primary)" }}
          >
            Reply from admin
          </div>
          <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
            {c.reply}
          </p>
        </div>
      )}
    </article>
  );
}

function SubmitForm() {
  const { language } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setBusy(true);
    const res = await submitComment({ name, email, role, rating, message });
    setBusy(false);
    if (res.ok) {
      setSent(true);
      setName(""); setEmail(""); setRole(""); setMessage(""); setRating(5);
      setTimeout(() => setSent(false), 4000);
    }
  }

  return (
    <section
      className="glass-panel rounded-xl p-6 md:p-8"
      style={{ background: "var(--surface-container-solid)" }}
    >
      <h2
        className="text-xl font-bold mb-1"
        style={{ color: "var(--on-surface)" }}
      >
        {t2(language, "نظرت را برام بنویس", "Leave a review")}
      </h2>
      <p
        className="text-xs opacity-70 mb-5"
        style={{ color: "var(--on-surface-variant)" }}
      >
        {t2(
          language,
          "نظر شما بعد از تأیید من نمایش داده می‌شود.",
          "Your review will appear here after I approve it."
        )}
      </p>

      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            value={name}
            onChange={setName}
            placeholder={t2(language, "نام شما *", "Your name *")}
            required
          />
          <Input
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            type="email"
            dir="ltr"
          />
        </div>
        <Input
          value={role}
          onChange={setRole}
          placeholder={t2(
            language,
            "شغل / سمت (اختیاری)",
            "Role / Position (optional)"
          )}
        />

        <div>
          <div
            className="text-[10px] uppercase mb-1 opacity-70"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {t2(language, "امتیاز", "Rating")}
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className="text-2xl transition-transform hover:scale-110"
                style={{
                  color: n <= rating ? "#ffb400" : "var(--outline-variant)",
                  cursor: "pointer",
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          placeholder={t2(language, "نظر شما... *", "Your review... *")}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
          style={{
            background: "rgba(0,0,0,0.25)",
            border: "1px solid var(--outline-variant)",
            color: "var(--on-surface)",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={busy || sent}
            className="px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-70"
            style={{
              background: sent ? "#00e29c" : "var(--primary)",
              color: "var(--on-primary)",
            }}
          >
            <Icon name={sent ? "check_circle" : "send"} size={14} />
            {sent
              ? t2(language, "ارسال شد! منتظر تأیید ✓", "Sent! Awaiting approval ✓")
              : busy
              ? t2(language, "در حال ارسال...", "Sending...")
              : t2(language, "ثبت نظر", "Submit review")}
          </button>
        </div>
      </form>
    </section>
  );
}

function Input({
  value,
  onChange,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
      style={{
        background: "rgba(0,0,0,0.25)",
        border: "1px solid var(--outline-variant)",
        color: "var(--on-surface)",
      }}
      {...rest}
    />
  );
}
