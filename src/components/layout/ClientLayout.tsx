'use client';

import type { ReactNode } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import TopNav from './TopNav';
import Footer from './Footer';
import BackgroundLayers from './BackgroundLayers';
import ScrollProgress from './ScrollProgress';
import BackToTop from './BackToTop';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <ScrollProgress />
      <BackgroundLayers />
      <TopNav />
      <main className="relative z-10 pt-16 min-h-screen">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </AppProvider>
  );
}
