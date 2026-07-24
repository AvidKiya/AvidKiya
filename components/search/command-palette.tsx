'use client';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCms } from '@/lib/cms/cms-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ArrowUpRight, Command } from 'lucide-react';
import { AppIcon, type IconName } from '@/components/ui/icons';

type Item = {
  id: string;
  labelFa: string;
  labelEn: string;
  href: string;
  keywords: string;
  icon: IconName;
  cat: string;
};

const items: Item[] = [
  { id:'home', labelFa:'خانه', labelEn:'Home', href:'/', keywords:'home خانه اصلی پرتفولیو', icon:'home', cat:'navigate' },
  { id:'projects', labelFa:'نمونه‌کارها', labelEn:'Projects', href:'/projects', keywords:'project پروژه نمونه‌کار کد github case study', icon:'projects', cat:'navigate' },
  { id:'services', labelFa:'خدمات', labelEn:'Services', href:'/services', keywords:'service خدمات فریلنس طراحی توسعه وب ai', icon:'services', cat:'commerce' },
  { id:'tools', labelFa:'ابزارها', labelEn:'Tools', href:'/tools', keywords:'tools ابزار آنلاین json password slug متن', icon:'tools', cat:'app' },
  { id:'shop', labelFa:'فروشگاه', labelEn:'Shop', href:'/shop', keywords:'shop فروشگاه محصول قالب کیت آموزش', icon:'shop', cat:'commerce' },
  { id:'blog', labelFa:'بلاگ', labelEn:'Blog', href:'/blog', keywords:'blog بلاگ مقاله معماری ai ui', icon:'book', cat:'content' },
  { id:'about', labelFa:'درباره', labelEn:'About', href:'/about', keywords:'about درباره من برند', icon:'about', cat:'navigate' },
  { id:'resume', labelFa:'رزومه', labelEn:'Resume', href:'/resume', keywords:'resume رزومه cv pdf', icon:'resume', cat:'navigate' },
  { id:'contact', labelFa:'تماس', labelEn:'Contact', href:'/contact', keywords:'contact تماس ایمیل همکاری پروژه', icon:'contact', cat:'navigate' },
  { id:'comments', labelFa:'نظرات', labelEn:'Reviews', href:'/comments', keywords:'comments نظرات review testimonial', icon:'comments', cat:'content' },
  { id:'pricing', labelFa:'تعرفه خدمات', labelEn:'Service Pricing', href:'/pricing', keywords:'pricing قیمت تعرفه خدمات', icon:'chart', cat:'commerce' },
  { id:'help', labelFa:'مرکز راهنما', labelEn:'Help Center', href:'/help', keywords:'help راهنما support', icon:'book', cat:'support' },
];

const catLabels: Record<string, {fa:string; en:string}> = {
  navigate: {fa:'ناوبری', en:'Navigate'},
  app: {fa:'اپلیکیشن', en:'Apps'},
  commerce: {fa:'فروش', en:'Commerce'},
  content: {fa:'محتوا', en:'Content'},
  support: {fa:'پشتیبانی', en:'Support'},
  recent: {fa:'اخیر', en:'Recent'},
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const { lang, t } = useCms();
  const inputRef = useRef<HTMLInputElement>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try { const r = localStorage.getItem('ak_cmd_recent'); if(r) setRecent(JSON.parse(r)); } catch {}
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o=>!o); }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(()=>{ if(open) setTimeout(()=>inputRef.current?.focus(), 40); else { setQ(''); setSel(0);} }, [open]);

  const results = useMemo(() => {
    if (!q) {
      const recItems = recent.map(id => items.find(i=>i.id===id)).filter(Boolean) as Item[];
      return recItems.length ? [{_group:'recent', items: recItems}] : [];
    }
    const qq = q.toLowerCase();
    const filtered = items.filter(i =>
      (i.labelFa + ' ' + i.labelEn + ' ' + i.keywords + ' ' + i.href).toLowerCase().includes(qq)
    );
    // group by cat
    const groups = filtered.reduce((acc, it) => {
      (acc[it.cat] = acc[it.cat] || []).push(it);
      return acc;
    }, {} as Record<string, Item[]>);
    return Object.entries(groups).map(([cat, its]) => ({_group: cat, items: its}));
  }, [q, recent]);

  // flatten for keyboard nav
  const flat = useMemo(() => q ? results.flatMap(g=>g.items) : (results[0]?.items || items.slice(0,6)), [results, q]);

  const go = useCallback((it: Item) => {
    const nr = [it.id, ...recent.filter(r=>r!==it.id)].slice(0,5);
    setRecent(nr);
    try { localStorage.setItem('ak_cmd_recent', JSON.stringify(nr)); } catch {}
    setOpen(false);
    router.push(it.href);
  }, [recent, router]);

  useEffect(() => {
    if (!open) return;
    const onNav = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, flat.length-1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const it = flat[sel];
        if (it) go(it);
      }
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onNav);
    return () => window.removeEventListener('keydown', onNav);
  }, [open, flat, sel, go]);

  return (
    <>
      <button
        onClick={()=>setOpen(true)}
        className="hidden md:flex items-center gap-[10px] text-[12px] text-text-3 glass-card !px-[12px] !py-[8px] hover:text-text-2 transition-colors min-w-[190px] justify-between"
        aria-label="Search"
      >
        <span className="flex items-center gap-[7px]"><Search size={14} /> {t('جستجو…','Search…')}</span>
        <span className="kbd !text-[10px] !px-[6px] !py-[2px] flex items-center gap-0.5"><Command size={10}/>K</span>
      </button>
      {/* mobile trigger */}
      <button onClick={()=>setOpen(true)} className="md:hidden glass-btn !p-[9px]" aria-label="Search">
        <Search size={16}/>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/45 backdrop-blur-[6px] z-[120]"
              onClick={()=>setOpen(false)}
            />
            <motion.div
              initial={{opacity:0, scale:.985, y:-8}}
              animate={{opacity:1, scale:1, y:0}}
              exit={{opacity:0, scale:.985, y:-8}}
              transition={{ duration:0.18, ease:[0.4,0,0.2,1] }}
              className="fixed top-[12%] md:top-[16%] inset-x-3 md:left-1/2 md:-translate-x-1/2 md:w-[700px] md:max-w-[92vw] z-[130] glass-card !p-0 overflow-hidden"
              style={{ boxShadow: '0 30px 90px rgba(0,0,0,0.45), inset 0 1px 0 var(--glass-highlight)' }}
              dir={lang==='fa'?'rtl':'ltr'}
              onClick={e=>e.stopPropagation()}
            >
              {/* search input — iPhone style */}
              <div className="flex items-center gap-3 px-4 md:px-5 py-[14px] border-b border-glass-border">
                <Search size={18} className="text-text-3 shrink-0" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={e=>{setQ(e.target.value); setSel(0);}}
                  placeholder={t('جستجو در سایت، ابزارها، مقالات…','Search site, tools, articles…')}
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-text-3"
                />
                <span className="hidden sm:flex items-center gap-1 text-[10.5px] text-text-3">
                  <span className="kbd">ESC</span>
                </span>
              </div>

              <div className="max-h-[460px] overflow-auto overscroll-contain py-[6px]">
                {!q && results.length===0 && (
                  <div className="px-4 py-3">
                    <div className="text-[11px] text-text-3 uppercase tracking-wider mb-2 px-1">{t('پیشنهادی','Suggested')}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {items.slice(0,6).map((it, i)=>(
                        <button
                          key={it.id}
                          onClick={()=>go(it)}
                          className={`text-start rounded-[14px] p-3 transition border ${i===sel ? 'bg-white/[0.055] border-primary/30' : 'border-transparent hover:bg-white/[0.032]'}`}
                        >
                          <AppIcon name={it.icon} size={18} className="text-text-2 mb-[7px]" />
                          <div className="text-[13px] font-[600]">{lang==='fa'?it.labelFa:it.labelEn}</div>
                          <div className="text-[11px] text-text-3">{it.href}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {q && flat.length===0 && (
                  <div className="px-5 py-10 text-center text-text-3 text-[13px]">
                    نتیجه‌ای برای «{q}» پیدا نشد
                  </div>
                )}

                {(q ? results : results).map((group:any, gi:number) => (
                  <div key={group._group} className="py-1">
                    <div className="px-4 md:px-5 py-[6px] text-[10.5px] uppercase tracking-wider text-text-3 flex items-center gap-2">
                      {group._group==='recent' && <Clock size={11} />}
                      {catLabels[group._group] ? (lang==='fa'?catLabels[group._group].fa:catLabels[group._group].en) : group._group}
                    </div>
                    {group.items.map((it: Item) => {
                      const idx = flat.indexOf(it);
                      const active = idx === sel;
                      return (
                        <button
                          key={it.id}
                          onMouseEnter={()=>setSel(idx)}
                          onClick={()=>go(it)}
                          className={`w-full flex items-center gap-3 px-4 md:px-5 py-[11px] text-start transition ${
                            active ? 'bg-white/[0.050]' : 'hover:bg-white/[0.028]'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 ${active ? 'bg-primary/12 text-primary' : 'bg-white/[0.035] text-text-2'}`}>
                            <AppIcon name={it.icon} size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13.5px] font-[500] truncate">{lang==='fa'?it.labelFa:it.labelEn}</div>
                            <div className="text-[11px] text-text-3 truncate">{it.href} • {it.keywords.split(' ').slice(0,3).join(' ')}</div>
                          </div>
                          <ArrowUpRight size={14} className={`shrink-0 transition ${active ? 'text-text-2 opacity-100' : 'opacity-35'}`} />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="px-3 md:px-4 py-[9px] border-t border-glass-border text-[10.5px] md:text-[11px] text-text-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><span className="kbd">↑↓</span> حرکت</span>
                  <span className="flex items-center gap-1"><span className="kbd">↵</span> انتخاب</span>
                  <span className="flex items-center gap-1"><span className="kbd">ESC</span> بستن</span>
                </div>
                <div className="flex items-center gap-1 opacity-90">
                  <span className="font-[600]">KIYA</span>
                  <span>⌘K</span>
                  <span className="w-[5px] h-[5px] rounded-full bg-emerald animate-pulse ms-1"></span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
