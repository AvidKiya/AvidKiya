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
      <div className="glass rounded-2xl overflow-hidden">
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} divider-x`}>
          {stats.map((s, i) => (
            <ListItem key={s.id} path="dashboard.stats" index={i}>
              <div className="p-6 md:p-8 text-center h-full">
                <div
                  className="text-3xl md:text-4xl font-extrabold mb-1"
                  style={{
                    color: s.highlight ? "var(--primary-bright)" : "var(--on-surface)",
                  }}
                >
                  {s.value}
                </div>
                <Editable
                  path={`dashboard.stats.${i}.label`}
                  raw={s.label}
                  as="div"
                  className="text-[11px] uppercase tracking-widest"
                  style={{ color: "var(--outline)" }}
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
