"use client";

import { useCms } from "@/contexts/CmsContext";
import Editable from "@/components/cms/Editable";
import { AddButton, ListItem } from "@/components/cms/EditableList";
import type { DashboardStat } from "@/lib/cms/schema";

export default function StatsBar() {
  const { state, addToList } = useCms();
  const stats = state.dashboard.stats;

  return (
    <section>
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)}`}>
          {stats.map((s, i) => (
            <ListItem key={s.id} path="dashboard.stats" index={i}>
              <div
                className="p-6 md:p-8 text-center h-full"
                style={{
                  borderInlineStart:
                    i === 0 ? "none" : "1px solid var(--outline-variant)",
                }}
              >
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: s.highlight ? "var(--primary)" : "var(--on-surface)" }}
                >
                  {s.value}
                </div>
                <Editable
                  path={`dashboard.stats.${i}.label`}
                  raw={s.label}
                  as="div"
                  className="text-[10px] uppercase tracking-widest opacity-60"
                  style={{ color: "var(--on-surface-variant)" }}
                />
              </div>
            </ListItem>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <AddButton
          label="Add stat"
          onClick={() =>
            addToList<DashboardStat>("dashboard.stats", {
              id: `st-${Date.now()}`,
              value: "0",
              label: { fa: "معیار", en: "Metric" },
            })
          }
        />
      </div>
    </section>
  );
}
