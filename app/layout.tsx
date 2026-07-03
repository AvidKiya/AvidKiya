import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { CmsProvider } from '@/contexts/CmsContext';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { BackgroundLayers } from '@/components/layout/BackgroundLayers';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { BackToTop } from '@/components/ui/BackToTop';
import { BgMusic } from '@/components/ui/BgMusic';

export const metadata: Metadata = {
  title: 'AvidKiya OS — Avid Kiya Portfolio',
  description: 'Avid Kiya — Systems Architect & Backend Engineer',
  keywords: ['Avid Kiya','backend','systems architect','Cloudflare','portfolio'],
  icons: { icon: '/favicon.svg' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#171717' };
const antiFlash = `(function(){try{var t=localStorage.getItem('avidkiya_theme')||'dark';var l=localStorage.getItem('avidkiya_lang')||'fa';document.documentElement.classList.toggle('light',t==='light');document.documentElement.classList.toggle('dark',t!=='light');document.documentElement.dataset.theme=t;document.documentElement.dataset.lang=l;document.documentElement.lang=l;document.documentElement.dir='ltr';document.documentElement.style.overflowX='hidden';}catch(e){document.documentElement.classList.add('dark');document.documentElement.dir='ltr';document.documentElement.style.overflowX='hidden';}})();`;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="ltr" className="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: antiFlash }} /></head><body><div id="app-root" dir="rtl"><AppProvider><CmsProvider><BackgroundLayers/><ScrollProgress/><TopNav/>{children}<Footer/><BackToTop/><BgMusic/></CmsProvider></AppProvider></div></body></html>;
}
