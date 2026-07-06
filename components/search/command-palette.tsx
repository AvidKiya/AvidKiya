'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCms } from '@/lib/cms/cms-context';
import { motion, AnimatePresence } from 'framer-motion';

const staticItems = [
  { labelFa: 'خانه', labelEn: 'Home', href: '/', keywords: 'home خانه' },
  { labelFa: 'پروژه‌ها', labelEn: 'Projects', href: '/projects', keywords: 'project پروژه' },
  { labelFa: 'KIYA Planner', labelEn: 'KIYA Planner', href: '/planner', keywords: 'kiya planner مغز' },
  { labelFa: 'فروشگاه', labelEn: 'Shop', href: '/shop', keywords: 'shop فروشگاه' },
  { labelFa: 'خدمات', labelEn: 'Services', href: '/services', keywords: 'service خدمات' },
  { labelFa: 'ابزارها', labelEn: 'Tools', href: '/tools', keywords: 'tools ابزار' },
  { labelFa: 'بلاگ', labelEn: 'Blog', href: '/blog', keywords: 'blog بلاگ مقاله' },
  { labelFa: 'درباره', labelEn: 'About', href: '/about', keywords: 'about درباره' },
  { labelFa: 'رزومه', labelEn: 'Resume', href: '/resume', keywords: 'resume رزومه' },
  { labelFa: 'تماس', labelEn: 'Contact', href: '/contact', keywords: 'contact تماس' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();
  const { lang, t } = useCms();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o=>!o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    if (!q) return staticItems;
    const qq = q.toLowerCase();
    return staticItems.filter(i =>
      (i.labelFa + i.labelEn + i.keywords + i.href).toLowerCase().includes(qq)
    );
  }, [q]);

  if (!open) return (
    <button
      onClick={()=>setOpen(true)}
      className="hidden md:flex items-center gap-2 text-xs text-text-3 glass-card !px-3 !py-1.5 ml-2"
      title="⌘K"
    >
      <span>⌘K</span>
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={()=>setOpen(false)}
          />
          <motion.div
            initial={{opacity:0, scale:.98, y:-10}}
            animate={{opacity:1, scale:1, y:0}}
            exit={{opacity:0, scale:.98, y:-10}}
            className="fixed top-[18%] left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-[101] glass-card !p-0 overflow-hidden shadow-glass-lg"
          >
            <input
              autoFocus
              placeholder={t('جستجو… ⌘K','Search… ⌘K')}
              value={q}
              onChange={e=>setQ(e.target.value)}
              className="w-full bg-transparent outline-none px-5 py-4 text-[15px] border-b border-glass-border"
            />
            <div className="max-h-[380px] overflow-auto py-2">
              {results.length === 0 && (
                <div className="px-5 py-6 text-center text-text-3 text-sm">نتیجه‌ای پیدا نشد</div>
              )}
              {results.map(item => (
                <button
                  key={item.href}
                  onClick={() => { router.push(item.href); setOpen(false); }}
                  className="w-full text-start px-5 py-3 hover:bg-white/[0.05] transition text-[14px] flex justify-between"
                >
                  <span>{lang==='fa'?item.labelFa:item.labelEn}</span>
                  <span className="text-text-3 text-xs">{item.href}</span>
                </button>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-glass-border text-[11px] text-text-3 flex justify-between">
              <span>↑↓ حرکت — Enter انتخاب — Esc بستن</span>
              <span>AvidKiya ⌘K</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
