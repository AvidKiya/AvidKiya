"use client";
import { Hero } from "@/components/dashboard/Hero";
import { PersianClock } from "@/components/ui/PersianClock";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { ui } from "@/lib/i18n";
import { useState } from "react";

export default function HomePage(){
  const { cms, resolve } = useCms();
  const { lang } = useApp();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const subscribe = async (e: React.FormEvent)=>{
    e.preventDefault();
    if(!email) return;
    try{
      const r = await fetch("/api/newsletter", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ email }) });
      setMsg(r.ok ? (lang==="fa" ? "عضویت انجام شد ✓" : "Subscribed ✓") : "Error");
    }catch{ setMsg("Error"); }
    setTimeout(()=>setMsg(""), 3000);
  };

  return (
    <div className="space-y-10">
      <Hero />
      <PersianClock />
      <section>
        <h2 className="text-2xl font-black mb-5">{ui(lang, "featuredWork")}</h2>
        <ProjectGrid />
      </section>
      <StatsBar />
      {cms.newsletter.enabled && (
        <section className="glass rounded-[24px] p-6 md:p-8">
          <h3 className="text-xl font-black mb-2">{resolve(cms.newsletter.title)}</h3>
          <p className="text-text-muted text-sm mb-4">{resolve(cms.newsletter.subtitle)}</p>
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" className="flex-1 px-4 py-3 rounded-xl bg-bg-soft border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
            <button className="px-5 py-3 rounded-xl font-bold text-white" style={{ background: "linear-gradient(120deg, var(--primary-solid), var(--primary))" }}>{lang==="fa" ? "عضویت" : "Subscribe"}</button>
          </form>
          {msg && <div className="text-sm text-success mt-2">{msg}</div>}
        </section>
      )}
    </div>
  );
}
