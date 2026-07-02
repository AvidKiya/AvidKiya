"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, ListShell, Section } from "../common";
import type { SocialAccount } from "@/lib/cms/schema";

export default function SocialsEditor() {
  const { state, update, addToList } = useCms();

  return (
    <Section title="Social Accounts" desc="These render as gradient cards on the About page.">
      <Card>
        <ListShell
          items={state.socials}
          path="socials"
          addLabel="Add social account"
          gridCols={1}
          onAdd={() =>
            addToList<SocialAccount>("socials", {
              id: `social-${Date.now()}`,
              platform: "New Platform",
              handle: "@handle",
              href: "https://",
              gradient: "linear-gradient(135deg,#333 0%,#111 100%)",
              subtitle: { fa: "توضیح کوتاه", en: "Short description" },
              icon: "email",
              enabled: true,
            })
          }
          render={(s, i) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Platform</Label>
                  <Input value={s.platform} onChange={(e) => update(`socials.${i}.platform`, e.target.value)} />
                </div>
                <div>
                  <Label>Handle</Label>
                  <Input value={s.handle} onChange={(e) => update(`socials.${i}.handle`, e.target.value)} />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input dir="ltr" value={s.href} onChange={(e) => update(`socials.${i}.href`, e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Icon</Label>
                  <select
                    value={s.icon}
                    onChange={(e) => update(`socials.${i}.icon`, e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  >
                    <option value="github">GitHub</option>
                    <option value="telegram">Telegram</option>
                    <option value="instagram">Instagram</option>
                    <option value="x">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div>
                  <Label>Enabled</Label>
                  <label className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={(e) => update(`socials.${i}.enabled`, e.target.checked)}
                    />
                    <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
                      Show on site
                    </span>
                  </label>
                </div>
                <div>
                  <Label>Preview</Label>
                  <div
                    className="h-10 rounded flex items-center px-3 text-white text-xs font-bold"
                    style={{ background: s.gradient }}
                  >
                    {s.platform}
                  </div>
                </div>
              </div>
              <div>
                <Label>Gradient (CSS)</Label>
                <Input
                  dir="ltr"
                  value={s.gradient}
                  onChange={(e) => update(`socials.${i}.gradient`, e.target.value)}
                />
              </div>
              <I18nRow
                label="Subtitle"
                value={s.subtitle}
                onChange={(v) => update(`socials.${i}.subtitle`, v)}
              />
            </div>
          )}
        />
      </Card>
    </Section>
  );
}
