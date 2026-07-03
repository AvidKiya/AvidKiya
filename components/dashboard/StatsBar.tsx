"use client";
import { useCms } from "@/contexts/CmsContext";
export function StatsBar(){
  const { cms, resolve } = useCms();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cms.dashboard.stats.map(s=>(
        <div key={s.id} className="glass rounded-2xl p-5 text-center">
          <div className="text-3xl font-black text-gradient">{s.value}<span className="text-xl">{s.suffix}</span></div>
          <div className="text-xs text-text-muted mt-1">{resolve(s.label)}</div>
        </div>
      ))}
    </div>
  );
}
