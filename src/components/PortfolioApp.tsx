'use client';
import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import MainUI from './MainUI';
import AdminPanel from './AdminPanel';
import { getPortfolioData } from '@/lib/storage';
import { PortfolioData } from '@/lib/data';
import { Language } from '@/lib/i18n';

export default function PortfolioApp() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [lang, setLang] = useState<Language>('fa');
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('portfolio_lang') as Language;
    if (stored === 'en' || stored === 'fa') setLang(stored);
    setData(getPortfolioData());
  }, []);

  const handleLanguageSwitch = (l: Language) => {
    setLang(l);
    localStorage.setItem('portfolio_lang', l);
  };

  const handleDataUpdate = (newData: PortfolioData) => {
    setData(newData);
  };

  if (!data) return null;

  return (
    <div className="scanlines" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* CRT Background Grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #001a00 0%, #000000 100%)',
        zIndex: 0,
      }} />

      {/* Noise overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        opacity: 0.4,
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
        {loading ? (
          <LoadingScreen
            data={data}
            lang={lang}
            onDone={() => setLoading(false)}
          />
        ) : (
          <MainUI
            data={data}
            lang={lang}
            onLangSwitch={handleLanguageSwitch}
            onAdminOpen={() => setAdminOpen(true)}
          />
        )}
      </div>

      {/* Admin Panel */}
      {adminOpen && (
        <AdminPanel
          data={data}
          lang={lang}
          onClose={() => setAdminOpen(false)}
          onSave={handleDataUpdate}
        />
      )}
    </div>
  );
}
