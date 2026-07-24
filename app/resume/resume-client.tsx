'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';

export default function ResumeClient(){
  const { cms, tf, t, lang } = useCms();
  const r = cms.resume;
  const id = cms.identity;

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-8 print:px-0 print:py-0">
      <div className="flex justify-end mb-3 print:hidden">
        <button onClick={()=>window.print()} className="glass-btn !py-2 !px-4 text-[13px]">
          {t('چاپ / PDF','Print / PDF')}
        </button>
      </div>

      <div className="bg-white text-[#0f172a] rounded-[14px] shadow-xl print:shadow-none print:rounded-none overflow-hidden" dir={lang==='fa'?'rtl':'ltr'}>
        <div className="px-7 md:px-10 py-7 md:py-9">
          {/* header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-5 mb-6">
            <div>
              <h1 className="text-[26px] md:text-[30px] font-black tracking-tight text-zinc-900">{tf(id.fullName)}</h1>
              <div className="text-[14px] text-zinc-600 mt-1">{tf(id.title)}</div>
              <div className="text-[12px] text-zinc-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <span>{id.email}</span>
                <span>{r.phone}</span>
                <span>{r.website}</span>
                <span>{tf(id.location)}</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-zinc-500">
              <div>github.com/avidkiya</div>
              <div>linkedin.com/in/avidkiya</div>
              <div>avidkiya.com</div>
            </div>
          </div>

          {/* summary */}
          <section className="mb-6">
            <h2 className="text-[13px] font-[700] uppercase tracking-wider text-zinc-700 mb-2 border-s-[3px] border-[#004741] ps-2">Summary</h2>
            <p className="text-[13.5px] leading-[1.8] text-zinc-700">{tf(r.summary)}</p>
          </section>

          <div className="grid md:grid-cols-[1.55fr_.95fr] gap-7">
            <div className="space-y-6">
              <section>
                <h2 className="text-[13px] font-[700] uppercase tracking-wider text-zinc-700 mb-3 border-s-[3px] border-[#004741] ps-2">Experience</h2>
                <div className="space-y-4">
                  {r.experience.map((e,i)=>(
                    <div key={i}>
                      <div className="flex justify-between items-baseline flex-wrap gap-1">
                        <div className="font-[700] text-[14.5px] text-zinc-900">{e.title} — {e.company}</div>
                        <div className="text-[11.5px] text-zinc-500">{e.period}</div>
                      </div>
                      <div className="text-[12.5px] text-zinc-600 mt-1 leading-relaxed">{e.desc}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[13px] font-[700] uppercase tracking-wider text-zinc-700 mb-3 border-s-[3px] border-[#004741] ps-2">Selected Projects</h2>
                <ul className="text-[12.5px] text-zinc-700 space-y-[7px] list-disc ps-5 marker:text-zinc-400">
                  <li><b>DevHub OS</b> — Professional portfolio, local CMS, Liquid Glass, Persian calendar — Edge SSR</li>
                  <li><b>Shop & Tools Suite</b> — Digital shop, cart UX, client-side utilities — React / Next.js</li>
                  <li><b>KIYA Planner</b> — Standalone second-brain product case study — Next.js / Cloudflare / AI</li>
                </ul>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-[13px] font-[700] uppercase tracking-wider text-zinc-700 mb-3 border-s-[3px] border-[#004741] ps-2">Skills</h2>
                <div className="flex flex-wrap gap-[7px] text-[11.5px]">
                  {r.skills.map(s=>(
                    <span key={s.name} className="px-[10px] py-[5px] rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700">{s.name}</span>
                  ))}
                  {['React','Zustand','Framer Motion','Recharts','D1','KV','R2','Workers AI'].map(x=>(
                    <span key={x} className="px-[10px] py-[5px] rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600">{x}</span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[13px] font-[700] uppercase tracking-wider text-zinc-700 mb-3 border-s-[3px] border-[#004741] ps-2">Education</h2>
                <div className="text-[12.5px] text-zinc-700 space-y-2">
                  {r.education.map((ed,i)=>(
                    <div key={i}>
                      <div className="font-[600]">{ed.degree}</div>
                      <div className="text-zinc-500 text-[11.5px]">{ed.school} • {ed.year}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[13px] font-[700] uppercase tracking-wider text-zinc-700 mb-3 border-s-[3px] border-[#004741] ps-2">Languages</h2>
                <div className="text-[12.5px] text-zinc-700 space-y-1">
                  {r.languages.map(l=>(
                    <div key={l.name} className="flex justify-between">
                      <span>{l.name}</span><span className="text-zinc-500">{l.level}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[13px] font-[700] uppercase tracking-wider text-zinc-700 mb-2 border-s-[3px] border-[#004741] ps-2">Links</h2>
                <div className="text-[11.5px] text-zinc-600 space-y-1">
                  <div>github.com/avidkiya</div>
                  <div>t.me/avidkiya</div>
                  <div>avidkiya.com</div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-200 text-center text-[10.5px] text-zinc-400">
            © 2585 Avid Kiya — avidkiya.com — Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          header, footer, nav, button { display: none !important; }
          .glass-card { box-shadow: none !important; border: none !important; background: transparent !important; }
          main { padding: 0 !important; }
          @page { margin: 14mm 12mm; size: A4; }
        }
      `}</style>
    </div>
  );
}
