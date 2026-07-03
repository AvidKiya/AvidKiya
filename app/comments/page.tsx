"use client";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
export default function CommentsPage(){
  const { cms, refresh } = useCms();
  const { lang } = useApp();
  const [form,setForm]=useState({name:"",email:"",role:"",rating:5,text:""});
  const [ok,setOk]=useState(false);
  const submit = async (e:React.FormEvent)=>{
    e.preventDefault();
    await fetch("/api/comments", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form)});
    setOk(true); setForm({name:"",email:"",role:"",rating:5,text:""});
    setTimeout(()=>{ setOk(false); refresh(); }, 2000);
  };
  const approved = cms.comments.filter(c=>c.approved);
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6">نظرات</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold mb-3">{lang==="fa" ? "ثبت نظر" : "Leave a comment"}</h3>
          <form onSubmit={submit} className="space-y-3 text-sm">
            <input required placeholder="نام" className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input required type="email" placeholder="Email" className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <input placeholder="سمت / Role" className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={form.role} onChange={e=>setForm({...form, role:e.target.value})} />
            <select className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={form.rating} onChange={e=>setForm({...form, rating: +e.target.value})}>
              {[5,4,3,2,1].map(n=> <option key={n} value={n}>{"⭐".repeat(n)}</option>)}
            </select>
            <textarea required rows={4} placeholder="متن نظر…" className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={form.text} onChange={e=>setForm({...form, text:e.target.value})} />
            <button className="w-full py-2.5 rounded-xl bg-primary text-white font-bold">ارسال</button>
            {ok && <div className="text-success text-xs">✓ نظر شما ثبت شد و پس از تایید نمایش داده می‌شود.</div>}
          </form>
        </div>
        <div className="space-y-4 max-h-[660px] overflow-auto pr-1">
          {approved.map(c=>(
            <div key={c.id} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black">{c.name.charAt(0)}</div>
                <div>
                  <div className="font-bold text-sm">{c.name} {c.role && <span className="text-text-faint text-xs">• {c.role}</span>}</div>
                  <div className="text-amber-400 text-xs">{"★".repeat(c.rating)}</div>
                </div>
                {c.pinned && <span className="ms-auto text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-400">PINNED</span>}
              </div>
              <p className="text-sm text-text-muted mt-3">{c.text}</p>
            </div>
          ))}
          {!approved.length && <div className="text-text-muted">هنوز نظری تایید نشده.</div>}
        </div>
      </div>
    </div>
  );
}
