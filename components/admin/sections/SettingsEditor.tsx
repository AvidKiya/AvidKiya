"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, Input, Label, Section } from "../common";

export default function SettingsEditor() {
  const { state, update } = useCms();
  const s = state.settings;

  return (
    <Section title="Settings" desc="Global site behavior.">
      <Card title="GitHub integration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>GitHub username</Label>
            <Input
              dir="ltr"
              value={s.githubUsername}
              onChange={(e) => update("settings.githubUsername", e.target.value)}
              placeholder="avidkiya"
            />
            <p className="text-[11px] opacity-60 mt-1" style={{ color: "var(--on-surface-variant)" }}>
              Repositories are fetched live from{" "}
              <code>api.github.com/users/{s.githubUsername}/repos</code>
            </p>
          </div>
          <div>
            <Label>API token (optional)</Label>
            <Input
              dir="ltr"
              placeholder="Set NEXT_PUBLIC_GITHUB_TOKEN in Cloudflare env"
              disabled
            />
            <p className="text-[11px] opacity-60 mt-1" style={{ color: "var(--on-surface-variant)" }}>
              Set via <code>NEXT_PUBLIC_GITHUB_TOKEN</code> to raise the rate limit.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Defaults for new visitors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Default language</Label>
            <div className="flex gap-2">
              {(["fa", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => update("settings.defaultLanguage", l)}
                  className="flex-1 py-2 rounded border text-sm font-bold"
                  style={{
                    background: s.defaultLanguage === l ? "var(--primary)" : "transparent",
                    color: s.defaultLanguage === l ? "var(--on-primary)" : "var(--on-surface)",
                    borderColor: s.defaultLanguage === l ? "var(--primary)" : "var(--outline-variant)",
                  }}
                >
                  {l === "fa" ? "فارسی" : "English"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Default theme</Label>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => update("settings.defaultTheme", th)}
                  className="flex-1 py-2 rounded border text-sm font-bold"
                  style={{
                    background: s.defaultTheme === th ? "var(--primary)" : "transparent",
                    color: s.defaultTheme === th ? "var(--on-primary)" : "var(--on-surface)",
                    borderColor: s.defaultTheme === th ? "var(--primary)" : "var(--outline-variant)",
                  }}
                >
                  <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: 14 }}>
                    {th === "dark" ? "dark_mode" : "light_mode"}
                  </span>
                  {th === "dark" ? "Dark" : "Light"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Admin credentials">
        <p className="text-xs opacity-70 mb-3" style={{ color: "var(--on-surface-variant)" }}>
          The default password lives in <code>contexts/CmsContext.tsx</code> (constant{" "}
          <code>DEFAULT_PASSWORD</code>). When deployed to Cloudflare Pages, protect this route
          with <b>Cloudflare Access</b> instead of a hardcoded password.
        </p>
        <div
          className="rounded-md p-3 font-mono text-xs"
          style={{ background: "rgba(0,0,0,0.3)", color: "var(--on-surface-variant)" }}
        >
          const DEFAULT_PASSWORD = "avidkiya-2026";
        </div>
      </Card>
    </Section>
  );
}
