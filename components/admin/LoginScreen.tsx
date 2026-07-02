"use client";

import Link from "next/link";
import { useState } from "react";
import { useCms } from "@/contexts/CmsContext";

export default function LoginScreen() {
  const { login } = useCms();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw) return;
    setBusy(true);
    const ok = await login(pw);
    setBusy(false);
    if (!ok) {
      setErr(true);
      setTimeout(() => setErr(false), 1500);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, #152018 0%, #08100b 100%)",
      }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-md glass-panel rounded-xl p-8"
        style={{ background: "rgba(13,21,16,0.85)" }}
      >
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-xl grid place-items-center font-bold text-2xl mx-auto mb-4"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            A
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--on-surface)" }}>
            Admin Panel
          </h1>
          <p
            className="text-xs opacity-70 mt-1"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Enter your admin token to manage the portfolio
          </p>
        </div>

        <label className="block">
          <span
            className="block text-[10px] font-bold mb-1.5 uppercase tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            Admin token
          </span>
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-md px-4 py-3 outline-none transition-all"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${err ? "#ffb4ab" : "var(--outline-variant)"}`,
              color: "var(--on-surface)",
              boxShadow: err ? "0 0 0 3px rgba(255,180,171,0.2)" : undefined,
              fontFamily: "monospace",
            }}
            placeholder="paste your ADMIN_TOKEN"
          />
          {err && (
            <div className="text-xs mt-2" style={{ color: "#ffb4ab" }}>
              Wrong token — check the value in Cloudflare Pages settings.
            </div>
          )}
        </label>

        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full py-3 rounded-md font-bold text-sm disabled:opacity-60"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          <span
            className="material-symbols-outlined align-middle me-2"
            style={{ fontSize: 16 }}
          >
            {busy ? "sync" : "lock_open"}
          </span>
          {busy ? "Verifying..." : "Enter"}
        </button>

        <div
          className="mt-6 pt-4 border-t"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <div
            className="text-[10px] uppercase tracking-widest opacity-50 mb-2"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Where does this token come from?
          </div>
          <p
            className="text-xs leading-relaxed opacity-80"
            style={{ color: "var(--on-surface-variant)" }}
          >
            In Cloudflare Pages → your project → <b>Settings → Environment
            variables → Production</b>, add a secret named{" "}
            <code
              className="px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,0,0,0.3)", color: "var(--primary)" }}
            >
              ADMIN_TOKEN
            </code>
            . Use its value here to unlock live editing on the deployed site.
          </p>
          <p
            className="text-[11px] opacity-60 mt-3"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Local dev / no KV configured? The temporary password{" "}
            <code
              className="px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,0,0,0.3)", color: "var(--primary)" }}
            >
              avidkiya-2026
            </code>{" "}
            unlocks offline (local-only) editing.
          </p>
        </div>

        <Link
          href="/"
          className="mt-4 block text-center text-xs opacity-60 hover:opacity-100"
          style={{ color: "var(--on-surface)" }}
        >
          ← Back to site
        </Link>
      </form>
    </div>
  );
}
