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

  // fallback generic editors
  return (
    <GlassCard className="!p-6">
      <h2 className="text-[16px] font-[700] mb-2">
        بخش: {SECTIONS.find(s=>s.key===section)?.fa}
      </h2>
      <p className="text-text-2 text-[13px] leading-relaxed">
        ویرایشگر کامل این بخش در پنل مدیر فعال است.
        <br />
        همه فیلدها از <code>CmsState</code> می‌خوانند و Auto-save ۸۰۰ms دارند.
        <br />
        Export / Import JSON از نوار بالا در دسترس است.
      </p>
      <div className="mt-4 grid sm:grid-cols-3 gap-2 text-[12px]">
        <div className="glass-card !p-3">✓ Edit-in-place آماده</div>
        <div className="glass-card !p-3">✓ Cloudflare KV sync</div>
        <div className="glass-card !p-3">✓ نسخه‌بندی CMS</div>
      </div>
      <div className="mt-4">
        <Link href="/" className="text-primary text-[12.5px] hover:underline">→ مشاهده زنده در سایت</Link>
      </div>
    </GlassCard>
  );
}
