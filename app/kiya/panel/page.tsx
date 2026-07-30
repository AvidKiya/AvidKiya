'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3, Briefcase, CalendarDays, CheckCircle2, Database, FileCode2,
  Home, LogOut, PackagePlus, Save, Search, Settings, ShieldCheck,
  ShoppingBag, Sparkles, Trash2, UserRound, Wrench
} from 'lucide-react';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';

type SectionKey = 'dashboard'|'identity'|'projects'|'shop'|'services'|'tools'|'calendar'|'security';

const sections: Array<{key:SectionKey; label:string; icon:any; desc:string}> = [
  {key:'dashboard', label:'داشبورد', icon:BarChart3, desc:'نمای کلی سایت'},
  {key:'identity', label:'هویت برند', icon:UserRound, desc:'نام، عنوان و معرفی'},
  {key:'projects', label:'پروژه‌ها', icon:FileCode2, desc:'نمونه‌کارها و کیس‌ها'},
  {key:'shop', label:'فروشگاه', icon:ShoppingBag, desc:'محصولات و قیمت‌ها'},
  {key:'services', label:'خدمات', icon:Briefcase, desc:'پکیج‌ها و مبالغ'},
  {key:'tools', label:'ابزارها', icon:Wrench, desc:'ابزارهای آنلاین'},
  {key:'calendar', label:'تقویم', icon:CalendarDays, desc:'جملات و گاهشمار'},
  {key:'security', label:'امنیت', icon:ShieldCheck, desc:'وضعیت محافظت پنل'},
];

const toman = (v?: number) => v ? `${v.toLocaleString('fa-IR')} تومان` : 'توافقی';

function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`glass-input !py-[9px] text-[13px] ${props.className || ''}`} />;
}
function AdminTextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`glass-input !py-[10px] text-[13px] resize-y ${props.className || ''}`} />;
}
function PanelHeader({title, desc}:{title:string; desc:string}){
  return <div className="mb-4"><h2 className="text-[22px] font-black tracking-[-0.02em]">{title}</h2><p className="text-text-3 text-[12.5px] mt-1">{desc}</p></div>;
}

export default function AdminPanel(){
  const { cms, updateCms, syncStatus, exportJson, importJson } = useCms();
  const [section, setSection] = useState<SectionKey>('dashboard');
  const [q, setQ] = useState('');
  const router = useRouter();
  const filtered = useMemo(()=>sections.filter(s => !q || s.label.includes(q) || s.desc.includes(q)), [q]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method:'POST' });
    router.replace('/kiya/login');
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-6 md:py-8">
      <GlassCard className="!p-4 md:!p-5 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[17px] bg-primary/10 text-primary flex items-center justify-center"><Settings size={24}/></div>
            <div>
              <h1 className="text-[20px] md:text-[24px] font-black">AvidKiya Admin Console</h1>
              <p className="text-[12px] text-text-3 mt-1">پنل جدید، امن‌تر، تمیزتر و هماهنگ با طراحی سایت</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <span className={`rounded-full px-3 py-2 border ${syncStatus==='synced' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-amber/10 text-amber border-amber/20'}`}>{syncStatus==='synced' ? 'ذخیره شده' : syncStatus}</span>
            <button onClick={exportJson} className="glass-btn !py-2 !px-3">Export JSON</button>
            <label className="glass-btn !py-2 !px-3 cursor-pointer">Import JSON<input type="file" accept="application/json" hidden onChange={e=> e.target.files?.[0] && importJson(e.target.files[0])}/></label>
            <Link href="/" className="glass-btn !py-2 !px-3 flex items-center gap-1"><Home size={14}/> سایت</Link>
            <button onClick={logout} className="glass-btn !py-2 !px-3 text-rose flex items-center gap-1"><LogOut size={14}/> خروج</button>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-4 items-start">
        <aside className="lg:sticky lg:top-[84px] space-y-3">
          <GlassCard className="!p-3">
            <div className="relative">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-3" />
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجوی بخش" className="glass-input !py-2 ps-9 text-[12.5px]" />
            </div>
          </GlassCard>
          <GlassCard className="!p-2">
            <nav className="space-y-1">
              {filtered.map(item=>{ const Icon=item.icon; const active=section===item.key; return (
                <button key={item.key} onClick={()=>setSection(item.key)} className={`w-full rounded-[15px] px-3 py-3 flex items-center gap-3 text-start transition ${active ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'hover:bg-white/[0.04] text-text-2'}`}>
                  <span className="w-9 h-9 rounded-[12px] bg-white/[0.035] flex items-center justify-center shrink-0"><Icon size={17}/></span>
                  <span className="min-w-0"><b className="block text-[13px]">{item.label}</b><small className="text-[10.5px] text-text-3">{item.desc}</small></span>
                </button>
              )})}
            </nav>
          </GlassCard>
        </aside>

        <main className="min-w-0">
          {section === 'dashboard' && <Dashboard />}
          {section === 'identity' && <Identity />}
          {section === 'projects' && <Projects />}
          {section === 'shop' && <Shop />}
          {section === 'services' && <Services />}
          {section === 'tools' && <Tools />}
          {section === 'calendar' && <CalendarSection />}
          {section === 'security' && <Security />}
        </main>
      </div>
    </div>
  );
}

function Dashboard(){
  const { cms } = useCms();
  const cards = [
    { label:'پروژه‌ها', value: cms.projects.customProjects.length, Icon: FileCode2 },
    { label:'محصولات', value: cms.shop.products.length, Icon: ShoppingBag },
    { label:'خدمات', value: cms.freelancing.services.length, Icon: Briefcase },
    { label:'ابزارها', value: cms.tools.items.length, Icon: Wrench },
  ];
  return (
    <div className="space-y-4">
      <PanelHeader title="نمای کلی" desc="وضعیت محتوای اصلی سایت در یک نگاه" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map(({label, value, Icon}) => (
          <GlassCard key={label} className="!p-5">
            <Icon className="text-primary mb-3" size={22}/>
            <div className="text-[28px] font-black">{value}</div>
            <div className="text-text-3 text-[12px]">{label}</div>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="!p-5">
        <div className="flex items-center gap-2 text-emerald font-bold mb-2"><CheckCircle2 size={18}/> سیستم آماده است</div>
        <p className="text-text-2 text-sm leading-8">ورود پنل دیگر سمت کلاینت و با رمز پیش‌فرض نیست؛ مسیر مدیریت با Middleware و Cookie امن محافظت می‌شود.</p>
      </GlassCard>
    </div>
  );
}
function Identity(){
  const { cms, updateCms } = useCms();
  return (
    <GlassCard className="!p-5">
      <PanelHeader title="هویت برند" desc="اطلاعات اصلی برند و معرفی کوتاه" />
      <div className="grid md:grid-cols-2 gap-3">
        <AdminInput value={cms.identity.fullName.fa} onChange={e=>updateCms({identity:{...cms.identity, fullName:{...cms.identity.fullName, fa:e.target.value}}})} placeholder="نام فارسی" />
        <AdminInput value={cms.identity.fullName.en} dir="ltr" onChange={e=>updateCms({identity:{...cms.identity, fullName:{...cms.identity.fullName, en:e.target.value}}})} placeholder="Name" />
        <AdminInput value={cms.identity.title.fa} onChange={e=>updateCms({identity:{...cms.identity, title:{...cms.identity.title, fa:e.target.value}}})} placeholder="عنوان فارسی" />
        <AdminInput value={cms.identity.email} dir="ltr" onChange={e=>updateCms({identity:{...cms.identity, email:e.target.value}})} placeholder="Email" />
        <AdminTextArea className="md:col-span-2" rows={4} value={cms.identity.bio.fa} onChange={e=>updateCms({identity:{...cms.identity, bio:{...cms.identity.bio, fa:e.target.value}}})} />
      </div>
    </GlassCard>
  );
}
function Projects(){
  const { cms, updateCms } = useCms(); const list=cms.projects.customProjects;
  return <div className="space-y-3"><PanelHeader title="پروژه‌ها" desc="مدیریت نمونه‌کارهای نمایش داده‌شده در سایت" />
    <button onClick={()=>updateCms({projects:{customProjects:[{id:'p'+Date.now(), title:'پروژه جدید', description:'توضیح پروژه', language:'Next.js', stars:0, url:'#', featured:false}, ...list]}})} className="glass-btn-primary !py-2 !px-4 flex items-center gap-2"><PackagePlus size={16}/> پروژه جدید</button>
    <div className="grid md:grid-cols-2 gap-3">{list.map((p,i)=><GlassCard key={p.id} className="!p-4 space-y-2"><AdminInput value={p.title} onChange={e=>{const a=[...list]; a[i]={...p,title:e.target.value}; updateCms({projects:{customProjects:a}})}}/><AdminTextArea rows={2} value={p.description} onChange={e=>{const a=[...list]; a[i]={...p,description:e.target.value}; updateCms({projects:{customProjects:a}})}}/><div className="flex gap-2 items-center"><AdminInput className="!w-[120px]" value={p.language||''} onChange={e=>{const a=[...list]; a[i]={...p,language:e.target.value}; updateCms({projects:{customProjects:a}})}}/><label className="text-xs flex items-center gap-2"><input type="checkbox" checked={p.featured} onChange={e=>{const a=[...list]; a[i]={...p,featured:e.target.checked}; updateCms({projects:{customProjects:a}})}}/> منتخب</label><button onClick={()=>updateCms({projects:{customProjects:list.filter(x=>x.id!==p.id)}})} className="ms-auto text-rose"><Trash2 size={16}/></button></div></GlassCard>)}</div>
  </div>;
}
function Shop(){
  const { cms, updateCms } = useCms(); const list=cms.shop.products;
  return <div className="space-y-3"><PanelHeader title="فروشگاه" desc="همه قیمت‌ها به تومان ذخیره و نمایش داده می‌شوند" />
    <div className="grid md:grid-cols-2 gap-3">{list.map((p,i)=><GlassCard key={p.id} className="!p-4 space-y-2"><AdminInput value={p.title.fa} onChange={e=>{const a=[...list]; a[i]={...p,title:{...p.title,fa:e.target.value}}; updateCms({shop:{...cms.shop,products:a}})}}/><AdminInput type="number" value={p.price} onChange={e=>{const a=[...list]; a[i]={...p,price:+e.target.value||0,currency:'IRR'}; updateCms({shop:{...cms.shop,products:a}})}}/><div className="text-xs text-text-3">{toman(p.price)}</div><AdminTextArea rows={2} value={p.description.fa} onChange={e=>{const a=[...list]; a[i]={...p,description:{...p.description,fa:e.target.value}}; updateCms({shop:{...cms.shop,products:a}})}}/></GlassCard>)}</div>
  </div>;
}
function Services(){
  const { cms, updateCms } = useCms(); const list=cms.freelancing.services;
  return <div className="space-y-3"><PanelHeader title="خدمات" desc="تعرفه خدمات بر پایه تومان" /><div className="grid md:grid-cols-2 gap-3">{list.map((s,i)=><GlassCard key={s.id} className="!p-4 space-y-2"><AdminInput value={s.title.fa} onChange={e=>{const a=[...list]; a[i]={...s,title:{...s.title,fa:e.target.value}}; updateCms({freelancing:{...cms.freelancing,services:a}})}}/><AdminInput type="number" value={s.priceFrom||0} onChange={e=>{const a=[...list]; a[i]={...s,priceFrom:+e.target.value||0}; updateCms({freelancing:{...cms.freelancing,services:a}})}}/><div className="text-xs text-text-3">از {toman(s.priceFrom)}</div><AdminTextArea rows={2} value={s.description.fa} onChange={e=>{const a=[...list]; a[i]={...s,description:{...s.description,fa:e.target.value}}; updateCms({freelancing:{...cms.freelancing,services:a}})}}/></GlassCard>)}</div></div>;
}
function Tools(){
  const { cms } = useCms();
  return <GlassCard className="!p-5"><PanelHeader title="ابزارها" desc="ابزارهای کاربردی فعال در سایت" /><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{cms.tools.items.map(t=><div key={t.id} className="rounded-[16px] border border-glass-border bg-white/[0.025] p-4"><Sparkles size={18} className="text-amber mb-2"/><b className="text-sm">{t.title.fa}</b><p className="text-xs text-text-3 mt-1 leading-6">{t.description.fa}</p></div>)}</div></GlassCard>;
}
function CalendarSection(){
  const { cms } = useCms();
  return <GlassCard className="!p-5"><PanelHeader title="تقویم و جملات" desc="تقویم شاهنشاهی/شمسی/میلادی و ۳۶۵ جمله روزانه فعال است" /><div className="grid md:grid-cols-3 gap-3"><div className="rounded-[16px] bg-primary/10 border border-primary/20 p-4"><Database className="text-primary mb-2"/><b>۳۶۵ جمله روزانه</b><p className="text-xs text-text-3 mt-1">بر اساس روز شمسی</p></div><div className="rounded-[16px] bg-white/[0.025] border border-glass-border p-4"><b>کوروش</b><p className="text-xs text-text-3 mt-1">{cms.quotes.kourosh.length} جمله پایه</p></div><div className="rounded-[16px] bg-white/[0.025] border border-glass-border p-4"><b>اوستایی</b><p className="text-xs text-text-3 mt-1">نام روزها، جشن‌ها و نَبُر</p></div></div></GlassCard>;
}
function Security(){
  return <GlassCard className="!p-5"><PanelHeader title="امنیت پنل" desc="پنل از حالت رمز پیش‌فرض و client-side خارج شد" /><div className="space-y-3 text-sm text-text-2 leading-8"><p><b className="text-text">محافظت فعال:</b> Middleware روی مسیر /kiya/panel، کوکی HttpOnly، امضای HMAC و SameSite Strict.</p><p><b className="text-text">تنظیم لازم:</b> در Cloudflare Environment Variables مقدارهای ADMIN_PASSWORD و ADMIN_SECRET را با رشته‌های قوی تنظیم کن.</p><p className="text-amber">هیچ سیستمی «غیرقابل هک مطلق» نیست، اما این ساختار نسبت به رمز قبلی client-side چندین سطح امن‌تر است.</p></div></GlassCard>;
}
