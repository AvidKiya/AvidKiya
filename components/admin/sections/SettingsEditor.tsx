"use client";

import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import { Card, Input, Label, Section } from "../common";
import Icon from "@/components/ui/Icon";
import { changePassword } from "@/lib/cms/api";
import CloudflareSetup from "./CloudflareSetup";

export default function SettingsEditor() {
  const { state, update } = useCms();
  const { language } = useApp();
  const s = state.settings;
  const l = (fa: string, en: string) => (language === "fa" ? fa : en);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitPw(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) {
      setMsg({ ok: false, text: l("رمز جدید حداقل ۸ کاراکتر", "New password ≥ 8 chars") });
      return;
    }
    if (next !== confirm) {
      setMsg({ ok: false, text: l("رمز و تأیید یکسان نیست", "Passwords don't match") });
      return;
    }
    setBusy(true);
    const r = await changePassword(current, next);
    setBusy(false);
    if (r.ok) {
      setMsg({
        ok: true,
        text: l(
          "رمز عوض شد. با رمز جدید دوباره وارد شو.",
          "Password changed. Please log in again with the new password."
        ),
      });
      // Store new token so admin can continue
      localStorage.setItem("avidkiya:admin-token", next);
      setCurrent(""); setNext(""); setConfirm("");
    } else {
      setMsg({ ok: false, text: r.error ?? l("خطا", "Error") });
    }
  }

  return (
    <Section
      title={l("تنظیمات", "Settings")}
      desc={l("رفتار کلی سایت.", "Global site behaviour.")}
    >
      <Card title={l("اتصال گیت‌هاب", "GitHub integration")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>{l("نام کاربری گیت‌هاب", "GitHub username")}</Label>
            <Input
              dir="ltr"
              value={s.githubUsername}
              onChange={(e) => update("settings.githubUsername", e.target.value)}
              placeholder="avidkiya"
            />
            <p
              className="text-[11px] opacity-70 mt-1"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {l(
                "ریپوها از این آدرس خودکار دریافت می‌شوند:",
                "Repositories are fetched from:"
              )}{" "}
              <code>api.github.com/users/{s.githubUsername}/repos</code>
            </p>
          </div>
        </div>
      </Card>

      <Card title={l("پیش‌فرض بازدیدکنندگان", "Defaults for new visitors")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{l("زبان پیش‌فرض", "Default language")}</Label>
            <div className="flex gap-2">
              {(["fa", "en"] as const).map((lg) => (
                <button
                  key={lg}
                  onClick={() => update("settings.defaultLanguage", lg)}
                  className="flex-1 py-2 rounded border text-sm font-bold"
                  style={{
                    background: s.defaultLanguage === lg ? "var(--primary)" : "transparent",
                    color: s.defaultLanguage === lg ? "var(--on-primary)" : "var(--on-surface)",
                    borderColor: s.defaultLanguage === lg ? "var(--primary)" : "var(--outline-variant)",
                  }}
                >
                  {lg === "fa" ? "فارسی" : "English"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>{l("تم پیش‌فرض", "Default theme")}</Label>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => update("settings.defaultTheme", th)}
                  className="flex-1 py-2 rounded border text-sm font-bold flex items-center justify-center gap-1"
                  style={{
                    background: s.defaultTheme === th ? "var(--primary)" : "transparent",
                    color: s.defaultTheme === th ? "var(--on-primary)" : "var(--on-surface)",
                    borderColor: s.defaultTheme === th ? "var(--primary)" : "var(--outline-variant)",
                  }}
                >
                  <Icon name={th === "dark" ? "dark_mode" : "light_mode"} size={14} />
                  {th === "dark" ? l("شب", "Dark") : l("روز", "Light")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card title={l("تغییر رمز مدیر", "Change admin password")}>
        <form onSubmit={submitPw} className="space-y-3 max-w-md">
          <div>
            <Label>{l("رمز فعلی", "Current password")}</Label>
            <Input
              type="password"
              dir="ltr"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>{l("رمز جدید (حداقل ۸ کاراکتر)", "New password (min 8 chars)")}</Label>
            <Input
              type="password"
              dir="ltr"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div>
            <Label>{l("تکرار رمز جدید", "Confirm new password")}</Label>
            <Input
              type="password"
              dir="ltr"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {msg && (
            <div
              className="text-xs p-2 rounded"
              style={{
                background: msg.ok ? "rgba(33,241,168,0.1)" : "rgba(255,180,171,0.1)",
                color: msg.ok ? "var(--primary)" : "#ffb4ab",
              }}
            >
              {msg.ok ? "✓ " : "⚠️ "}
              {msg.text}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded text-sm font-bold flex items-center gap-2 disabled:opacity-60"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <Icon name={busy ? "sync" : "lock_open"} size={14} />
            {l("تغییر رمز", "Change password")}
          </button>
          <p className="text-[11px] opacity-70" style={{ color: "var(--on-surface-variant)" }}>
            {l(
              "رمز جدید در KV ذخیره می‌شود (نه در env). نیازی به redeploy نیست.",
              "New password is stored in KV (not env), no redeploy needed."
            )}
          </p>
        </form>
      </Card>

      <CloudflareSetup />
    </Section>
  );
}
