"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCms } from "@/contexts/CmsContext";
import { pingApi, verifyToken } from "@/lib/cms/api";
import Icon from "@/components/ui/Icon";

export default function LoginScreen() {
  const { login } = useCms();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    apiReachable: boolean;
    kvBound?: boolean;
    tokenConfigured?: boolean;
  } | null>(null);

  // Diagnose the environment on mount so we can show a helpful message
  useEffect(() => {
    pingApi().then(setStatus);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw) return;
    setBusy(true);
    setError(null);

    // Explicit verification so we can display precise errors
    if (status?.apiReachable) {
      const v = await verifyToken(pw);
      if (v.ok) {
        await login(pw);
        // login() already updated context — page will re-render
        return;
      }
      setBusy(false);
      if (!v.tokenConfigured) {
        setError(
          "The ADMIN_TOKEN environment variable is NOT set in Cloudflare Pages → Settings → Environment variables. Add it, redeploy, then try again."
        );
      } else if (!v.kvBound) {
        setError(
          "Token accepted, but the KV namespace AVIDKIYA_KV is not bound. Bind it in Pages → Settings → Functions and redeploy."
        );
      } else {
        setError("Wrong token. Check the value in your Cloudflare Pages env.");
      }
      return;
    }

    // Local / offline
    const ok = await login(pw);
    setBusy(false);
    if (!ok) {
      setError(
        "API unreachable and local dev password rejected. Use the offline password shown below."
      );
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(circle at 50% 30%, #152018 0%, #08100b 100%)" }}
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
          <p className="text-xs opacity-70 mt-1" style={{ color: "var(--on-surface-variant)" }}>
            Enter your admin token to manage the portfolio
          </p>
        </div>

        {/* Environment diagnosis */}
        {status && (
          <div
            className="rounded-md p-3 mb-4 text-[11px] space-y-1"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: `1px solid var(--outline-variant)`,
            }}
          >
            <DiagRow ok={status.apiReachable} label="API reachable" />
            {status.apiReachable && (
              <>
                <DiagRow ok={!!status.tokenConfigured} label="ADMIN_TOKEN configured" />
                <DiagRow ok={!!status.kvBound} label="KV namespace AVIDKIYA_KV bound" />
              </>
            )}
          </div>
        )}

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
            onChange={(e) => {
              setPw(e.target.value);
              setError(null);
            }}
            className="w-full rounded-md px-4 py-3 outline-none transition-all"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${error ? "#ffb4ab" : "var(--outline-variant)"}`,
              color: "var(--on-surface)",
              fontFamily: "monospace",
            }}
            placeholder="paste ADMIN_TOKEN"
          />
        </label>

        {error && (
          <div
            className="text-xs mt-3 p-3 rounded"
            style={{ background: "rgba(255,180,171,0.1)", color: "#ffb4ab" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full py-3 rounded-md font-bold text-sm disabled:opacity-60"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          <Icon name={busy ? "sync" : "lock_open"} size={16} className="align-middle me-2" />
          {busy ? "Verifying..." : "Enter"}
        </button>

        <div
          className="mt-6 pt-4 border-t"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          {status?.apiReachable === false ? (
            <>
              <div
                className="text-[10px] uppercase tracking-widest opacity-50 mb-2"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Local / offline mode
              </div>
              <p
                className="text-xs opacity-80"
                style={{ color: "var(--on-surface-variant)" }}
              >
                The Cloudflare API is not reachable (you're probably running{" "}
                <code>npm run dev</code>). Use{" "}
                <code
                  className="px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(0,0,0,0.3)", color: "var(--primary)" }}
                >
                  avidkiya-2026
                </code>{" "}
                to unlock local editing.
              </p>
            </>
          ) : (
            <>
              <div
                className="text-[10px] uppercase tracking-widest opacity-50 mb-2"
                style={{ color: "var(--on-surface-variant)" }}
              >
                How to configure
              </div>
              <p
                className="text-xs leading-relaxed opacity-80"
                style={{ color: "var(--on-surface-variant)" }}
              >
                In Cloudflare Pages → your project →{" "}
                <b>Settings → Environment variables → Production</b>, add a
                Secret named{" "}
                <code
                  className="px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(0,0,0,0.3)", color: "var(--primary)" }}
                >
                  ADMIN_TOKEN
                </code>
                . Then <b>redeploy</b> so it takes effect. Use its value here.
              </p>
            </>
          )}
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

function DiagRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={ok ? "check_circle" : "warning"} size={14} />
      <span style={{ color: "var(--on-surface-variant)" }}>{label}</span>
    </div>
  );
}
