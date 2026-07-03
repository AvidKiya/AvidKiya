"use client";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { useEffect, useState } from "react";

export default function AboutPage(){
  const { cms, resolve } = useCms();
  const { dir, lang } = useApp();
  const [metrics, setMetrics] = useState(cms.about.metrics);
  const [uptime, setUptime] = useState(0);

  useEffect(()=>{
    const t = setInterval(()=>{
      setMetrics(m => m.map(x=> ({...x, percent: Math.max(10, Math.min(95, x.percent + (Math.random()*10-5)))})));
      setUptime(u=>u+1);
    }, 3000);
    const u = setInterval(()=> setUptime(s=>s+1), 1000);
    return ()=> { clearInterval(t); clearInterval(u); };
  }, []);

  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [text,setText]=useState(""); const [sent,setSent]=useState(false);

  const sendMsg = async (e: React.FormEvent)=>{
    e.preventDefault();
    await fetch("/api/messages", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name, email, text }) });
    setSent(true); setName(""); setEmail(""); setText("");
    setTimeout(()=>setSent(false), 3000);
  };

  return (
    <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6">
      {/* Left / Right swap in RTL handled by CSS order? We'll just render logical – in RTL visual order flips? Easier keep as is, user said asides swap in RTL – we use CSS order */}
      <aside className={`${dir==="rtl" ? "lg:order-3" : ""} space-y-5`}>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-black mb-4">{resolve(cms.about.statusTitle)}</h3>
          <div className="space-y-4">
            {metrics.map(m=>(
              <div key={m.id}>
                <div className="flex justify-between text-xs mb-1"><span>{resolve(m.label)}</span><span>{Math.round(m.percent)}%</span></div>
                <div className="h-2 bg-bg-soft rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: m.percent+"%", background: m.color }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs text-text-faint mb-2">Quick links</div>
          <div className="space-y-2 text-sm">
            {cms.about.quickLinks.map(q=> <a key={q.id} href={q.url} className="block hover:text-primary">{resolve(q.label)}</a>)}
          </div>
        </div>
        <div className="glass rounded-2xl p-5 text-sm italic text-text-muted">
          {resolve(cms.about.quote)}
        </div>
      </aside>

      {/* Center Terminal */}
      <section className="glass rounded-2xl overflow-hidden">
        <div className="bg-[#0b0e14] px-4 py-2 flex items-center gap-2 text-[11px] border-b border-border">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ms-3 text-text-faint">uptime: {Math.floor(uptime/3600)}h {Math.floor((uptime%3600)/60)}m {uptime%60}s</span>
        </div>
        <div className="p-5 md:p-7 font-mono text-sm space-y-3">
          <div className="text-success">[init] AvidKiya OS v3.0 loading…</div>
          <div className="text-text-faint">[ok] modules loaded • cache warm • edge ready</div>
          <h2 className="text-2xl font-black font-sans mt-4">{resolve(cms.about.welcomeTitle)}</h2>
          <p className="font-sans text-text-muted leading-relaxed">{resolve(cms.about.welcomeBody)}</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4 font-sans">
            {cms.about.miniProjects.map(mp=>(
              <div key={mp.id} className="bg-bg-soft/60 border border-border rounded-xl p-3">
                <div className="font-bold text-sm">{resolve(mp.title)}</div>
                <div className="text-xs text-text-muted">{resolve(mp.desc)}</div>
              </div>
            ))}
          </div>
          {/* contact form inline */}
          <div className="mt-6 border-t border-border pt-5 font-sans">
            <h4 className="font-bold mb-3" id="contact">{lang==="fa" ? "پیام سریع" : "Quick message"}</h4>
            <form onSubmit={sendMsg} className="grid gap-3">
              <input className="px-3 py-2 rounded-xl bg-bg-soft border border-border" placeholder={lang==="fa" ? "نام" : "Name"} value={name} onChange={e=>setName(e.target.value)} required />
              <input type="email" className="px-3 py-2 rounded-xl bg-bg-soft border border-border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <textarea className="px-3 py-2 rounded-xl bg-bg-soft border border-border" rows={3} placeholder={lang==="fa" ? "پیام…" : "Message…"} value={text} onChange={e=>setText(e.target.value)} required />
              <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">{lang==="fa" ? "ارسال" : "Send"}</button>
              {sent && <div className="text-success text-xs">✓ {lang==="fa" ? "ارسال شد" : "Sent"}</div>}
            </form>
          </div>
        </div>
      </section>

      {/* Activity right */}
      <aside className={`${dir==="rtl" ? "lg:order-1" : ""} space-y-5`}>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs text-text-faint mb-3">GitHub activity</div>
          <div className="grid grid-cols-12 gap-[3px]">
            {Array.from({length: 84}).map((_,i)=>(
              <div key={i} className="aspect-square rounded-[3px]" style={{ background: `rgba(52,211,153,${0.15 + Math.random()*0.85})` }} />
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs text-text-faint mb-3">Recent activity</div>
          <div className="space-y-3 text-sm">
            {cms.about.recentActivity.map(a=>(
              <div key={a.id} className="flex justify-between gap-3">
                <span>{resolve(a.text)}</span>
                <span className="text-[11px] text-text-faint">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <div className="text-sm mb-3">{lang==="fa" ? "آماده شروع پروژه‌ای؟" : "Ready to start?"}</div>
          <a href="#contact" className="block w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm">{lang==="fa" ? "شروع پروژه" : "Start Project"}</a>
        </div>
      </aside>
    </div>
  );
}
