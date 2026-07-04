"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCms } from "@/contexts/CmsContext";

export default function AdminLoginPage() {
  const { login, isAdmin } = useCms();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [diagnostics, setDiagnostics] = useState<{ api: boolean; token: boolean; kv: boolean } | null>(null);

  // Auto-redirect if already logged in
  if (isAdmin) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      router.push("/admin");
    } else {
      setError("رمز عبور اشتباه است");
      setPassword("");
    }
  };

  const runDiagnostics = async () => {
    const result = { api: false, token: false, kv: false };
    try {
      const r = await fetch("/api/cms");
      result.api = r.ok;
    } catch {}
    try {
      const r = await fetch("/api/verify");
      if (r.ok) {
        const d = await r.json();
        result.token = d.tokenSet;
        result.kv = d.kvBound;
      }
    } catch {}
    setDiagnostics(result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex w-16 h-16 items-center justify-center bg-[#5d7ae6]/20 rounded-2xl mb-4">
            <span className="text-2xl font-black gradient-text">🔐</span>
          </div>
          <h1 className="text-2xl font-black">ورود به پنل مدیریت</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">AvidKiya OS Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="رمز عبور"
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-center font-mono text-lg tracking-wider"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-110 transition"
          >
            ورود
          </button>
        </form>

        <button
          onClick={runDiagnostics}
          className="w-full py-2 rounded-xl border border-[var(--color-bg-alt)] text-[var(--color-text-muted)] text-sm hover:bg-[var(--color-bg-alt)] transition"
        >
          بررسی وضعیت سیستم
        </button>

        {diagnostics && (
          <div className="space-y-2 text-sm">
            <div className={`flex items-center gap-2 ${diagnostics.api ? "text-emerald-500" : "text-red-400"}`}>
              {diagnostics.api ? "✅" : "❌"} API reachable
            </div>
            <div className={`flex items-center gap-2 ${diagnostics.token ? "text-emerald-500" : "text-red-400"}`}>
              {diagnostics.token ? "✅" : "❌"} TOKEN set
            </div>
            <div className={`flex items-center gap-2 ${diagnostics.kv ? "text-emerald-500" : "text-red-400"}`}>
              {diagnostics.kv ? "✅" : "❌"} KV bound
            </div>
          </div>
        )}

        <p className="text-xs text-[var(--color-text-subtle)] text-center">
          رمز پیش‌فرض: <code className="bg-[var(--color-bg-alt)] px-2 py-0.5 rounded">admin</code>
        </p>
      </div>
    </div>
  );
}
