"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, ListShell, Section } from "../common";
import type {
  ActivityLog,
  MiniProject,
  QuickLink,
  SystemMetric,
} from "@/lib/cms/schema";

export default function AboutEditor() {
  const { state, update, addToList } = useCms();
  const a = state.about;

  return (
    <Section title="About Page" desc="Edit the Command Center content.">
      <Card title="Header">
        <div className="space-y-3">
          <I18nRow label="Version tag" value={a.version.value} onChange={(v) => update("about.version.value", v)} />
          <I18nRow label="Location value" value={a.locationValue.value} onChange={(v) => update("about.locationValue.value", v)} />
          <I18nRow label="Terminal header" value={a.terminalHeader.value} onChange={(v) => update("about.terminalHeader.value", v)} />
        </div>
      </Card>

      <Card title={`System metrics (${a.metrics.length})`}>
        <ListShell
          items={a.metrics}
          path="about.metrics"
          addLabel="Add metric"
          gridCols={1}
          onAdd={() =>
            addToList<SystemMetric>("about.metrics", {
              id: `metric-${Date.now()}`,
              label: { fa: "معیار جدید", en: "New Metric" },
              percent: 50,
              valueFa: "۵۰٪",
              valueEn: "50%",
            })
          }
          render={(m, i) => (
            <div className="space-y-3">
              <I18nRow label="Label" value={m.label} onChange={(v) => update(`about.metrics.${i}.label`, v)} />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Percent (0–100)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={m.percent}
                    onChange={(e) => update(`about.metrics.${i}.percent`, parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Value (fa)</Label>
                  <Input dir="rtl" value={m.valueFa} onChange={(e) => update(`about.metrics.${i}.valueFa`, e.target.value)} />
                </div>
                <div>
                  <Label>Value (en)</Label>
                  <Input dir="ltr" value={m.valueEn} onChange={(e) => update(`about.metrics.${i}.valueEn`, e.target.value)} />
                </div>
              </div>
            </div>
          )}
        />
      </Card>

      <Card title={`Quick links (${a.quickLinks.length})`}>
        <ListShell
          items={a.quickLinks}
          path="about.quickLinks"
          addLabel="Add quick link"
          gridCols={1}
          onAdd={() =>
            addToList<QuickLink>("about.quickLinks", {
              id: `qlink-${Date.now()}`,
              label: { fa: "لینک جدید", en: "New Link" },
              href: "#",
              icon: "link",
            })
          }
          render={(q, i) => (
            <div className="space-y-3">
              <I18nRow label="Label" value={q.label} onChange={(v) => update(`about.quickLinks.${i}.label`, v)} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>URL</Label>
                  <Input dir="ltr" value={q.href} onChange={(e) => update(`about.quickLinks.${i}.href`, e.target.value)} />
                </div>
                <div>
                  <Label>Icon (material symbol)</Label>
                  <Input value={q.icon} onChange={(e) => update(`about.quickLinks.${i}.icon`, e.target.value)} />
                </div>
              </div>
            </div>
          )}
        />
      </Card>

      <Card title="Welcome section">
        <div className="space-y-3">
          <I18nRow label="Welcome title" value={a.welcomeTitle.value} onChange={(v) => update("about.welcomeTitle.value", v)} />
          <I18nRow label="Welcome body" value={a.welcomeBody.value} onChange={(v) => update("about.welcomeBody.value", v)} multiline />
          <I18nRow label="Prompt (last line)" value={a.promptText.value} onChange={(v) => update("about.promptText.value", v)} />
          <I18nRow label="Motivational quote" value={a.quote.value} onChange={(v) => update("about.quote.value", v)} multiline />
        </div>
      </Card>

      <Card title={`Mini projects (${a.miniProjects.length})`}>
        <ListShell
          items={a.miniProjects}
          path="about.miniProjects"
          addLabel="Add mini project"
          gridCols={2}
          onAdd={() =>
            addToList<MiniProject>("about.miniProjects", {
              id: `mini-${Date.now()}`,
              name: { fa: "پروژه جدید", en: "New Project" },
              desc: { fa: "توضیحات...", en: "Description..." },
              status: "STABLE",
              cta: { fa: "[ مشاهده ]", en: "[ VIEW ]" },
              href: "#",
            })
          }
          render={(m, i) => (
            <div className="space-y-3">
              <I18nRow label="Name" value={m.name} onChange={(v) => update(`about.miniProjects.${i}.name`, v)} />
              <I18nRow label="Description" value={m.desc} onChange={(v) => update(`about.miniProjects.${i}.desc`, v)} multiline />
              <I18nRow label="CTA text" value={m.cta} onChange={(v) => update(`about.miniProjects.${i}.cta`, v)} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <select
                    value={m.status}
                    onChange={(e) => update(`about.miniProjects.${i}.status`, e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="STABLE">STABLE</option>
                    <option value="BETA">BETA</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
                <div>
                  <Label>URL</Label>
                  <Input dir="ltr" value={m.href} onChange={(e) => update(`about.miniProjects.${i}.href`, e.target.value)} />
                </div>
              </div>
            </div>
          )}
        />
      </Card>

      <Card title={`Recent activity log (${a.recentActivity.length})`}>
        <ListShell
          items={a.recentActivity}
          path="about.recentActivity"
          addLabel="Add activity"
          gridCols={1}
          onAdd={() =>
            addToList<ActivityLog>("about.recentActivity", {
              id: `act-${Date.now()}`,
              when: { fa: "امروز", en: "Today" },
              what: { fa: "فعالیت جدید", en: "New activity" },
            })
          }
          render={(it, i) => (
            <div className="space-y-3">
              <I18nRow label="When" value={it.when} onChange={(v) => update(`about.recentActivity.${i}.when`, v)} />
              <I18nRow label="What" value={it.what} onChange={(v) => update(`about.recentActivity.${i}.what`, v)} />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!it.active}
                  onChange={(e) => update(`about.recentActivity.${i}.active`, e.target.checked)}
                />
                <span className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                  Highlight (green glowing dot)
                </span>
              </label>
            </div>
          )}
        />
      </Card>
    </Section>
  );
}
