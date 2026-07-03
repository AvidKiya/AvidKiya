"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import Icon from "./Icon";
import Editable from "@/components/cms/Editable";

/**
 * Newsletter signup card — renders only if enabled from admin.
 */
export default function Newsletter() {
  const { language } = useApp();
  const { state } = useCms();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!state.newsletter.enabled) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({
          ok: true,
          text: data.alreadySubscribed
            ? language === "fa"
              ? "قبلاً عضو شده‌اید ✓"
              : "Already subscribed ✓"
            : language === "fa"
            ? "عضویت شما ثبت شد ✓"
            : "Subscribed ✓",
        });
        setEmail("");
      } else {
        setMsg({
          ok: false,
          text: data.error || (language === "fa" ? "خطا" : "Error"),
        });
      }
    } catch {
      setMsg({ ok: false, text: language === "fa" ? "خطای شبکه" : "Network error" });
    }
    setBusy(false);
  }

  return (
    <section
      className="rounded-xl p-6 md:p-8 relative overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--outline-variant)",
        boxShadow: "var(--glass-shadow)",
      }}
    >
      <div
        className="absolute -top-16 -end-16 w-48 h-48 rounded-full opacity-10 blur-2xl"
        style={{ background: "var(--primary)" }}
      />
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="mail" size={18} color="var(--primary)" />
            <Editable
              path="newsletter.title"
              raw={state.newsletter.title}
              as="h3"
              className="text-lg md:text-xl font-bold"
              style={{ color: "var(--on-surface)" }}
            />
          </div>
          <Editable
            path="newsletter.subtitle"
            raw={state.newsletter.subtitle}
            as="p"
            className="text-sm opacity-80"
            style={{ color: "var(--on-surface-variant)" }}
          />
        </div>
        <form onSubmit={submit} className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            dir="ltr"
            className="rounded-lg px-3 py-2 text-sm outline-none w-full md:w-64"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--outline-variant)",
              color: "var(--on-surface)",
            }}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-1.5 disabled:opacity-60"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <Icon name={busy ? "sync" : "send"} size={14} />
            {language === "fa" ? "عضویت" : "Subscribe"}
          </button>
        </form>
      </div>
      {msg && (
        <div
          className="mt-3 text-xs"
          style={{ color: msg.ok ? "var(--primary)" : "#e05555" }}
        >
          {msg.text}
        </div>
      )}
    </section>
  );
}
