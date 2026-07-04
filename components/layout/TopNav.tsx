'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp, useCms } from '@/contexts/AppContext';
import { Logo } from '@/components/ui/Logo';
import { Icon, GitHubIcon, getPlatformIcon } from '@/components/ui/Icon';

interface NavTab {
  href: string;
  labelFa: string;
  labelEn: string;
  icon: string;
}

const tabs: NavTab[] = [
  { href: '/', labelFa: 'خانه', labelEn: 'Home', icon: 'home' },
  { href: '/projects', labelFa: 'پروژه‌ها', labelEn: 'Projects', icon: 'briefcase' },
  { href: '/about', labelFa: 'درباره', labelEn: 'About', icon: 'user' },
  { href: '/resume', labelFa: 'رزومه', labelEn: 'Resume', icon: 'file-text' },
  { href: '/gifts', labelFa: 'هدیه‌ها', labelEn: 'Gifts', icon: 'gift' },
  { href: '/announcements', labelFa: 'اعلانات', labelEn: 'Announcements', icon: 'bell' },
  { href: '/comments', labelFa: 'نظرات', labelEn: 'Comments', icon: 'message-square' },
  { href: '/shop', labelFa: 'فروشگاه', labelEn: 'Shop', icon: 'shopping-bag' }
];

export function TopNav() {
  const pathname = usePathname();
  const { language, setLanguage, theme, setTheme, dir, isAdmin } = useApp();
  const { cms, t } = useCms();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  const isRTL = dir === 'rtl';
  
  // Update tab indicator position
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.href === pathname);
    if (activeIndex >= 0 && tabsRef.current[activeIndex]) {
      const tab = tabsRef.current[activeIndex];
      if (tab) {
        setIndicatorStyle({
          left: tab.offsetLeft,
          width: tab.offsetWidth
        });
      }
    }
  }, [pathname]);

  // Close switcher on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Handle print resume
  const handlePrintResume = () => {
    window.open('/resume?print=true', '_blank');
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]" />
        
        <nav className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger - Only Mobile */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="Open menu"
            >
              <Icon name="menu" size={24} />
            </button>
            
            <Link href="/" className="flex items-center">
              <Logo size="md" showText={true} />
            </Link>
          </div>
          
          {/* Center: Tab Bar - Desktop Only */}
          <div className="hidden lg:flex items-center">
            <div className="relative flex items-center gap-1 p-1.5 rounded-2xl glass-card">
              {/* Animated Indicator */}
              <div
                className="absolute h-[calc(100%-12px)] rounded-xl gradient-bg transition-all duration-300 ease-out"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  top: '6px'
                }}
              />
              
              {tabs.map((tab, index) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    ref={el => { tabsRef.current[index] = el; }}
                    className={`relative z-10 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {language === 'fa' ? tab.labelFa : tab.labelEn}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Right: Switcher + GitHub */}
          <div className="flex items-center gap-2">
            {/* Language/Theme Switcher */}
            <div ref={switcherRef} className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors"
              >
                <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={18} />
                <span className="text-sm font-medium hidden sm:inline">
                  {language === 'fa' ? 'فا' : 'EN'}
                </span>
                <Icon name="chevron-down" size={14} />
              </button>
              
              {switcherOpen && (
                <div 
                  className={`absolute top-full mt-2 w-48 p-2 rounded-xl glass-card-strong shadow-2xl z-50 ${
                    isRTL ? 'right-0' : 'left-0'
                  }`}
                >
                  {/* Theme Toggle */}
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
                    <span className="text-sm">
                      {theme === 'dark'
                        ? (language === 'fa' ? 'تم روشن' : 'Light Mode')
                        : (language === 'fa' ? 'تم تاریک' : 'Dark Mode')}
                    </span>
                  </button>
                  
                  <div className="my-1 border-t border-[var(--border-color)]" />
                  
                  {/* Language Toggle */}
                  <button
                    onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <Icon name="globe" size={18} />
                    <span className="text-sm">
                      {language === 'fa' ? 'English' : 'فارسی'}
                    </span>
                  </button>
                </div>
              )}
            </div>
            
            {/* GitHub Link */}
            {cms.settings.githubUsername && (
              <a
                href={`https://github.com/${cms.settings.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon size={20} />
              </a>
            )}
          </div>
        </nav>
      </header>
      
      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      
      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50 h-full w-80 max-w-[85vw] bg-[var(--bg-secondary)] shadow-2xl transform transition-transform duration-300 ${
          drawerOpen 
            ? 'translate-x-0' 
            : isRTL ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          {/* Traffic Lights */}
          <div className="flex gap-2">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110"
            />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {language === 'fa' ? 'منو' : 'Menu'}
          </span>
        </div>
        
        {/* Drawer Content */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-180px)]">
          {tabs.map(tab => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'gradient-bg text-white'
                    : 'hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon name={tab.icon} size={20} />
                <span className="font-medium">
                  {language === 'fa' ? tab.labelFa : tab.labelEn}
                </span>
              </Link>
            );
          })}
          
          <div className="my-4 border-t border-[var(--border-color)]" />
          
          {/* Print Resume Button */}
          <button
            onClick={handlePrintResume}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Icon name="printer" size={20} />
            <span className="font-medium">
              {language === 'fa' ? 'چاپ رزومه' : 'Print Resume'}
            </span>
          </button>
        </div>
        
        {/* Social Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)]">
          <div className="flex justify-center gap-3">
            {cms.socials.filter(s => s.enabled).map(social => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors"
              >
                {getPlatformIcon(social.platform, 20)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TopNav;
