'use client';
import { GlassCard } from '@/components/ui/glass';
import { useCms } from '@/lib/cms/cms-context';
import { AppIcon, Icons, type IconName } from '@/components/ui/icons';
import Link from 'next/link';

export default function AboutClient(){
  const { cms, tf, t } = useCms();
  const m = cms.about;
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 md:gap-5">
        {/* left — status command center */}
        <div className="space-y-3">
          <GlassCard className="!p-4">
            <div className="text-[11px] text-emerald flex items-center gap-1.5 mb-2">
              <span className="w-[7px] h-[7px] rounded-full bg-emerald animate-pulse" />
              {tf(m.statusTitle) || 'Online'}
            </div>
            <div className="text-[17px] font-[700]">{tf(cms.identity.fullName)}</div>
            <div className="text-[12.5px] text-text-2">{tf(cms.identity.title)}</div>
            <div className="text-[11.5px] text-text-3 mt-1">{tf(cms.identity.location)} • {cms.identity.email}</div>
          </GlassCard>

          <GlassCard className="!p-4">
            <div className="text-[11.5px] text-text-3 mb-2 uppercase tracking-wide">Metrics</div>
            <div className="space-y-[10px] text-[13px]">
              {m.metrics.map((x,i)=>(
                <div key={i} className="flex justify-between">
                  <span className="text-text-3">{tf(x.label)}</span>
                  <b className="tabular-nums text-emerald">{x.value}</b>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-text-3">Uptime</span><b className="text-emerald">99.9%</b>
              </div>
              <div className="flex justify-between">
                <span className="text-text-3">Response</span><b>&lt;120ms</b>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="!p-4">
            <div className="text-[11.5px] text-text-3 mb-2 uppercase tracking-wide">Quick links</div>
            <div className="grid grid-cols-2 gap-2 text-[12.5px]">
              {m.quickLinks.map((q,i)=>(
                <Link key={i} href={q.url} className="glass-card !py-[9px] !px-3 text-center hover:bg-white/[0.04] transition flex items-center justify-center gap-1.5">
                  {q.icon && q.icon in Icons && <AppIcon name={q.icon as IconName} size={13} />}
                  {tf(q.label)}
                </Link>
              ))}
              <Link href="https://github.com/avidkiya" target="_blank" className="glass-card !py-[9px] !px-3 text-center">GitHub</Link>
              <Link href="/resume" className="glass-card !py-[9px] !px-3 text-center">Resume</Link>
            </div>
          </GlassCard>

          <GlassCard className="!p-4 text-[12.5px] leading-relaxed text-text-2 italic">
            “{tf(m.quote)}”
          </GlassCard>
        </div>

        {/* right — main */}
        <div className="space-y-4">
          <GlassCard>
            <h1 className="text-[20px] md:text-[24px] font-[800] mb-2">{tf(m.welcomeTitle)}</h1>
            <p className="text-[14px] text-text-2 leading-[1.9]">{tf(m.welcomeBody)}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Next.js','TypeScript','Cloudflare','Edge','AI','Liquid Glass'].map(s=>(
                <span key={s} className="text-[11px] px-[10px] py-[5px] rounded-full bg-white/[0.05] border border-glass-border">{s}</span>
              ))}
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-4">
            <GlassCard className="!p-4">
              <div className="text-[12px] text-text-3 mb-2 flex items-center gap-1.5">
                <AppIcon name="zap" size={14} /> Mini Projects
              </div>
              <div className="space-y-[10px] text-[13px]">
                {m.miniProjects.map((p,i)=>(
                  <div key={i} className="flex justify-between">
                    <b>{p.title}</b>
                    <span className="text-text-3 text-[12px]">{p.desc}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="!p-4">
              <div className="text-[12px] text-text-3 mb-2 flex items-center gap-1.5">
                <AppIcon name="trending" size={14} /> Recent Activity
              </div>
              <div className="space-y-[9px] text-[12.5px]">
                {m.recentActivity.map((a,i)=>(
                  <div key={i} className="flex justify-between gap-3">
                    <span className="text-text-2 truncate">{a.text}</span>
                    <span className="text-text-3 text-[11px] shrink-0">{a.date}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* skills */}
          <GlassCard>
            <div className="text-[13px] font-[700] mb-3">Core Stack</div>
            <div className="grid sm:grid-cols-2 gap-3 text-[12.5px]">
              {cms.resume.skills.map(s=>(
                <div key={s.name}>
                  <div className="flex justify-between mb-1">
                    <span>{s.name}</span>
                    <span className="text-text-3 text-[11px]">{s.level}%</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-cyan rounded-full" style={{width: `${s.level}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
