'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { useState, useMemo } from 'react';
import { AppIcon } from '@/components/ui/icons';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function ToolsClient(){
  const { cms, tf, t } = useCms();
  const tools = cms.tools.items.filter(x=>x.enabled);
  const cats = ['همه', ...cms.tools.categories];
  const [cat, setCat] = useState('همه');
  const [q, setQ] = useState('');
  const [proOnly, setProOnly] = useState(false);

  const list = useMemo(()=> tools.filter(x=>
    (cat==='همه' || x.category===cat) &&
    (!proOnly || x.isPro) &&
    (!q || tf(x.title).toLowerCase().includes(q.toLowerCase()) || tf(x.description).toLowerCase().includes(q.toLowerCase()))
  ), [tools, cat, proOnly, q, tf]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-7 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[26px] md:text-[30px] font-[800] tracking-[-0.015em] flex items-center gap-2">
            <AppIcon name="tools" size={24} className="text-amber" />
            {t('ابزارهای آنلاین','Online Tools')}
          </h1>
          <p className="text-text-2 text-[13px] mt-1">رایگان • سریع • حریم‌محور • بدون ثبت‌نام</p>
        </div>
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder={t('جستجوی ابزار…','Search tools…')}
          className="glass-input !w-full sm:!w-[260px] !py-[9px] text-[13px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5 text-[12.5px]">
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            className={`px-3 py-[7px] rounded-full border transition ${cat===c ? 'bg-primary text-[#052e28] border-primary font-[600]' : 'glass-card !px-3 !py-[7px] text-text-2'}`}>
            {c}
          </button>
        ))}
        <label className="ms-auto flex items-center gap-2 text-[12px] text-text-2 cursor-pointer">
          <input type="checkbox" checked={proOnly} onChange={e=>setProOnly(e.target.checked)} />
          فقط Pro
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {list.map(tool=>(
          <GlassCard key={tool.id} className="!p-4 flex flex-col group hover:shadow-glass-lg transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="font-[700] text-[14px]">{tf(tool.title)}</div>
              {tool.isPro && <span className="text-[10px] px-[8px] py-[3px] rounded-full bg-amber/12 text-amber font-[600]">PRO</span>}
            </div>
            <div className="text-[12.5px] text-text-2 leading-relaxed flex-1">{tf(tool.description)}</div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-glass-border text-[11.5px] text-text-3">
              <span>{tool.category}</span>
              <Link href={tool.url} className="text-primary flex items-center gap-1 hover:underline">
                باز کردن <ExternalLink size={12} />
              </Link>
            </div>
          </GlassCard>
        ))}
        {/* built-in tools */}
        {[
          {id:'date', title:{fa:'تبدیل تاریخ',en:'Date Converter'}, desc:{fa:'شمسی ↔ میلادی ↔ شاهنشاهی',en:'Jalali ↔ Gregorian'}, cat:'توسعه'},
          {id:'json', title:{fa:'فرمت JSON',en:'JSON Formatter'}, desc:{fa:'pretty / minify / validate',en:'pretty / minify'}, cat:'توسعه'},
          {id:'img', title:{fa:'فشرده‌ساز تصویر',en:'Image Compressor'}, desc:{fa:'client-side • <300KB',en:'client-side'}, cat:'تصویر'},
          {id:'pass', title:{fa:'سازنده رمز',en:'Password Gen'}, desc:{fa:'رمز قوی تصادفی',en:'strong random'}, cat:'امنیت'},
        ].filter(x=> cat==='همه' || x.cat===cat).map(x=>(
          <GlassCard key={x.id} className="!p-4">
            <div className="font-[700] text-[14px] mb-1">{tf(x.title)}</div>
            <div className="text-[12.5px] text-text-2 mb-3">{tf(x.desc)}</div>
            <button className="glass-btn !py-[8px] !px-4 text-[12px] w-full">اجرای آنلاین</button>
          </GlassCard>
        ))}
      </div>

      {list.length===0 && (
        <div className="text-center text-text-3 py-12 text-[13px]">ابزاری پیدا نشد</div>
      )}
    </div>
  );
}
