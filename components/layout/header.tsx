'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCms } from '@/lib/cms/cms-context';
import { Menu, X, Sun, Moon, Globe, Search } from 'lucide-react';
import { useState } from 'react';
import { CommandPalette } from '@/components/search/command-palette';

const nav = [
  { href: '/', labelFa: 'خانه', labelEn: 'Home' },
  { href: '/projects', labelFa: 'نمونه‌کارها', labelEn: 'Projects' },
  { href: '/services', labelFa: 'خدمات', labelEn: 'Services' },
  { href: '/tools', labelFa: 'ابزارها', labelEn: 'Tools' },
  { href: '/shop', labelFa: 'فروشگاه', labelEn: 'Shop' },
  { href: '/resume', labelFa: 'رزومه', labelEn: 'Resume' },
  { href: '/about', labelFa: 'درباره', labelEn: 'About' },
  { href: '/contact', labelFa: 'تماس', labelEn: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { lang, toggleTheme, theme, toggleLang, isRTL, cms, tf } = useCms();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-glass-border" style={{background:'color-mix(in oklab, rgb(var(--bg)) 84%, transparent)'}}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-[62px] flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-[10px] font-[700] shrink-0">
          <div className="w-9 h-9 rounded-[13px] flex items-center justify-center glass-card !p-0">
            <span className="text-primary font-black text-[15px]">{cms.brand.logoLetter || 'A'}</span>
          </div>
          <span className="hidden sm:block text-[14.5px] tracking-[-0.01em] whitespace-nowrap">
            {tf(cms.identity.fullName)}
          </span>
        </Link>

        {/* Desktop TabBar - iOS pill */}
        <nav className="hidden lg:flex items-center">
          <div className="glass-card !p-1.5 flex items-center gap-1 rounded-full">
            {nav.map(item => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className="tab-pill relative text-text-2 hover:text-text transition-colors">
                  {active && (
                    <motion.div
                      layoutId="tab-pill"
                      className="tab-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 px-1">{lang==='fa' ? item.labelFa : item.labelEn}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block"><CommandPalette /></div>
          <button onClick={toggleLang} className="glass-btn !px-3 !py-2 text-xs flex items-center gap-1.5" aria-label="Toggle language">
            <Globe size={15} />
            <span className="hidden sm:inline">{lang === 'fa' ? 'EN' : 'فا'}</span>
          </button>
          <button onClick={toggleTheme} className="glass-btn !px-3 !py-2" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
          <button className="lg:hidden glass-btn !px-3 !py-2" onClick={()=>setOpen(o=>!o)} aria-label="Menu">
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity:0, y:-8 }}
          animate={{ opacity:1, y:0 }}
          className={`lg:hidden border-t border-glass-border px-4 py-3 bg-[rgb(var(--bg))]/95 backdrop-blur-xl ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ [isRTL ? 'right' : 'left']: 0 } as any}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {nav.map(n => (
              <Link key={n.href} href={n.href} onClick={()=>setOpen(false)} className={`glass-card !p-3 text-sm text-center ${pathname===n.href ? 'ring-1 ring-primary/40' : ''}`}>
                {lang==='fa' ? n.labelFa : n.labelEn}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
