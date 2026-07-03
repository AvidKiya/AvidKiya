'use client';
import { useCms } from '@/contexts/CmsContext';
export function StatsBar(){const{cms,resolve}=useCms();return <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{cms.dashboard.stats.map(s=><div key={s.id} className="glass rounded-2xl p-5"><div className="text-3xl font-black text-primaryBright">{s.value}</div><div className="mt-1 text-sm text-muted">{resolve(s.label)}</div></div>)}</section>}
