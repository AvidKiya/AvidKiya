'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import Icon, { GitHubIcon } from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

const NAV_ITEMS = [
  { key: 'home', href: '/', icon: 'home' },
  { key: 'projects', href: '/projects', icon: 'code' },
  { key: 'about', href: '/about', icon: 'info' },
  { key: 'resume', href: '/resume', icon: 'file-text' },
  { key: 'gifts', href: '/gifts', icon: 'gift' },
  { key: 'announcements', href: '/announcements', icon: 'bell' },
  { key: 'comments', href: '/comments', icon: 'message-square' },
  { key: 'shop', href: '/shop', icon: 'shopping-bag' },
];

export default function TopNav() {
  const { lang, theme, toggleLang, toggleTheme, cms } = useApp();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const isHome = pathname === '/';

  const drawerSide = lang === 'fa' ? 'right' : 'left';

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 no-print">
        <div className="glass-card-strong mx-2 mt-2 px-4 py-2 flex items-center gap-3" style={{ borderRadius: 14 }}>
          {/* Burger */}
          <button onClick={() => setDrawerOpen(true)} className="p-1.5 rounded-lg hover:bg-primary/10 transition" aria-label="Menu">
            <Icon name="menu" size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-lg">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-black">
              {cms.brand.logoLetter}
            </span>
            <span className="hidden sm:inline gradient-text">{lang === 'fa' ? cms.brand.brandName.fa : cms.brand.brandName.en}</span>
          </Link>

          {/* Center tabs (only on home, desktop) */}
          {isHome && (
            <nav className="hidden lg:flex flex-1 justify-center">
              <div className="glass-card flex items-center gap-1 px-2 py-1" style={{ borderRadius: 12 }}>
                {NAV_ITEMS.map(item => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.key} href={item.href}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        active ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-primary/5'
                      }`}>
                      {tl(item.key, lang)}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}

          <div className="flex-1" />

          {/* Switcher */}
          <div className="relative">
            <button onClick={() => setSwitcherOpen(!switcherOpen)}
              className="p-1.5 rounded-lg hover:bg-primary/10 transition flex items-center gap-1 text-sm">
              <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={16} />
              <Icon name="globe" size={16} />
            </button>
            {switcherOpen && (
              <div className="absolute top-full mt-2 glass-card-strong p-2 min-w-[140px] z-50"
                style={{ [lang === 'fa' ? 'right' : 'left']: 0, borderRadius: 12 }}>
                <button onClick={() => { toggleTheme(); setSwitcherOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 text-sm">
                  <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
                  <span>{theme === 'dark' ? (lang === 'fa' ? 'تم روز' : 'Light') : (lang === 'fa' ? 'تم شب' : 'Dark')}</span>
                </button>
                <button onClick={() => { toggleLang(); setSwitcherOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 text-sm">
                  <Icon name="globe" size={14} />
                  <span>{lang === 'fa' ? 'English' : 'فارسی'}</span>
                </button>
              </div>
            )}
          </div>

          {/* GitHub */}
          {cms.socials.find(s => s.platform === 'github')?.url && (
            <a href={cms.socials.find(s => s.platform === 'github')?.url}
              target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-primary/10 transition">
              <GitHubIcon size={18} />
            </a>
          )}
        </div>
      </header>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] flex" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={`relative w-72 max-w-[80vw] h-full bg-bg-card-solid overflow-y-auto ${drawerSide === 'right' ? 'ms-auto' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Mac dots */}
            <div className="flex items-center gap-2 p-4 border-b border-border-theme">
              <span className="mac-dot mac-dot-red" />
              <span className="mac-dot mac-dot-yellow" />
              <span className="mac-dot mac-dot-green" />
              <div className="flex-1" />
              <button onClick={() => setDrawerOpen(false)}><Icon name="x" size={18} /></button>
            </div>

            {/* Nav links */}
            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map(item => {
                const active = pathname === item.href;
                return (
                  <Link key={item.key} href={item.href} onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                      active ? 'bg-primary/15 text-primary font-bold' : 'hover:bg-primary/5'
                    }`}>
                    <Icon name={item.icon} size={16} />
                    <span>{tl(item.key, lang)}</span>
                  </Link>
                );
              })}
              <Link href="/admin" onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm hover:bg-primary/5 mt-4 border-t border-border-theme pt-4">
                <Icon name="settings" size={16} />
                <span>{tl('admin', lang)}</span>
              </Link>
            </nav>

            {/* Print Resume button */}
            <div className="px-4 mb-4">
              <button onClick={() => { window.print(); setDrawerOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition">
                <Icon name="printer" size={14} />
                {tl('printResume', lang)}
              </button>
            </div>

            {/* Socials */}
            <div className="px-4 pb-4 flex items-center gap-3">
              {cms.socials.filter(s => s.visible).map(s => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-primary/10 transition">
                  {s.platform === 'github' ? <GitHubIcon size={16} /> : <Icon name={s.icon || 'link'} size={16} />}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click-away for switcher */}
      {switcherOpen && <div className="fixed inset-0 z-40" onClick={() => setSwitcherOpen(false)} />}
    </>
  );
}
