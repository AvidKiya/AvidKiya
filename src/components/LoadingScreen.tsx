'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioData } from '@/lib/data';
import { Language, t } from '@/lib/i18n';

interface Props {
  data: PortfolioData;
  lang: Language;
  onDone: () => void;
}

export default function LoadingScreen({ data, lang, onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [toLoad] = useState(14);
  const [showBios, setShowBios] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [loadingTextOpacity, setLoadingTextOpacity] = useState(1);
  const [startPopupOpacity, setStartPopupOpacity] = useState(0);
  const [resources, setResources] = useState<string[]>([]);
  const [mobileWarning, setMobileWarning] = useState(false);
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";
  const dir = isFa ? 'rtl' : 'ltr';

  useEffect(() => {
    setMobileWarning(window.innerWidth < 768);
    const onResize = () => setMobileWarning(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    setTimeout(() => setShowBios(true), 300);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!showBios) return;
    let count = 0;
    const fakeResources = [
      'three.js', 'geometry', 'shaders', 'textures', 'models',
      'audio', 'fonts', 'icons', 'animations', 'ui', 'styles', 'data', 'config', 'final',
    ];
    const interval = setInterval(() => {
      if (count >= toLoad) {
        clearInterval(interval);
        setProgress(1);
        setDoneLoading(true);
        setTimeout(() => {
          setLoadingTextOpacity(0);
          setTimeout(() => setStartPopupOpacity(1), 500);
        }, 1000);
        return;
      }
      count++;
      setLoaded(count);
      setProgress(count / toLoad);
      setShowResources(true);
      setResources(prev => {
        const name = fakeResources[count - 1];
        const pct = Math.round((count / toLoad) * 100);
        const line = `${name.padEnd(24, '\xa0')}... ${pct}%`;
        const next = [...prev, line];
        return next.slice(-8);
      });
    }, 180);
    return () => clearInterval(interval);
  }, [showBios]);

  const start = useCallback(() => {
    setOverlayOpacity(0);
    setTimeout(onDone, 300);
  }, [onDone]);

  const name = isFa ? data.personal.nameFa : data.personal.name;
  const company = isFa ? data.bios.companyFa : data.bios.company;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: '#000',
      opacity: overlayOpacity,
      transition: 'opacity 0.3s ease',
      fontFamily: fontStyle,
      fontSize: 14,
      letterSpacing: 0.8,
      color: '#00ff00',
      display: 'flex',
      flexDirection: 'column',
      padding: 32,
      boxSizing: 'border-box',
      direction: dir as 'ltr' | 'rtl',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', marginBottom: 16 }}>
        {/* Logo block */}
        <div style={{
          width: 64, height: 42,
          border: '2px solid #00ff00',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 'bold', marginRight: isFa ? 0 : 16, marginLeft: isFa ? 16 : 0,
          flexShrink: 0,
        }}>
          {name.charAt(0).toUpperCase()}{name.split(' ')[1]?.charAt(0).toUpperCase() || ''}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 16 }}>{name}</div>
          <div style={{ fontWeight: 'bold' }}>{company}</div>
          <div>Released: {data.bios.releaseDate}</div>
          <div>PORTFOLIO BIOS (C) {company}</div>
          <div>HSP S13 Special Portfolio Edition</div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ borderBottom: '1px solid #00ff00', marginBottom: 16, opacity: 0.5 }} />

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {showBios && (
          <>
            <div style={{ opacity: 0.8 }}>HSP Showcase XX 113</div>
            <div>
              {t(lang, 'checkingRAM')}: {14000} OK
            </div>
            <div style={{ height: 8 }} />

            {showResources ? (
              progress >= 1 ? (
                <div style={{ color: '#39ff14' }}>✓ {t(lang, 'finished')}</div>
              ) : (
                <div>{t(lang, 'loading')} ({loaded}/{toLoad})</div>
              )
            ) : (
              <div>{t(lang, 'wait')}<span className="blink">_</span></div>
            )}

            {/* Resource list */}
            <div style={{ paddingLeft: 32, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {resources.map((r, i) => (
                <div key={i} style={{ opacity: 0.7, fontSize: 12 }}>{r}</div>
              ))}
            </div>

            {/* Progress bar */}
            {showResources && (
              <div style={{ marginTop: 8, maxWidth: 400 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
            )}

            {doneLoading && (
              <div style={{ marginTop: 8 }}>
                {t(lang, 'launching')}{' '}
                <strong style={{ color: '#39ff14' }}>
                  &apos;{name} Portfolio {data.bios.biosVersion}&apos;
                </strong>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #00ff00', paddingTop: 16, opacity: 0.6 }}>
        <div>
          Press <strong>DEL</strong> to enter SETUP &nbsp;&nbsp; <strong>ESC</strong> to skip memory test
        </div>
        <div style={{ marginTop: 4 }}>
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Start Popup */}
      {startPopupOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: startPopupOpacity,
          transition: 'opacity 0.5s ease',
        }}>
          <div style={{
            background: '#000',
            border: '7px solid #fff',
            padding: 32,
            maxWidth: 480,
            display: 'flex', flexDirection: 'column', gap: 16,
            textAlign: isFa ? 'right' : 'left',
          }}>
            <div style={{ color: '#39ff14', fontSize: 18, fontWeight: 'bold' }}>
              {name} Portfolio {data.bios.biosVersion}
            </div>

            {mobileWarning && (
              <div style={{ color: 'yellow', fontSize: 12 }}>
                ⚠ {t(lang, 'mobileWarning')}
              </div>
            )}

            <div style={{ opacity: 0.8 }}>
              {t(lang, 'pressStart')}
            </div>

            <button
              onClick={start}
              style={{
                background: '#00ff00',
                color: '#000',
                padding: '12px 32px',
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: fontStyle,
                cursor: 'pointer',
                border: 'none',
                letterSpacing: 2,
                alignSelf: isFa ? 'flex-end' : 'flex-start',
              }}
            >
              {t(lang, 'start')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
