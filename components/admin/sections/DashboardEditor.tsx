"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, ListShell, Section } from "../common";
import type { DashboardProject, DashboardStat } from "@/lib/cms/schema";

export default function DashboardEditor() {
  const { state, update, addToList } = useCms();
  const d = state.dashboard;

  return (
    <Section title="Landing Page" desc="Edit the main dashboard content (Glass Workspace).">
      <Card title="Hero">
        <div className="space-y-4">
          <I18nRow label="Tag (small pill)" value={d.heroTag.value} onChange={(v) => update("dashboard.heroTag.value", v)} />
          <I18nRow label="Title (line 1)" value={d.heroTitleA.value} onChange={(v) => update("dashboard.heroTitleA.value", v)} />
          <I18nRow label="Title (line 2 — accented)" value={d.heroTitleB.value} onChange={(v) => update("dashboard.heroTitleB.value", v)} />
          <I18nRow label="Description" value={d.heroDescription.value} onChange={(v) => update("dashboard.heroDescription.value", v)} multiline />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <I18nRow label="Primary CTA" value={d.ctaPrimary.value} onChange={(v) => update("dashboard.ctaPrimary.value", v)} />
            <I18nRow label="Secondary CTA" value={d.ctaSecondary.value} onChange={(v) => update("dashboard.ctaSecondary.value", v)} />
          </div>
        </div>
      </Card>

      <Card title={`Feature cards (${d.projects.length})`}>
        <ListShell
          items={d.projects}
          path="dashboard.projects"
          gridCols={2}
          addLabel="Add feature card"
          onAdd={() =>
            addToList<DashboardProject>("dashboard.projects", {
              id: `dp-${Date.now()}`,
              title: { fa: "پروژه جدید", en: "New Project" },
              description: { fa: "توضیحات...", en: "Description..." },
              tags: ["TAG"],
              icon: "dataset",
              category: { fa: "دسته", en: "Category" },
            })
          }
          render={(p, i) => (
            <div className="space-y-3">
              <I18nRow label="Title" value={p.title} onChange={(v) => update(`dashboard.projects.${i}.title`, v)} />
              <I18nRow label="Description" value={p.description} onChange={(v) => update(`dashboard.projects.${i}.description`, v)} multiline />
              <I18nRow label="Category" value={p.category} onChange={(v) => update(`dashboard.projects.${i}.category`, v)} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Icon (material symbol)</Label>
                  <Input value={p.icon} onChange={(e) => update(`dashboard.projects.${i}.icon`, e.target.value)} />
                </div>
                <div>
                  <Label>Tags (comma sep)</Label>
                  <Input
                    dir="ltr"
                    value={p.tags.join(", ")}
                    onChange={(e) =>
                      update(
                        `dashboard.projects.${i}.tags`,
                        e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        />
      </Card>

      <Card title={`Stats bar (${d.stats.length})`}>
        <ListShell
          items={d.stats}
          path="dashboard.stats"
          gridCols={2}
          addLabel="Add stat"
          onAdd={() =>
            addToList<DashboardStat>("dashboard.stats", {
              id: `st-${Date.now()}`,
              value: "100+",
              label: { fa: "معیار", en: "Metric" },
            })
          }
          render={(s, i) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Value</Label>
                  <Input value={s.value} onChange={(e) => update(`dashboard.stats.${i}.value`, e.target.value)} />
                </div>
                <div>
                  <Label>Highlight (green)</Label>
                  <label className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      checked={!!s.highlight}
                      onChange={(e) => update(`dashboard.stats.${i}.highlight`, e.target.checked)}
                    />
                    <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
                      Use accent color
                    </span>
                  </label>
                </div>
              </div>
              <I18nRow label="Label" value={s.label} onChange={(v) => update(`dashboard.stats.${i}.label`, v)} />
            </div>
          )}
        />
      </Card>
    </Section>
  );
}
