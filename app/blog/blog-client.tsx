'use client';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass';
import { useState, useMemo } from 'react';

const POSTS = [
  {slug:'second-brain-kiya', title:'مغز دوم چیست و چطور برای خودمان سیستم دانش بسازیم؟', excerpt:'از PARA تا AI — چگونه حافظه خارجی بسازیم که واقعا کار کند', cat:'AI', date:'۱۴۰۴/۱۰/۰۵', read:'7 دقیقه', featured:true},
  {slug:'nextjs-cloudflare-edge', title:'Next.js 15 روی Cloudflare Edge — راهنمای کامل', excerpt:'کاهش هزینه ۱۰۰٪، افزایش سرعت ۳برابر — تجربه واقعی DevHub OS', cat:'معماری', date:'۱۴۰۴/۰۹/۲۸', read:'12 دقیقه', featured:true},
  {slug:'liquid-glass-ui', title:'طراحی Liquid Glass — از iOS تا وب', excerpt:'backdrop-filter، لایه‌های شیشه‌ای، و انیمیشن spring', cat:'UI/UX', date:'۱۴۰۴/۰۹/۲۰', read:'6 دقیقه', featured:false},
  {slug:'persian-calendar-algorithm', title:'الگوریتم تقویم هخامنشی در جاوااسکریپت', excerpt:'تبدیل میلادی ↔ شمسی ↔ شاهنشاهی + جشن‌ها', cat:'الگوریتم', date:'۱۴۰۴/۰۹/۱۲', read:'9 دقیقه', featured:false},
  {slug:'ai-agent-memory', title:'ساخت AI Agent با حافظه بلندمدت', excerpt:'Memory Graph، Quick Capture، و RAG شخصی', cat:'AI', date:'۱۴۰۴/۰۹/۰۵', read:'11 دقیقه', featured:false},
  {slug:'freelance-pricing', title:'قیمت‌گذاری فریلنسری ۲۰۲۵ — تجربه ۸ ساله', excerpt:'Anchor, Decoy, Value-based — اعداد واقعی', cat:'کسب‌وکار', date:'۱۴۰۴/۰۸/۲۸', read:'8 دقیقه', featured:false},
];

const cats = ['همه','معماری','UI/UX','AI','الگوریتم','کسب‌وکار'];

export default function BlogClient(){
  const [cat, setCat] = useState('همه');
  const [q, setQ] = useState('');
  const list = useMemo(()=> POSTS.filter(p=> (cat==='همه'||p.cat===cat) && (!q || (p.title+p.excerpt).toLowerCase().includes(q.toLowerCase()))), [cat,q]);
  const featured = list.filter(p=>p.featured);
  const rest = list.filter(p=>!p.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-7 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-[800] tracking-[-0.015em]">بلاگ اَوید کیا</h1>
          <p className="text-text-2 text-[13.5px] mt-1">معماری سیستم • AI • طراحی • رشد — هفته‌ای یک مقاله عمیق</p>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجوی مقالات…" className="glass-input !w-full sm:!w-[260px] !py-[9px] text-[13px]" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 text-[12.5px]">
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-3 py-[7px] rounded-full border transition ${cat===c ? 'bg-primary text-[#052e28] border-primary font-[600]' : 'glass-card !px-3 !py-[7px] text-text-2'}`}>{c}</button>
        ))}
      </div>

      {featured.length>0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {featured.map(p=>(
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
              <GlassCard className="!p-5 h-full hover:shadow-glass-lg transition-all">
                <div className="text-[11px] text-primary font-[600] mb-1">{p.cat} • Featured</div>
                <div className="text-[17px] md:text-[18px] font-[750] mb-2 leading-snug group-hover:text-primary transition-colors">{p.title}</div>
                <div className="text-[13px] text-text-2 leading-relaxed mb-3">{p.excerpt}</div>
                <div className="text-[11px] text-text-3 flex gap-3"><span>{p.date}</span><span>•</span><span>{p.read}</span></div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map(p=>(
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
            <GlassCard className="!p-4 h-full">
              <div className="text-[10.5px] text-text-3 mb-1">{p.cat}</div>
              <div className="font-[700] text-[14.5px] mb-2 leading-snug group-hover:text-primary transition-colors">{p.title}</div>
              <div className="text-[12.5px] text-text-2 leading-relaxed mb-3">{p.excerpt}</div>
              <div className="text-[11px] text-text-3">{p.date} • {p.read}</div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {list.length===0 && <div className="text-center text-text-3 py-14 text-[13px]">مقاله‌ای پیدا نشد</div>}

      {/* newsletter */}
      <GlassCard className="max-w-2xl mx-auto mt-12 !p-6 text-center">
        <div className="text-[15px] font-[700] mb-1">خبرنامه DevHub</div>
        <div className="text-[12.5px] text-text-2 mb-3">هر هفته یک مقاله عمیق + یک ابزار رایگان</div>
        <form onSubmit={e=>{e.preventDefault(); alert('ثبت شد!')}} className="flex gap-2 max-w-md mx-auto">
          <input required type="email" placeholder="ایمیل شما…" className="glass-input flex-1 !py-[10px] text-[13px]" dir="ltr" />
          <button className="glass-btn-primary !px-5 text-[13px]">عضویت</button>
        </form>
        <div className="text-[11px] text-text-3 mt-2">۴۸۰+ مشترک • لغو آنی • بدون اسپم</div>
      </GlassCard>
    </div>
  );
}
