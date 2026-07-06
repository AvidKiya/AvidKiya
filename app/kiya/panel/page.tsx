'use client';
import { useEffect, useState, useMemo } from 'react';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import Link from 'next/link';
import {
  LayoutDashboard, UserCog, Share2, Home, FileCode, FileText, Gift,
  Megaphone, MessageSquare, ShoppingBag, Briefcase, Wrench, Brain,
  Inbox, Image as ImageIcon, CalendarDays, Settings as SettingsIcon,
  BookOpen, Tag, Mail, Magnet, LogOut, Save, Plus, Trash2, Check, Eye, Search
} from 'lucide-react';

type SectionKey =
  'dashboard'|'identity'|'socials'|'homepage'|'about'|'projects'|'resume'|
  'gifts'|'announcements'|'comments'|'shop'|'freelance'|'tools'|'kiya'|
  'messages'|'media'|'calendar'|'settings'|'blog'|'coupons'|'emails'|'leadmagnet';

const SECTIONS: {key:SectionKey; fa:string; en:string; icon:any}[] = [
  {key:'dashboard', fa:'نمای کلی', en:'Dashboard', icon:LayoutDashboard},
  {key:'identity', fa:'هویت', en:'Identity', icon:UserCog},
  {key:'socials', fa:'شبکه‌های اجتماعی', en:'Socials', icon:Share2},
  {key:'homepage', fa:'صفحه اصلی', en:'Homepage', icon:Home},
  {key:'about', fa:'درباره', en:'About', icon:UserCog},
  {key:'projects', fa:'پروژه‌ها', en:'Projects', icon:FileCode},
  {key:'resume', fa:'رزومه', en:'Resume', icon:FileText},
  {key:'gifts', fa:'هدیه‌ها', en:'Gifts', icon:Gift},
  {key:'announcements', fa:'اعلانات', en:'Announcements', icon:Megaphone},
  {key:'comments', fa:'نظرات', en:'Comments', icon:MessageSquare},
  {key:'shop', fa:'فروشگاه', en:'Shop', icon:ShoppingBag},
  {key:'freelance', fa:'فریلنسرینگ', en:'Freelance', icon:Briefcase},
  {key:'tools', fa:'ابزارها', en:'Tools', icon:Wrench},
  {key:'kiya', fa:'KIYA Planner', en:'KIYA', icon:Brain},
  {key:'blog', fa:'بلاگ', en:'Blog', icon:BookOpen},
  {key:'coupons', fa:'کوپن‌ها', en:'Coupons', icon:Tag},
  {key:'emails', fa:'ایمیل‌ها', en:'Emails', icon:Mail},
  {key:'leadmagnet', fa:'Lead Magnet', en:'Lead Magnet', icon:Magnet},
  {key:'messages', fa:'پیام‌ها', en:'Messages', icon:Inbox},
  {key:'media', fa:'رسانه', en:'Media', icon:ImageIcon},
  {key:'calendar', fa:'تقویم', en:'Calendar', icon:CalendarDays},
  {key:'settings', fa:'تنظیمات', en:'Settings', icon:SettingsIcon},
];

function Field({label, children}:{label:string; children:React.ReactNode}){
  return <label className="block text-[12px]"><div className="text-text-3 mb-1">{label}</div>{children}</label>
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={`glass-input !py-[9px] text-[13px] ${props.className||''}`} />
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>){
  return <textarea {...props} className={`glass-input !py-[10px] text-[13px] resize-y ${props.className||''}`} />
}

export default function AdminPanelV2(){
  const cmsCtx = useCms();
  const { cms, updateCms, editMode, setEditMode, exportJson, importJson, syncStatus, tf } = cmsCtx;
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [section, setSection] = useState<SectionKey>('dashboard');
  const [q, setQ] = useState('');

  useEffect(()=>{ if(typeof window!=='undefined' && (sessionStorage.getItem('ak_admin_ok')==='1' || location.hash.includes('kiya/panel'))) {
    const ok = sessionStorage.getItem('ak_admin_ok')==='1';
    if(ok) setAuthed(true);
  } },[]);

  const login = ()=> {
    const saved = localStorage.getItem('ak_admin_pass') || 'admin';
    if(pass === saved){ sessionStorage.setItem('ak_admin_ok','1'); setAuthed(true); setEditMode(true);} else alert('رمز اشتباه');
  };

  const filteredSections = useMemo(()=> SECTIONS.filter(s=> !q || s.fa.includes(q) || s.en.toLowerCase().includes(q.toLowerCase())), [q]);

  if(!authed){
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <GlassCard className="w-full max-w-[420px] text-center !p-7">
          <div className="w-12 h-12 rounded-[14px] bg-primary/12 text-primary flex items-center justify-center mx-auto mb-3">
            <SettingsIcon size={22} />
          </div>
          <div className="text-[18px] font-[800] mb-1">پنل مدیر مخفی</div>
          <div className="text-[12px] text-text-3 mb-4">#kiya/panel — AvidKiya OS</div>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}
            placeholder="رمز مدیر" className="glass-input text-center mb-3" />
          <button onClick={login} className="glass-btn-primary w-full">ورود امن →</button>
          <div className="text-[11px] text-text-3 mt-3">پیش‌فرض: admin — بعد از ورود حتماً عوض کنید</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-3 md:px-5 py-5 md:py-7">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-[10px]">
          <div className="w-9 h-9 rounded-[12px] bg-primary/12 text-primary flex items-center justify-center font-black text-[13px]">AK</div>
          <div>
            <div className="font-[750] text-[15px]">Admin OS</div>
            <div className="text-[11px] text-text-3">avidkiya.com • v2.5</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11.5px] flex-wrap">
          <span className={`px-[10px] py-[6px] rounded-full flex items-center gap-1.5 glass-card !p-0 !px-3 !py-[6px] ${syncStatus==='synced'?'text-emerald':syncStatus==='syncing'?'text-amber':'text-rose'}`}>
            {syncStatus==='synced' ? 'Synced' : syncStatus}
          </span>
          <label className="glass-card !px-3 !py-[6px] flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editMode} onChange={e=>setEditMode(e.target.checked)} />
            Edit
          </label>
          <button onClick={exportJson} className="glass-btn !py-[6px] !px-3 text-[11.5px]">Export</button>
          <label className="glass-btn !py-[6px] !px-3 text-[11.5px] cursor-pointer">Import
            <input type="file" accept="application/json" hidden onChange={e=> e.target.files?.[0] && importJson(e.target.files[0])} />
          </label>
          <Link href="/" className="glass-btn !py-[6px] !px-3 text-[11.5px]">View site</Link>
          <button onClick={()=>{sessionStorage.removeItem('ak_admin_ok'); location.href='/'}} className="text-rose text-[11.5px] px-2">خروج</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-4 items-start">
        {/* sidebar */}
        <aside className="glass-card !p-2 lg:sticky lg:top-[84px] max-h-[calc(100vh-110px)] overflow-auto">
          <div className="p-2 pb-3">
            <div className="relative">
              <Search size={13} className="absolute start-3 top-[9px] text-text-3" />
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجوی بخش…"
                className="w-full bg-black/[0.03] dark:bg-white/[0.035] border border-glass-border rounded-[10px] py-[7px] ps-8 text-[12px] outline-none" />
            </div>
          </div>
          <nav className="space-y-[3px] px-1 pb-2">
            {filteredSections.map(s=>{
              const Icon = s.icon;
              const active = section===s.key;
              return (
                <button key={s.key} onClick={()=>setSection(s.key)}
                  className={`w-full flex items-center gap-[10px] px-3 py-[9px] rounded-[11px] text-[12.5px] transition text-start ${
                    active ? 'bg-primary/10 text-primary font-[600]' : 'text-text-2 hover:text-text hover:bg-white/[0.035]'
                  }`}>
                  <Icon size={15} />
                  <span className="truncate">{s.fa}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* content */}
        <main className="min-w-0 space-y-4">
          <SectionRouter section={section} />
        </main>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */
function SectionRouter({section}:{section:SectionKey}){
  const { cms, updateCms, tf } = useCms();

  // DASHBOARD
  if(section==='dashboard'){
    const stats = [
      {l:'بازدید امروز',v:'1,248',d:'+12%'},
      {l:'کاربران KIYA',v:'84',d:'+3'},
      {l:'فروش امروز',v:'$129',d:'2 سفارش'},
      {l:'پیام جدید',v:String(cms.messages.filter(m=>!m.read).length),d:'inbox'},
    ];
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s=>(
          <GlassCard key={s.l} className="!p-4">
            <div className="text-[11.5px] text-text-3">{s.l}</div>
            <div className="text-[22px] font-[800]">{s.v}</div>
            <div className="text-[11px] text-emerald">{s.d}</div>
          </GlassCard>
        ))}
        <GlassCard className="sm:col-span-2 lg:col-span-4 !p-4">
          <div className="text-[13px] font-[700] mb-2">Onboarding ادمین</div>
          <div className="grid sm:grid-cols-3 gap-2 text-[12.5px] text-text-2">
            {['لوگو ✓','نام ✓','شبکه اجتماعی ✓','پروژه اول ✗','رزومه ✗','محصول اول ✗'].map(x=> <div key={x} className="bg-white/[0.03] rounded-[10px] px-3 py-[8px] border border-glass-border">{x}</div>)}
          </div>
        </GlassCard>
      </div>
    );
  }

  // IDENTITY
  if(section==='identity'){
    return (
      <GlassCard className="!p-5">
        <h2 className="font-[700] text-[15px] mb-4">هویت برند</h2>
        <div className="grid md:grid-cols-2 gap-3 text-[13px]">
          <Field label="نام فارسی"><Input value={cms.identity.fullName.fa} onChange={e=>updateCms({identity:{...cms.identity, fullName:{...cms.identity.fullName, fa:e.target.value}}})} /></Field>
          <Field label="Name EN"><Input value={cms.identity.fullName.en} onChange={e=>updateCms({identity:{...cms.identity, fullName:{...cms.identity.fullName, en:e.target.value}}})} dir="ltr" /></Field>
          <Field label="عنوان FA"><Input value={cms.identity.title.fa} onChange={e=>updateCms({identity:{...cms.identity, title:{...cms.identity.title, fa:e.target.value}}})} /></Field>
          <Field label="Title EN"><Input value={cms.identity.title.en} onChange={e=>updateCms({identity:{...cms.identity, title:{...cms.identity.title, en:e.target.value}}})} dir="ltr" /></Field>
          <Field label="ایمیل"><Input value={cms.identity.email} onChange={e=>updateCms({identity:{...cms.identity, email:e.target.value}})} dir="ltr" /></Field>
          <Field label="Years Exp"><Input type="number" value={cms.identity.yearsExperience} onChange={e=>updateCms({identity:{...cms.identity, yearsExperience:+e.target.value||0}})} /></Field>
          <div className="md:col-span-2">
            <Field label="Bio FA"><TextArea rows={3} value={cms.identity.bio.fa} onChange={e=>updateCms({identity:{...cms.identity, bio:{...cms.identity.bio, fa:e.target.value}}})} /></Field>
          </div>
        </div>
        <div className="text-[11px] text-emerald mt-3 flex items-center gap-1"><Check size={13}/> Auto-save فعال — 800ms</div>
      </GlassCard>
    );
  }

  // SOCIALS
  if(section==='socials'){
    return (
      <GlassCard className="!p-5">
        <div className="flex justify-between items-center mb-3"><h2 className="font-[700]">شبکه‌های اجتماعی</h2>
          <button onClick={()=>{
            const s = [...cms.socials, {id: 's'+Date.now(), platform:'github' as any, url:'https://', label:{fa:'جدید',en:'New'}, enabled:true}];
            updateCms({socials:s});
          }} className="glass-btn !py-[7px] !px-3 text-[12px] flex items-center gap-1"><Plus size={14}/> افزودن</button>
        </div>
        <div className="space-y-2 max-h-[540px] overflow-auto pe-1">
          {cms.socials.map((so, i)=>(
            <div key={so.id} className="grid md:grid-cols-[140px_1fr_120px_40px] gap-2 items-center text-[12.5px] bg-white/[0.022] p-[10px] rounded-[12px] border border-glass-border">
              <select value={so.platform}
                onChange={e=>{ const arr=[...cms.socials]; arr[i]={...so, platform:e.target.value as any}; updateCms({socials:arr});}}
                className="glass-input !py-[8px] text-[12px] bg-transparent">
                {['github','telegram','instagram','x','linkedin','youtube','email'].map(p=><option key={p} value={p}>{p}</option>)}
              </select>
              <input value={so.url} dir="ltr"
                onChange={e=>{ const arr=[...cms.socials]; arr[i]={...so, url:e.target.value}; updateCms({socials:arr});}}
                className="glass-input !py-[8px] text-[12px]" placeholder="https://…" />
              <label className="flex items-center gap-2 text-[11.5px]"><input type="checkbox" checked={so.enabled}
                onChange={e=>{ const arr=[...cms.socials]; arr[i]={...so, enabled:e.target.checked}; updateCms({socials:arr});}}/> فعال</label>
              <button onClick={()=> updateCms({socials: cms.socials.filter(x=>x.id!==so.id)})}
                className="text-rose hover:bg-rose/10 p-[7px] rounded-[8px]"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }

  // PROJECTS
  if(section==='projects'){
    const list = cms.projects.customProjects;
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-[700]">پروژه‌ها — {list.length} عدد</h2>
          <button onClick={()=>{
            const np = {id:'p'+Date.now(), title:'پروژه جدید', description:'توضیح کوتاه', language:'TypeScript', stars:0, featured:false, url:''};
            updateCms({projects:{customProjects:[np, ...list]}});
          }} className="glass-btn-primary !py-[8px] !px-3 text-[12px] flex items-center gap-1"><Plus size={14}/> پروژه جدید</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((p,idx)=>(
            <GlassCard key={p.id} className="!p-4 text-[12.5px] space-y-2">
              <div className="flex gap-2">
                <input value={p.title} placeholder="Title"
                  onChange={e=>{ const a=[...list]; a[idx]={...p, title:e.target.value}; updateCms({projects:{customProjects:a}})}}
                  className="glass-input !py-[8px] font-[600]" />
                <input value={p.language||''} placeholder="Lang" 
                  onChange={e=>{ const a=[...list]; a[idx]={...p, language:e.target.value}; updateCms({projects:{customProjects:a}})}}
                  className="glass-input !py-[8px] w-[110px]" />
              </div>
              <textarea value={p.description} rows={2}
                onChange={e=>{ const a=[...list]; a[idx]={...p, description:e.target.value}; updateCms({projects:{customProjects:a}})}}
                className="glass-input text-[12px]" />
              <div className="flex items-center gap-3 text-[11.5px]">
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!p.featured}
                  onChange={e=>{ const a=[...list]; a[idx]={...p, featured:e.target.checked}; updateCms({projects:{customProjects:a}})} } /> Featured</label>
                <input type="number" value={p.stars||0}
                  onChange={e=>{ const a=[...list]; a[idx]={...p, stars:+e.target.value}; updateCms({projects:{customProjects:a}})}}
                  className="glass-input !py-[6px] w-[90px] text-[11px]" placeholder="stars" />
                <button onClick={()=> updateCms({projects:{customProjects: list.filter(x=>x.id!==p.id)}})}
                  className="ms-auto text-rose hover:underline flex items-center gap-1"><Trash2 size={13}/> حذف</button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // SHOP
  if(section==='shop'){
    const prods = cms.shop.products;
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-[700]">فروشگاه — {prods.length} محصول</h2>
          <button onClick={()=>{
            const np={id:'pr'+Date.now(), title:{fa:'محصول جدید',en:'New Product'}, description:{fa:'توضیح',en:'desc'}, price:19, currency:'USD' as const, category: cms.shop.categories[0]||'قالب', enabled:true};
            updateCms({shop:{...cms.shop, products:[np, ...prods]}});
          }} className="glass-btn-primary !py-[8px] !px-3 text-[12px]">+ محصول</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {prods.map((p, i)=>(
            <GlassCard key={p.id} className="!p-4 text-[12.5px] space-y-2">
              <div className="flex gap-2">
                <input value={p.title.fa} onChange={e=>{ const a=[...prods]; a[i]={...p, title:{...p.title, fa:e.target.value}}; updateCms({shop:{...cms.shop, products:a}})}} className="glass-input !py-[8px] flex-1" />
                <input type="number" value={p.price} onChange={e=>{ const a=[...prods]; a[i]={...p, price:+e.target.value||0}; updateCms({shop:{...cms.shop, products:a}})}} className="glass-input !py-[8px] w-[100px]" />
              </div>
              <textarea value={p.description.fa} rows={2} onChange={e=>{ const a=[...prods]; a[i]={...p, description:{...p.description, fa:e.target.value}}; updateCms({shop:{...cms.shop, products:a}})}}
                className="glass-input text-[12px]" />
              <div className="flex items-center justify-between text-[11.5px]">
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={p.enabled} onChange={e=>{ const a=[...prods]; a[i]={...p, enabled:e.target.checked}; updateCms({shop:{...cms.shop, products:a}})}}/> فعال</label>
                <span className="text-text-3">{p.category} • {p.currency}</span>
                <button onClick={()=> updateCms({shop:{...cms.shop, products: prods.filter(x=>x.id!==p.id)}})} className="text-rose">حذف</button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // BLOG
  if(section==='blog'){
    return (
      <GlassCard className="!p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-[700]">مدیریت بلاگ</h2>
          <button className="glass-btn-primary !py-[8px] !px-3 text-[12px]">+ مقاله جدید</button>
        </div>
        <div className="text-[13px] text-text-2 leading-relaxed">
          ویرایشگر متن غنی (TipTap) — دسته‌بندی، تگ، عکس کاور، SEO per article — انتشار/پیش‌نویس/زمان‌بندی<br/>
          <span className="text-[11.5px] text-text-3">در این نسخه دمو: لیست مقالات از <code>/blog</code> خوانده می‌شود. پنل کامل Rich Editor در آپدیت بعدی فعال است.</span>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-3 text-[12.5px]">
          {[
            'مغز دوم چیست — منتشر شده',
            'Next.js روی Cloudflare — پیش‌نویس',
            'Liquid Glass UI — زمان‌بندی',
          ].map(ti=> <div key={ti} className="glass-card !p-3 !py-[10px]">{ti}</div>)}
        </div>
      </GlassCard>
    );
  }

  // KIYA
  if(section==='kiya'){
    const licenses = [
      {code:'KIYA-DEMO-0001-ABCD', plan:'Pro', exp:'۱۴۰۵/۰۸/۱۵', user:'demo@avidkiya.com', status:'فعال'},
      {code:'KIYA-FREE-92XZ-PPLM', plan:'Free', exp:'—', user:'sara@example.com', status:'فعال'},
      {code:'KIYA-TEAM-A1B2-C3D4', plan:'Team', exp:'۱۴۰۵/۱۲/۰۱', user:'team@acme.ir', status:'فعال'},
    ];
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-4 gap-3">
          {[
            ['کل لایسنس‌ها','142'],
            ['فعال','118'],
            ['Pro','54'],
            ['درآمد ماه',' $890'],
          ].map(([l,v])=>(
            <GlassCard key={l} className="!p-4 text-center">
              <div className="text-[11.5px] text-text-3">{l}</div>
              <div className="text-[20px] font-[800]">{v}</div>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="!p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-[700]">لایسنس‌ها</div>
            <div className="flex gap-2">
              <button className="glass-btn !py-[7px] !px-3 text-[12px]">ساخت لایسنس رایگان</button>
              <button className="glass-btn-primary !py-[7px] !px-3 text-[12px]">ساخت Pro نامحدود</button>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[12.5px]">
              <thead className="text-text-3 text-[11px] uppercase">
                <tr className="border-b border-glass-border">
                  <th className="text-start py-2 px-2">کد</th>
                  <th className="text-start py-2 px-2">پلن</th>
                  <th className="text-start py-2 px-2">کاربر</th>
                  <th className="text-start py-2 px-2">انقضا</th>
                  <th className="text-start py-2 px-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map(l=>(
                  <tr key={l.code} className="border-b border-glass-border/60">
                    <td className="py-[10px] px-2 font-mono text-[11.5px]">{l.code}</td>
                    <td className="px-2">{l.plan}</td>
                    <td className="px-2 text-text-2">{l.user}</td>
                    <td className="px-2">{l.exp}</td>
                    <td className="px-2"><span className="text-emerald text-[11px]">● {l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    );
  }

  // COUPONS
  if(section==='coupons'){
    return (
      <GlassCard className="!p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-[700]">کوپن‌ها / تخفیف</h2>
          <button className="glass-btn-primary !py-[7px] !px-3 text-[12px]">+ کوپن جدید</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-[12.5px]">
            <thead className="text-text-3 text-[11px]">
              <tr><th className="text-start p-2">کد</th><th>نوع</th><th>مقدار</th><th>استفاده</th><th>انقضا</th><th>وضعیت</th></tr>
            </thead>
            <tbody>
              {[
                ['WELCOME','درصد','15%','42 / 500','۱۴۰۵/۰۶/۳۱','فعال'],
                ['KIYA15','درصد','15%','128 / ∞','—','فعال'],
                ['NOWRUZ50','درصد','50%','0 / 100','۱۴۰۵/۰۱/۱۵','غیرفعال'],
              ].map(r=>(
                <tr key={r[0]} className="border-t border-glass-border/60">
                  {r.map((c,i)=><td key={i} className="py-[10px] px-2 text-center first:text-start font-mono text-[12px]">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    );
  }

  // EMAILS
  if(section==='emails'){
    return (
      <GlassCard className="!p-5">
        <h2 className="font-[700] mb-3">ایمیل خودکار — Resend</h2>
        <div className="grid md:grid-cols-2 gap-3 text-[12.5px]">
          {[
            ['خوش‌آمد KIYA','بعد از ثبت‌نام — فوری','فعال'],
            ['Onboarding Day 2','روز ۲','فعال'],
            ['انقضا ۷ روز قبل','قبل انقضا','فعال'],
            ['Win-back 30 روز','۳۰ روز غیرفعال','پیش‌نویس'],
          ].map(([t,d,s])=>(
            <div key={t} className="glass-card !p-3">
              <div className="font-[600]">{t}</div>
              <div className="text-text-3 text-[11.5px]">{d} • {s}</div>
              <button className="text-primary text-[11.5px] mt-2 hover:underline">ویرایش قالب →</button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-[12px] text-text-3">API Key Resend: <code className="bg-white/[0.05] px-2 py-1 rounded">re_••••••••••••••••</code> <button className="text-primary ms-2 hover:underline">تغییر</button></div>
      </GlassCard>
    );
  }

  // CALENDAR — quotes
  if(section==='calendar'){
    const { cms, updateCms } = useCms();
    return (
      <GlassCard className="!p-5">
        <h2 className="font-[700] mb-3">تقویم — سخنان بزرگان</h2>
        <div className="grid md:grid-cols-3 gap-4 text-[12.5px]">
          {(['kourosh','mohammadReza','rezaShah'] as const).map(k=>(
            <div key={k}>
              <div className="font-[600] mb-2">{k==='kourosh'?'کوروش بزرگ':k==='mohammadReza'?'محمدرضا شاه':'رضا شاه'} — {cms.quotes[k].length} سخن</div>
              <div className="space-y-2 max-h-[300px] overflow-auto pe-1">
                {cms.quotes[k].slice(0,6).map((qt, i)=>(
                  <div key={i} className="bg-white/[0.03] border border-glass-border rounded-[10px] p-[10px] leading-relaxed">«{qt}»</div>
                ))}
              </div>
              <button className="text-primary text-[11.5px] mt-2 hover:underline">+ افزودن سخن</button>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }

  // SETTINGS
  if(section==='settings'){
    const [newPass, setNewPass] = useState('');
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard className="!p-5">
          <h3 className="font-[700] mb-3">امنیت</h3>
          <div className="space-y-3 text-[13px]">
            <div>
              <div className="text-[11.5px] text-text-3 mb-1">رمز فعلی: admin</div>
              <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="رمز جدید…"
                className="glass-input text-[13px]" />
              <button onClick={()=>{ if(newPass.length>=4){ localStorage.setItem('ak_admin_pass', newPass); alert('رمز عوض شد'); setNewPass(''); } }}
                className="glass-btn-primary mt-2 w-full !py-[10px] text-[13px]">ذخیره رمز جدید</button>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <h3 className="font-[700] mb-3">SEO / Analytics</h3>
          <div className="space-y-[10px] text-[12.5px]">
            <input defaultValue={cms.seo.siteName} placeholder="Site Name" className="glass-input !py-[9px]" />
            <input defaultValue={cms.seo.description} placeholder="Meta description" className="glass-input !py-[9px]" />
            <input defaultValue={cms.analytics.plausibleDomain} placeholder="plausible.io domain" className="glass-input !py-[9px]" dir="ltr" />
            <button className="glass-btn w-full !py-[9px]">ذخیره SEO</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // HOMEPAGE
  if(section==='homepage'){
    return (
      <div className="space-y-3">
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-4">صفحه اصلی — Hero</h2>
          <div className="grid md:grid-cols-2 gap-3 text-[13px]">
            <Field label="تگ"><Input value={cms.dashboard.heroTag.fa} onChange={e=>updateCms({dashboard:{...cms.dashboard, heroTag:{...cms.dashboard.heroTag, fa:e.target.value}}})} /></Field>
            <Field label="Tag EN"><Input value={cms.dashboard.heroTag.en} onChange={e=>updateCms({dashboard:{...cms.dashboard, heroTag:{...cms.dashboard.heroTag, en:e.target.value}}})} dir="ltr" /></Field>
            <Field label="عنوان اول FA"><Input value={cms.dashboard.heroTitleA.fa} onChange={e=>updateCms({dashboard:{...cms.dashboard, heroTitleA:{...cms.dashboard.heroTitleA, fa:e.target.value}}})} /></Field>
            <Field label="عنوان اول EN"><Input value={cms.dashboard.heroTitleA.en} onChange={e=>updateCms({dashboard:{...cms.dashboard, heroTitleA:{...cms.dashboard.heroTitleA, en:e.target.value}}})} dir="ltr" /></Field>
            <Field label="عنوان دوم FA"><Input value={cms.dashboard.heroTitleB.fa} onChange={e=>updateCms({dashboard:{...cms.dashboard, heroTitleB:{...cms.dashboard.heroTitleB, fa:e.target.value}}})} /></Field>
            <Field label="عنوان دوم EN"><Input value={cms.dashboard.heroTitleB.en} onChange={e=>updateCms({dashboard:{...cms.dashboard, heroTitleB:{...cms.dashboard.heroTitleB, en:e.target.value}}})} dir="ltr" /></Field>
            <div className="md:col-span-2">
              <Field label="توضیحات FA"><TextArea rows={2} value={cms.dashboard.heroDescription.fa} onChange={e=>updateCms({dashboard:{...cms.dashboard, heroDescription:{...cms.dashboard.heroDescription, fa:e.target.value}}})} /></Field>
            </div>
            <Field label="CTA اول FA"><Input value={cms.dashboard.ctaPrimary.fa} onChange={e=>updateCms({dashboard:{...cms.dashboard, ctaPrimary:{...cms.dashboard.ctaPrimary, fa:e.target.value}}})} /></Field>
            <Field label="CTA دوم FA"><Input value={cms.dashboard.ctaSecondary.fa} onChange={e=>updateCms({dashboard:{...cms.dashboard, ctaSecondary:{...cms.dashboard.ctaSecondary, fa:e.target.value}}})} /></Field>
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-3">آمارها</h2>
          <div className="space-y-2">
            {cms.dashboard.stats.map((s,i)=>(
              <div key={s.id} className="grid grid-cols-[1fr_100px_50px_40px] gap-2 items-center text-[12.5px]">
                <input value={s.label.fa} onChange={e=>{ const a=[...cms.dashboard.stats]; a[i]={...s,label:{...s.label,fa:e.target.value}}; updateCms({dashboard:{...cms.dashboard,stats:a}}); }} className="glass-input !py-[7px]" />
                <input value={s.value} onChange={e=>{ const a=[...cms.dashboard.stats]; a[i]={...s,value:e.target.value}; updateCms({dashboard:{...cms.dashboard,stats:a}}); }} className="glass-input !py-[7px]" />
                <input value={s.icon||''} onChange={e=>{ const a=[...cms.dashboard.stats]; a[i]={...s,icon:e.target.value}; updateCms({dashboard:{...cms.dashboard,stats:a}}); }} className="glass-input !py-[7px] text-center" placeholder="🎨" />
                <button onClick={()=>updateCms({dashboard:{...cms.dashboard,stats:cms.dashboard.stats.filter(x=>x.id!==s.id)}})} className="text-rose text-center"><Trash2 size={14}/></button>
              </div>
            ))}
            <button onClick={()=>updateCms({dashboard:{...cms.dashboard,stats:[...cms.dashboard.stats,{id:'s'+Date.now(),label:{fa:'جدید',en:'New'},value:'0',icon:'📊'}]}})} className="glass-btn !py-[7px] !px-3 text-[12px]"><Plus size={13}/> آمار جدید</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ABOUT
  if(section==='about'){
    return (
      <div className="space-y-3">
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-4">درباره من</h2>
          <div className="grid md:grid-cols-2 gap-3 text-[13px]">
            <Field label="عنوان وضعیت FA"><Input value={cms.about.statusTitle.fa} onChange={e=>updateCms({about:{...cms.about,statusTitle:{...cms.about.statusTitle,fa:e.target.value}}})} /></Field>
            <Field label="نقل‌قول FA"><Input value={cms.about.quote.fa} onChange={e=>updateCms({about:{...cms.about,quote:{...cms.about.quote,fa:e.target.value}}})} /></Field>
            <div className="md:col-span-2">
              <Field label="عنوان خوش‌آمد FA"><Input value={cms.about.welcomeTitle.fa} onChange={e=>updateCms({about:{...cms.about,welcomeTitle:{...cms.about.welcomeTitle,fa:e.target.value}}})} /></Field>
            </div>
            <div className="md:col-span-2">
              <Field label="متن خوش‌آمد FA"><TextArea rows={3} value={cms.about.welcomeBody.fa} onChange={e=>updateCms({about:{...cms.about,welcomeBody:{...cms.about.welcomeBody,fa:e.target.value}}})} /></Field>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-3">لینک‌های سریع</h2>
          <div className="space-y-2">
            {cms.about.quickLinks.map((l,i)=>(
              <div key={i} className="grid grid-cols-[1fr_1fr_40px] gap-2 text-[12.5px] items-center">
                <input value={l.label.fa} onChange={e=>{ const a=[...cms.about.quickLinks]; a[i]={...l,label:{...l.label,fa:e.target.value}}; updateCms({about:{...cms.about,quickLinks:a}}); }} className="glass-input !py-[7px]" placeholder="عنوان" />
                <input value={l.url} dir="ltr" onChange={e=>{ const a=[...cms.about.quickLinks]; a[i]={...l,url:e.target.value}; updateCms({about:{...cms.about,quickLinks:a}}); }} className="glass-input !py-[7px]" placeholder="URL" />
                <button onClick={()=>updateCms({about:{...cms.about,quickLinks:cms.about.quickLinks.filter((_,j)=>j!==i)}})} className="text-rose text-center"><Trash2 size={14}/></button>
              </div>
            ))}
            <button onClick={()=>updateCms({about:{...cms.about,quickLinks:[...cms.about.quickLinks,{label:{fa:'جدید',en:'New'},url:'/'}]}})} className="glass-btn !py-[7px] !px-3 text-[12px]"><Plus size={13}/> لینک جدید</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // RESUME
  if(section==='resume'){
    return (
      <GlassCard className="!p-5">
        <h2 className="font-[700] mb-4">رزومه</h2>
        <div className="grid md:grid-cols-2 gap-3 text-[13px]">
          <Field label="خلاصه FA"><TextArea rows={3} value={cms.resume.summary.fa} onChange={e=>updateCms({resume:{...cms.resume,summary:{...cms.resume.summary,fa:e.target.value}}})} /></Field>
          <div className="space-y-2">
            <Field label="تلفن"><Input value={cms.resume.phone} onChange={e=>updateCms({resume:{...cms.resume,phone:e.target.value}})} dir="ltr" /></Field>
            <Field label="وب‌سایت"><Input value={cms.resume.website} onChange={e=>updateCms({resume:{...cms.resume,website:e.target.value}})} dir="ltr" /></Field>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-[600] mb-2 text-[13px]">مهارت‌ها</h3>
          <div className="space-y-2">
            {cms.resume.skills.map((sk,i)=>(
              <div key={i} className="grid grid-cols-[1fr_80px_40px] gap-2 items-center text-[12.5px]">
                <input value={sk.name} onChange={e=>{ const a=[...cms.resume.skills]; a[i]={...sk,name:e.target.value}; updateCms({resume:{...cms.resume,skills:a}}); }} className="glass-input !py-[7px]" />
                <input type="number" value={sk.level} min={0} max={100} onChange={e=>{ const a=[...cms.resume.skills]; a[i]={...sk,level:+e.target.value}; updateCms({resume:{...cms.resume,skills:a}}); }} className="glass-input !py-[7px]" />
                <button onClick={()=>updateCms({resume:{...cms.resume,skills:cms.resume.skills.filter((_,j)=>j!==i)}})} className="text-rose text-center"><Trash2 size={14}/></button>
              </div>
            ))}
            <button onClick={()=>updateCms({resume:{...cms.resume,skills:[...cms.resume.skills,{name:'مهارت جدید',level:50}]}})} className="glass-btn !py-[7px] !px-3 text-[12px]"><Plus size={13}/> مهارت</button>
          </div>
        </div>
      </GlassCard>
    );
  }

  // GIFTS
  if(section==='gifts'){
    return (
      <div className="space-y-3">
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-4">هدایا</h2>
          <div className="grid md:grid-cols-2 gap-3 text-[13px]">
            <Field label="عنوان FA"><Input value={cms.gifts.title.fa} onChange={e=>updateCms({gifts:{...cms.gifts,title:{...cms.gifts.title,fa:e.target.value}}})} /></Field>
            <Field label="زیرعنوان FA"><Input value={cms.gifts.subtitle.fa} onChange={e=>updateCms({gifts:{...cms.gifts,subtitle:{...cms.gifts.subtitle,fa:e.target.value}}})} /></Field>
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <div className="flex justify-between items-center mb-3"><h3 className="font-[600] text-[13px]">دانلودهای رایگان</h3>
            <button onClick={()=>updateCms({gifts:{...cms.gifts,downloads:[...cms.gifts.downloads,{title:'فایل جدید',url:'#'}]}})} className="glass-btn !py-[6px] !px-2 text-[11px]"><Plus size={12}/> افزودن</button>
          </div>
          <div className="space-y-2">
            {cms.gifts.downloads.map((d,i)=>(
              <div key={i} className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center text-[12.5px]">
                <input value={d.title} onChange={e=>{ const a=[...cms.gifts.downloads]; a[i]={...d,title:e.target.value}; updateCms({gifts:{...cms.gifts,downloads:a}}); }} className="glass-input !py-[7px]" placeholder="عنوان" />
                <input value={d.url} dir="ltr" onChange={e=>{ const a=[...cms.gifts.downloads]; a[i]={...d,url:e.target.value}; updateCms({gifts:{...cms.gifts,downloads:a}}); }} className="glass-input !py-[7px]" placeholder="URL" />
                <button onClick={()=>updateCms({gifts:{...cms.gifts,downloads:cms.gifts.downloads.filter((_,j)=>j!==i)}})} className="text-rose text-center"><Trash2 size={13}/></button>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <div className="flex justify-between items-center mb-3"><h3 className="font-[600] text-[13px]">لینک‌های حمایت مالی</h3>
            <button onClick={()=>updateCms({gifts:{...cms.gifts,donationLinks:[...cms.gifts.donationLinks,{label:'جدید',url:'#'}]}})} className="glass-btn !py-[6px] !px-2 text-[11px]"><Plus size={12}/> افزودن</button>
          </div>
          <div className="space-y-2">
            {cms.gifts.donationLinks.map((d,i)=>(
              <div key={i} className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center text-[12.5px]">
                <input value={d.label} onChange={e=>{ const a=[...cms.gifts.donationLinks]; a[i]={...d,label:e.target.value}; updateCms({gifts:{...cms.gifts,donationLinks:a}}); }} className="glass-input !py-[7px]" placeholder="نام" />
                <input value={d.url} dir="ltr" onChange={e=>{ const a=[...cms.gifts.donationLinks]; a[i]={...d,url:e.target.value}; updateCms({gifts:{...cms.gifts,donationLinks:a}}); }} className="glass-input !py-[7px]" placeholder="URL" />
                <button onClick={()=>updateCms({gifts:{...cms.gifts,donationLinks:cms.gifts.donationLinks.filter((_,j)=>j!==i)}})} className="text-rose text-center"><Trash2 size={13}/></button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  // ANNOUNCEMENTS
  if(section==='announcements'){
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-[700]">اعلانات — {cms.announcements.length} عدد</h2>
          <button onClick={()=>updateCms({announcements:[{id:'ann'+Date.now(),title:'اعلان جدید',body:'متن اعلان',date:new Date().toISOString().split('T')[0],type:'news'},...cms.announcements]})} className="glass-btn-primary !py-[8px] !px-3 text-[12px]"><Plus size={14}/> اعلان جدید</button>
        </div>
        <div className="space-y-2">
          {cms.announcements.map((a,i)=>(
            <GlassCard key={a.id} className="!p-4 text-[12.5px] space-y-2">
              <div className="flex gap-2">
                <input value={a.title} onChange={e=>{ const arr=[...cms.announcements]; arr[i]={...a,title:e.target.value}; updateCms({announcements:arr}); }} className="glass-input !py-[8px] flex-1" />
                <input type="date" value={a.date} onChange={e=>{ const arr=[...cms.announcements]; arr[i]={...a,date:e.target.value}; updateCms({announcements:arr}); }} className="glass-input !py-[8px]" />
                <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={!!a.pinned} onChange={e=>{ const arr=[...cms.announcements]; arr[i]={...a,pinned:e.target.checked}; updateCms({announcements:arr}); }}/> ثابت</label>
              </div>
              <textarea value={a.body} rows={2} onChange={e=>{ const arr=[...cms.announcements]; arr[i]={...a,body:e.target.value}; updateCms({announcements:arr}); }} className="glass-input text-[12px]" />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-text-3">{a.type || 'news'}</span>
                <button onClick={()=>updateCms({announcements:cms.announcements.filter(x=>x.id!==a.id)})} className="text-rose text-[11px] flex items-center gap-1"><Trash2 size={13}/> حذف</button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // COMMENTS
  if(section==='comments'){
    const approved = cms.comments.filter(c=>c.approved);
    const pending = cms.comments.filter(c=>!c.approved);
    return (
      <div className="space-y-3">
        <h2 className="font-[700]">نظرات — {cms.comments.length} عدد ({pending.length} در انتظار)</h2>
        {pending.length > 0 && (
          <GlassCard className="!p-4">
            <h3 className="font-[600] text-[13px] mb-2 text-amber">در انتظار تأیید</h3>
            <div className="space-y-2">
              {pending.map(c=>(
                <div key={c.id} className="flex items-center justify-between bg-amber/5 border border-amber/15 rounded-[10px] p-3 text-[12.5px]">
                  <div><b>{c.author}</b> — {c.text.slice(0,80)}...</div>
                  <div className="flex gap-2">
                    <button onClick={()=>{ const arr=cms.comments.map(x=>x.id===c.id?{...x,approved:true}:x); updateCms({comments:arr}); }} className="text-emerald text-[11px]">تأیید</button>
                    <button onClick={()=>updateCms({comments:cms.comments.filter(x=>x.id!==c.id)})} className="text-rose text-[11px]">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
        <GlassCard className="!p-4">
          <h3 className="font-[600] text-[13px] mb-2">تأیید شده — {approved.length}</h3>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {approved.map(c=>(
              <div key={c.id} className="flex items-center justify-between bg-white/[0.02] rounded-[10px] p-3 text-[12.5px] border border-glass-border">
                <div>
                  <span className="font-[600]">{c.author}</span>
                  {c.rating && <span className="text-amber ms-2">{'★'.repeat(c.rating)}</span>}
                  <span className="text-text-3 ms-2">{c.text.slice(0,60)}</span>
                </div>
                <button onClick={()=>updateCms({comments:cms.comments.filter(x=>x.id!==c.id)})} className="text-rose text-[11px]">حذف</button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  // FREELANCE
  if(section==='freelance'){
    return (
      <div className="space-y-3">
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-3">خدمات فریلنسرینگ</h2>
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={cms.freelancing.enabled} onChange={e=>updateCms({freelancing:{...cms.freelancing,enabled:e.target.checked}})} /> فعال</label>
            <button onClick={()=>updateCms({freelancing:{...cms.freelancing,services:[...cms.freelancing.services,{id:'svc'+Date.now(),title:{fa:'خدمت جدید',en:'New Service'},description:{fa:'توضیح',en:'desc'},enabled:true}]}})} className="glass-btn !py-[7px] !px-3 text-[12px]"><Plus size={13}/> خدمت</button>
          </div>
          <div className="space-y-2">
            {cms.freelancing.services.map((svc,i)=>(
              <div key={svc.id} className="grid grid-cols-[1fr_1fr_60px_36px] gap-2 items-center text-[12.5px] bg-white/[0.02] p-2 rounded-[10px] border border-glass-border">
                <input value={svc.title.fa} onChange={e=>{ const a=[...cms.freelancing.services]; a[i]={...svc,title:{...svc.title,fa:e.target.value}}; updateCms({freelancing:{...cms.freelancing,services:a}}); }} className="glass-input !py-[7px]" placeholder="عنوان" />
                <input value={svc.description.fa} onChange={e=>{ const a=[...cms.freelancing.services]; a[i]={...svc,description:{...svc.description,fa:e.target.value}}; updateCms({freelancing:{...cms.freelancing,services:a}}); }} className="glass-input !py-[7px]" placeholder="توضیح" />
                <input type="number" value={svc.priceFrom||0} onChange={e=>{ const a=[...cms.freelancing.services]; a[i]={...svc,priceFrom:+e.target.value}; updateCms({freelancing:{...cms.freelancing,services:a}}); }} className="glass-input !py-[7px]" placeholder="$" />
                <button onClick={()=>updateCms({freelancing:{...cms.freelancing,services:cms.freelancing.services.filter(x=>x.id!==svc.id)}})} className="text-rose text-center"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <div className="flex justify-between items-center mb-3"><h3 className="font-[600] text-[13px]">پورتفولیو</h3>
            <button onClick={()=>updateCms({freelancing:{...cms.freelancing,portfolio:[...cms.freelancing.portfolio,{id:'pf'+Date.now(),title:'نمونه جدید'}]}})} className="glass-btn !py-[6px] !px-2 text-[11px]"><Plus size={12}/> افزودن</button>
          </div>
          <div className="space-y-2">
            {cms.freelancing.portfolio.map((p,i)=>(
              <div key={p.id} className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center text-[12.5px]">
                <input value={p.title} onChange={e=>{ const a=[...cms.freelancing.portfolio]; a[i]={...p,title:e.target.value}; updateCms({freelancing:{...cms.freelancing,portfolio:a}}); }} className="glass-input !py-[7px]" />
                <input value={p.url||''} dir="ltr" onChange={e=>{ const a=[...cms.freelancing.portfolio]; a[i]={...p,url:e.target.value}; updateCms({freelancing:{...cms.freelancing,portfolio:a}}); }} className="glass-input !py-[7px]" placeholder="URL" />
                <button onClick={()=>updateCms({freelancing:{...cms.freelancing,portfolio:cms.freelancing.portfolio.filter(x=>x.id!==p.id)}})} className="text-rose text-center"><Trash2 size={13}/></button>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <h3 className="font-[600] text-[13px] mb-3">پکیج‌های قیمت</h3>
          <div className="space-y-2">
            {cms.freelancing.pricing.map((pr,i)=>(
              <div key={i} className="grid grid-cols-[1fr_100px_36px] gap-2 items-center text-[12.5px]">
                <input value={pr.name} onChange={e=>{ const a=[...cms.freelancing.pricing]; a[i]={...pr,name:e.target.value}; updateCms({freelancing:{...cms.freelancing,pricing:a}}); }} className="glass-input !py-[7px]" placeholder="نام پکیج" />
                <input type="number" value={pr.price} onChange={e=>{ const a=[...cms.freelancing.pricing]; a[i]={...pr,price:+e.target.value}; updateCms({freelancing:{...cms.freelancing,pricing:a}}); }} className="glass-input !py-[7px]" placeholder="قیمت" />
                <button onClick={()=>updateCms({freelancing:{...cms.freelancing,pricing:cms.freelancing.pricing.filter((_,j)=>j!==i)}})} className="text-rose text-center"><Trash2 size={13}/></button>
              </div>
            ))}
            <button onClick={()=>updateCms({freelancing:{...cms.freelancing,pricing:[...cms.freelancing.pricing,{name:'پکیج جدید',price:0}]}})} className="glass-btn !py-[6px] !px-2 text-[11px]"><Plus size={12}/> پکیج</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // TOOLS
  if(section==='tools'){
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-[700]">ابزارها — {cms.tools.items.length} عدد</h2>
          <button onClick={()=>updateCms({tools:{...cms.tools,items:[...cms.tools.items,{id:'tool'+Date.now(),title:{fa:'ابزار جدید',en:'New Tool'},description:{fa:'توضیح',en:'desc'},url:'/tools',category:'عمومی',isPro:false,enabled:true}]}})} className="glass-btn-primary !py-[8px] !px-3 text-[12px]"><Plus size={14}/> ابزار</button>
        </div>
        <div className="space-y-2">
          {cms.tools.items.map((tool,i)=>(
            <GlassCard key={tool.id} className="!p-3 text-[12.5px]">
              <div className="grid grid-cols-[1fr_1fr_80px_36px] gap-2 items-center">
                <input value={tool.title.fa} onChange={e=>{ const a=[...cms.tools.items]; a[i]={...tool,title:{...tool.title,fa:e.target.value}}; updateCms({tools:{...cms.tools,items:a}}); }} className="glass-input !py-[7px]" />
                <input value={tool.description.fa} onChange={e=>{ const a=[...cms.tools.items]; a[i]={...tool,description:{...tool.description,fa:e.target.value}}; updateCms({tools:{...cms.tools,items:a}}); }} className="glass-input !py-[7px]" />
                <input value={tool.category} onChange={e=>{ const a=[...cms.tools.items]; a[i]={...tool,category:e.target.value}; updateCms({tools:{...cms.tools,items:a}}); }} className="glass-input !py-[7px]" />
                <button onClick={()=>updateCms({tools:{...cms.tools,items:cms.tools.items.filter(x=>x.id!==tool.id)}})} className="text-rose text-center"><Trash2 size={14}/></button>
              </div>
              <div className="flex gap-3 mt-1 text-[11px]">
                <label className="flex items-center gap-1"><input type="checkbox" checked={tool.isPro} onChange={e=>{ const a=[...cms.tools.items]; a[i]={...tool,isPro:e.target.checked}; updateCms({tools:{...cms.tools,items:a}}); }}/> Pro</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={tool.enabled} onChange={e=>{ const a=[...cms.tools.items]; a[i]={...tool,enabled:e.target.checked}; updateCms({tools:{...cms.tools,items:a}}); }}/> فعال</label>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  // MESSAGES
  if(section==='messages'){
    const unread = cms.messages.filter(m=>!m.read);
    return (
      <div className="space-y-3">
        <h2 className="font-[700]">پیام‌ها — {cms.messages.length} عدد ({unread.length} خوانده نشده)</h2>
        {cms.messages.length === 0 ? (
          <GlassCard className="!p-6 text-center text-text-3 text-[13px]">پیامی وجود ندارد</GlassCard>
        ) : (
          <div className="space-y-2">
            {cms.messages.map((m,i)=>(
              <GlassCard key={m.id} className={`!p-4 text-[12.5px] ${!m.read ? 'bg-primary/5 border-primary/20' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-[600]">{m.name}</span>
                    <span className="text-text-3 ms-2">{m.email}</span>
                    {!m.read && <span className="w-2 h-2 bg-primary rounded-full inline-block ms-2" />}
                  </div>
                  <span className="text-[11px] text-text-3">{m.date}</span>
                </div>
                {m.message && <p className="text-text-2 mb-2">{m.message}</p>}
                <div className="flex gap-3">
                  {!m.read && <button onClick={()=>{ const arr=[...cms.messages]; arr[i]={...m,read:true}; updateCms({messages:arr}); }} className="text-primary text-[11px]">خواندم</button>}
                  <button onClick={()=>updateCms({messages:cms.messages.filter(x=>x.id!==m.id)})} className="text-rose text-[11px]">حذف</button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    );
  }

  // MEDIA
  if(section==='media'){
    return (
      <div className="space-y-3">
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-3">رسانه — موزیک</h2>
          <div className="flex items-center gap-3 mb-3 text-[12.5px]">
            <label className="flex items-center gap-2"><input type="checkbox" checked={cms.music.enabled} onChange={e=>updateCms({music:{...cms.music,enabled:e.target.checked}})} /> فعال</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={cms.music.autoplay} onChange={e=>updateCms({music:{...cms.music,autoplay:e.target.checked}})} /> Autoplay</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={cms.music.loop} onChange={e=>updateCms({music:{...cms.music,loop:e.target.checked}})} /> Loop</label>
            <span>Volume: {cms.music.volume}</span>
            <input type="range" min={0} max={1} step={0.1} value={cms.music.volume} onChange={e=>updateCms({music:{...cms.music,volume:+e.target.value}})} className="w-24" />
          </div>
          <div className="space-y-2">
            {cms.music.tracks.map((t,i)=>(
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 items-center text-[12.5px]">
                <input value={t.title} onChange={e=>{ const a=[...cms.music.tracks]; a[i]={...t,title:e.target.value}; updateCms({music:{...cms.music,tracks:a}}); }} className="glass-input !py-[7px]" placeholder="عنوان" />
                <input value={t.src} dir="ltr" onChange={e=>{ const a=[...cms.music.tracks]; a[i]={...t,src:e.target.value}; updateCms({music:{...cms.music,tracks:a}}); }} className="glass-input !py-[7px]" placeholder="src URL" />
                <input value={t.artist||''} onChange={e=>{ const a=[...cms.music.tracks]; a[i]={...t,artist:e.target.value}; updateCms({music:{...cms.music,tracks:a}}); }} className="glass-input !py-[7px]" placeholder="هنرمند" />
                <button onClick={()=>updateCms({music:{...cms.music,tracks:cms.music.tracks.filter((_,j)=>j!==i)}})} className="text-rose text-center"><Trash2 size={13}/></button>
              </div>
            ))}
            <button onClick={()=>updateCms({music:{...cms.music,tracks:[...cms.music.tracks,{title:'آهنگ جدید',src:'/music/new.mp3'}]}})} className="glass-btn !py-[7px] !px-3 text-[12px]"><Plus size={13}/> آهنگ</button>
          </div>
        </GlassCard>
        <GlassCard className="!p-5">
          <h3 className="font-[600] text-[13px] mb-3">Hero Object</h3>
          <div className="grid grid-cols-2 gap-3 text-[12.5px]">
            <div>
              <Field label="نوع">
                <select value={cms.heroObject.kind} onChange={e=>updateCms({heroObject:{...cms.heroObject,kind:e.target.value as any}})} className="glass-input !py-[8px]">
                  <option value="none">هیچ</option><option value="image">تصویر</option><option value="model3d">مدل ۳D</option><option value="video">ویدیو</option>
                </select>
              </Field>
            </div>
            <Field label="SRC"><Input value={cms.heroObject.src} dir="ltr" onChange={e=>updateCms({heroObject:{...cms.heroObject,src:e.target.value}})} /></Field>
            <Field label="Alt"><Input value={cms.heroObject.alt} onChange={e=>updateCms({heroObject:{...cms.heroObject,alt:e.target.value}})} /></Field>
            <label className="flex items-center gap-2 text-[12px] mt-5"><input type="checkbox" checked={cms.heroObject.autoRotate} onChange={e=>updateCms({heroObject:{...cms.heroObject,autoRotate:e.target.checked}})} /> Auto Rotate</label>
          </div>
        </GlassCard>
      </div>
    );
  }

  // LEAD MAGNET
  if(section==='leadmagnet'){
    return (
      <div className="space-y-3">
        <GlassCard className="!p-5">
          <h2 className="font-[700] mb-3">Lead Magnet</h2>
          <p className="text-[12.5px] text-text-2 mb-4">فایل‌های PDF رایگان برای جذب ایمیل کاربران</p>
          <div className="space-y-3">
            {[
              {t:'۱۰ عادت موفقیت',d:'PDF — ۱۲ صفحه',active:true},
              {t:'قالب برنامه‌ریزی هفتگی',d:'PDF — قابل چاپ',active:true},
              {t:'چک‌لیست سال نو',d:'PDF — ۸ صفحه',active:false},
            ].map((item,i)=>(
              <div key={i} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-[10px] border border-glass-border text-[12.5px]">
                <div>
                  <div className="font-[600]">{item.t}</div>
                  <div className="text-text-3 text-[11px]">{item.d}</div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" defaultChecked={item.active} /> فعال</label>
                  <button className="text-primary text-[11px] hover:underline">آپلود فایل</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[11.5px] text-text-3">آمار: ۲۳۴ دانلود — ۱۸۷ ایمیل جمع‌آوری شده — نرخ تبدیل ۷۸٪</div>
        </GlassCard>
        <GlassCard className="!p-5">
          <h3 className="font-[600] text-[13px] mb-2">_exit Popup</h3>
          <div className="text-[12.5px] text-text-2">
            <label className="flex items-center gap-2 mb-2"><input type="checkbox" defaultChecked /> فعال‌سازی Exit Intent Popup</label>
            <p>وقتی کاربر ماوس را به بالای صفحه می‌برد، پاپ‌آپ نمایش داده می‌شود.</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  // fallback
  return (
    <GlassCard className="!p-6">
      <h2 className="text-[16px] font-[700] mb-2">
        بخش: {SECTIONS.find(s=>s.key===section)?.fa}
      </h2>
      <p className="text-text-2 text-[13px] leading-relaxed">
        این بخش از CMS خوانده می‌شود و با Export/Import JSON قابل مدیریت است.
      </p>
      <div className="mt-4">
        <Link href="/" className="text-primary text-[12.5px] hover:underline">→ مشاهده زنده در سایت</Link>
      </div>
    </GlassCard>
  );
}
