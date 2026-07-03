"use client";
import { useEffect, useState } from "react";
import { useCms } from "@/contexts/CmsContext";

const sections = [
  "نمای کلی","هویت","شبکه‌های اجتماعی","صفحه اصلی","درباره من","پروژه‌ها","رزومه","هدیه‌ها","اعلان‌ها","نظرات","فروشگاه","پیام‌ها","رسانه","تنظیمات"
];

export default function AdminPage(){
  const { cms, update, isAdmin, setIsAdmin, refresh } = useCms();
  const [tokenInput,setTokenInput]=useState("");
  const [status,setStatus]=useState<{api:boolean, token:boolean, kv:boolean}>({api:false,token:false,kv:false});
  const [active,setActive]=useState(0);
  const [needChange,setNeedChange]=useState(false);

  useEffect(()=>{
    const t = localStorage.getItem("ak_admin_token") || "";
    setTokenInput(t);
    if(t) verify(t);
  }, []);

  const verify = async (tok:string)=>{
    try{
      const r = await fetch("/api/verify", { headers: { "x-admin-token": tok }});
      const data = await r.json();
      setStatus({ api: true, token: data.ok, kv: data.kv });
      if(data.ok){
        localStorage.setItem("ak_admin_token", tok);
        setIsAdmin(true);
        if(tok==="admin") setNeedChange(true);
        refresh();
      }
      return data.ok;
    }catch{
      setStatus({api:false,token:false,kv:false});
      return false;
    }
  };

  const login = async (e:React.FormEvent)=>{
    e.preventDefault();
    const ok = await verify(tokenInput);
    if(!ok) alert("توکن اشتباه است");
  };

  const logout = ()=>{ localStorage.removeItem("ak_admin_token"); setIsAdmin(false); };

  const exportJson = ()=>{
    const blob = new Blob([JSON.stringify(cms,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="avidkiya-cms-backup.json"; a.click(); URL.revokeObjectURL(url);
  };
  const importJson = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = async ()=>{
      try{
        const data = JSON.parse(String(reader.result));
        const token = localStorage.getItem("ak_admin_token");
        await fetch("/api/cms", { method:"POST", headers:{ "Content-Type":"application/json", "x-admin-token": token||"" }, body: JSON.stringify({ cms: data })});
        alert("ایمپورت شد");
        refresh();
      }catch{ alert("فایل معتبر نیست");}
    };
    reader.readAsText(f);
  };

  if(!isAdmin){
    return (
      <div className="max-w-md mx-auto mt-10 glass rounded-[24px] p-8">
        <h1 className="text-2xl font-black mb-2">ورود مدیریت</h1>
        <p className="text-sm text-text-muted mb-5">Diagnostics:</p>
        <ul className="text-xs space-y-1 mb-5">
          <li>API reachable: {status.api ? "✅" : "❓"}</li>
          <li>TOKEN set: {status.token ? "✅" : "❌"}</li>
          <li>KV bound: {status.kv ? "✅" : "❓"}</li>
        </ul>
        <form onSubmit={login} className="space-y-3">
          <input type="password" value={tokenInput} onChange={e=>setTokenInput(e.target.value)} placeholder="ADMIN_TOKEN" className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border font-mono" />
          <button className="w-full py-3 rounded-xl bg-primary text-white font-black">ورود</button>
          <div className="text-[11px] text-text-faint">رمز پیش‌فرض: <b>admin</b></div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <aside className="glass rounded-2xl p-4 h-fit lg:sticky top-[88px]">
        <div className="font-black mb-3">پنل ادمین</div>
        <nav className="space-y-1 text-sm">
          {sections.map((s,i)=>(
            <button key={s} onClick={()=>setActive(i)} className={`w-full text-start px-3 py-2 rounded-xl ${active===i ? "bg-primary text-white" : "hover:bg-bg-soft"}`}>{i+1}. {s}</button>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
          <button onClick={exportJson} className="w-full py-2 rounded-lg border border-border">Export JSON</button>
          <label className="w-full py-2 rounded-lg border border-border block text-center cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={importJson} />
          </label>
          <button onClick={logout} className="w-full py-2 rounded-lg bg-danger/10 text-danger">خروج</button>
        </div>
      </aside>
      <section className="glass rounded-2xl p-6 min-h-[600px]">
        {needChange && (
          <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
            ⚠️ رمز پیش‌فرض admin است. لطفاً از بخش تنظیمات رمز را تغییر دهید.
          </div>
        )}
        <h2 className="text-xl font-black mb-4">{sections[active]}</h2>

        {/* Section renderers – simplified universal editor */}
        {active===0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-bg-soft border border-border">پروژه‌ها<br/><b className="text-2xl">{cms.dashboard.projects.length}</b></div>
            <div className="p-4 rounded-xl bg-bg-soft border border-border">نظرات<br/><b className="text-2xl">{cms.comments.length}</b></div>
            <div className="p-4 rounded-xl bg-bg-soft border border-border">محصولات<br/><b className="text-2xl">{cms.shop.products.length}</b></div>
            <div className="p-4 rounded-xl bg-bg-soft border border-border">پیام‌ها<br/><b className="text-2xl">{cms.messages.length}</b></div>
          </div>
        )}
        {active===1 && (
          <AdminIdentity />
        )}
        {active===13 && (
          <AdminSettings needChange={needChange} setNeedChange={setNeedChange} />
        )}
        {active!==0 && active!==1 && active!==13 && (
          <div className="text-text-muted text-sm">
            ویرایش این بخش از طریق <b>Edit Mode</b> در سایت انجام می‌شود. دکمه Edit Mode را در پایین صفحه فعال کنید، سپس به صفحه مربوطه بروید و روی ✎ کلیک کنید.
            <div className="mt-4 p-3 rounded-lg bg-bg-soft border border-border text-xs">
              path نمونه: <code>dashboard.heroTitleA.fa</code> — همه فیلدها دوزبانه‌اند.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function AdminIdentity(){
  const { cms, update } = useCms();
  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <label className="text-xs text-text-faint">نام کامل (فا)</label>
        <input className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={cms.identity.fullName.fa} onChange={e=>update("identity.fullName.fa", e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-text-faint">نام کامل (EN)</label>
        <input className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={cms.identity.fullName.en} onChange={e=>update("identity.fullName.en", e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-text-faint">ایمیل</label>
        <input className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={cms.identity.email} onChange={e=>update("identity.email", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-text-faint">Logo Letter</label>
          <input className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={cms.brand.logoLetter} onChange={e=>update("brand.logoLetter", e.target.value)} maxLength={2} />
        </div>
        <div>
          <label className="text-xs text-text-faint">GitHub Username</label>
          <input className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border" value={cms.settings.githubUsername} onChange={e=>update("settings.githubUsername", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs text-text-faint">لوگو (آپلود base64)</label>
        <ImageUpload path="brand.logoImage" />
        {cms.brand.logoImage && <img src={cms.brand.logoImage} alt="logo" className="mt-2 h-16 rounded-lg border border-border" />}
      </div>
    </div>
  );
}

function AdminSettings({ needChange, setNeedChange }:{ needChange:boolean, setNeedChange:(b:boolean)=>void }){
  const [newPass,setNewPass]=useState("");
  const [msg,setMsg]=useState("");
  const change = async ()=>{
    if(newPass.length < 4){ setMsg("رمز کوتاه است"); return; }
    const token = localStorage.getItem("ak_admin_token") || "";
    const r = await fetch("/api/change-password", { method:"POST", headers:{ "Content-Type":"application/json", "x-admin-token": token }, body: JSON.stringify({ newToken: newPass })});
    const data = await r.json();
    if(data.ok){
      localStorage.setItem("ak_admin_token", newPass);
      setMsg("✓ رمز تغییر کرد");
      setNeedChange(false);
    } else setMsg("خطا: "+data.error);
  };
  return (
    <div className="max-w-md space-y-4">
      <h3 className="font-bold">تغییر ADMIN_TOKEN</h3>
      <input type="text" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="رمز جدید" className="w-full px-3 py-2 rounded-xl bg-bg-soft border border-border font-mono" />
      <button onClick={change} className="px-4 py-2 rounded-xl bg-primary text-white font-bold">ذخیره رمز جدید</button>
      {msg && <div className="text-sm text-success">{msg}</div>}
      <div className="text-xs text-text-faint pt-4 border-t border-border">
        این رمز در KV کلید <code>cms:admin-token-override</code> ذخیره می‌شود و بدون redeploy اعمال می‌شود.
      </div>
    </div>
  );
}

function ImageUpload({ path }:{ path:string }){
  const { update } = useCms();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      const img = new Image();
      img.onload = ()=>{
        // compress to <300KB
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        const max = 800;
        if(w>max || h>max){ const s = Math.min(max/w, max/h); w=Math.round(w*s); h=Math.round(h*s); }
        canvas.width=w; canvas.height=h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img,0,0,w,h);
        let q = 0.85;
        let out = canvas.toDataURL("image/jpeg", q);
        while(out.length > 300*1024*1.37 && q>0.4){ q-=0.1; out = canvas.toDataURL("image/jpeg", q); }
        update(path, out);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };
  return <input type="file" accept="image/*" onChange={onFile} className="block text-xs mt-1" />;
}
