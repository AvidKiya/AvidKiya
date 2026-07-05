import type { Metadata } from 'next';
import { AppProvider } from '@/contexts/AppContext';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { BackgroundLayers, ScrollProgress, BackToTop } from '@/components/layout/BackgroundLayers';
import MusicPlayer from '@/components/ui/MusicPlayer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Avid Kia — System Architect & Backend Engineer',
  description: 'Personal portfolio of Avid Kia, a system architect and backend engineer specializing in scalable distributed systems.',
  keywords: ['developer', 'backend', 'system architect', 'portfolio', 'Go', 'TypeScript'],
  icons: {
    icon: '/favicon.svg'
  }
};

// Anti-flash script
const antiFlashScript = `
(function() {
  try {
    var theme = localStorage.getItem('avidkiya-theme');
    var lang = localStorage.getItem('avidkiya-lang');
    if (theme === 'light') document.documentElement.classList.add('light');
    if (lang === 'fa') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'fa';
    } else if (lang === 'en') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'fa';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
        <link rel="preconnect" href="https://api.github.com" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AppProvider>
          <ScrollProgress />
          <BackgroundLayers />
          <TopNav />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <MusicPlayer />
        </AppProvider>
      </body>
    </html>
  );
}
