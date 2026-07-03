"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { submitContactMessage } from "@/lib/cms/api";
import { useCms } from "@/contexts/CmsContext";
import Icon from "@/components/ui/Icon";

/**
 * Compact inline contact form used at the bottom of the terminal.
 * Posts to /api/messages when available; otherwise queues in localStorage.
 */
export default function ContactForm() {
  const { language } = useApp();
  const { update, state } = useCms();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setBusy(true);

    const payload = { name, email, subject, message };
    const res = await submitContactMessage(payload);

    if (!res.ok) {
      // Fallback → localStorage; the admin panel will import it later
      try {
        const record = {
          id: `msg-${Date.now()}`,
          ...payload,
          at: new Date().toISOString(),
          read: false,
        };
        const raw = localStorage.getItem("avidkiya:messages");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(record);
        localStorage.setItem("avidkiya:messages", JSON.stringify(list));

        // Also add to current in-memory state
        update("messages", [record, ...state.messages]);
      } catch {}
    }

    setSent(true);
    setBusy(false);
    setTimeout(() => {
      setSent(false);
      setName(""); setEmail(""); setSubject(""); setMessage("");
    }, 2500);
  }

  const l = (fa: string, en: string) => (language === "fa" ? fa : en);

  return (
    <form
      onSubmit={submit}
      className="border rounded p-4"
      style={{
        borderColor: "var(--outline-variant)",
        background: "rgba(25,34,28,0.3)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        className="text-xs font-bold mb-3 flex items-center gap-2 pb-2 border-b"
        style={{ color: "var(--primary)", borderColor: "var(--outline-variant)" }}
      >
        <Icon name="mail" size={16} />
        {l("ارسال پیام مستقیم", "Send a direct message")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={l("نام", "Name")}
          className="cf-input"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          dir="ltr"
          placeholder="you@example.com"
          className="cf-input"
        />
      </div>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder={l("موضوع (اختیاری)", "Subject (optional)")}
        className="cf-input mb-2"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        placeholder={l("پیام...", "Message...")}
        className="cf-input mb-3 resize-y"
      />

      <button
        type="submit"
        disabled={busy}
        className="w-full py-2 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        style={{
          background: sent ? "var(--primary-fixed)" : "var(--primary)",
          color: "var(--on-primary)",
        }}
      >
        <Icon name={busy ? "sync" : sent ? "check_circle" : "send"} size={14} />
        {sent ? l("پیام ارسال شد ✓", "Message sent ✓") : l("ارسال پیام", "Send message")}
      </button>

      <style jsx>{`
        .cf-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--outline-variant);
          border-radius: 4px;
          padding: 8px 10px;
          font-size: 12px;
          color: var(--on-surface);
          font-family: inherit;
          outline: none;
        }
        .cf-input:focus {
          border-color: var(--primary);
        }
      `}</style>
    </form>
  );
}
