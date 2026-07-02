'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioData } from '@/lib/data';
import { Language, t } from '@/lib/i18n';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import ContactSection from './sections/ContactSection';
import SkillsSection from './sections/SkillsSection';

type Section = 'home' | 'about' | 'projects' | 'experience' | 'education' | 'contact' | 'skills';

interface Props {
  data: PortfolioData;
  lang: Language;
  onLangSwitch: (l: Language) => void;
  onAdminOpen: () => void;
}

export default function MainUI({ data, lang, onLangSwitch, onAdminOpen }: Props) {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [nameText, setNameText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [showControls, setShowControls] = useState(false);
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";
  const dir = isFa ? 'rtl' : 'ltr';

  const name = isFa ? data.personal.nameFa : data.personal.name;
  const title = isFa ? data.personal.titleFa : data.personal.title;

  const typeText = (text: string, setText: (v: string) => void, cb?: () => void) => {
    let i = 0;
    const type = () => {
      if (i < text.length) {
        const idx = i;
        setText(text.slice(0, idx + 1));
        i++;
        setTimeout(type, Math.random() * 60 + 40);
      } else {
        cb?.();
      }
    };
    type();
  };

  useEffect(() => {
    setTimeout(() => {
      typeText(name, setNameText, () => {
        setTimeout(() => {
          typeText(title, setTitleText, () => {
            setTimeout(() => setShowControls(true), 400);
          });
        }, 200);
      });
    }, 500);
  }, [name, title]);

  const navItems: { key: Section; labelKey: keyof typeof import('@/lib/i18n').translations['en'] }[] = [
    { key: 'about', labelKey: 'about' },
    { key: 'projects', labelKey: 'projects' },
    { key: 'experience', labelKey: 'experience' },
    { key: 'education', labelKey: 'education' },
    { key: 'skills', labelKey: 'skills' },
    { key: 'contact', labelKey: 'contact' },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', fontFamily: fontStyle, direction: dir as 'ltr' | 'rtl' }}>

      {/* Info Overlay (top-left or top-right) */}
      <AnimatePresence>
        {activeSection === 'home' && (
          <motion.div
            key="info-overlay"
            initial={{ opacity: 0, x: isFa ? 32 : -32 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' } }}
            exit={{ opacity: 0, x: isFa ? 32 : -32, transition: { duration: 0.3, ease: 'easeOut' } }}
            style={{
              position: 'fixed',
              top: 24,
              [isFa ? 'right' : 'left']: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              zIndex: 100,
            }}
          >
            {nameText && (
              <div style={{
                background: '#000',
                padding: '4px 16px',
                border: '1px solid #00ff00',
                fontSize: 22,
                fontWeight: 'bold',
                color: '#39ff14',
                textShadow: '0 0 8px #00ff00',
              }}>
                {nameText}
                {nameText.length < name.length && <span className="blink">|</span>}
              </div>
            )}
            {titleText && (
              <div style={{
                background: '#000',
                padding: '4px 16px',
                border: '1px solid #00ff0055',
                fontSize: 14,
                color: '#00ff00',
                opacity: 0.85,
              }}>
                {titleText}
                {titleText.length < title.length && <span className="blink">|</span>}
              </div>
            )}
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#000',
                  padding: '4px 16px',
                  border: '1px solid #00ff0033',
                  fontSize: 11,
                  color: '#00ff0099',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>{new Date().toLocaleTimeString()}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <AnimatePresence>
        {activeSection === 'home' && showControls && (
          <motion.div
            key="nav"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: 32 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 0,
              zIndex: 100,
              padding: '0 24px 24px',
              flexWrap: 'wrap',
            }}
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.3 } }}
                onClick={() => setActiveSection(item.key)}
                style={{
                  background: '#000',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  padding: '10px 20px',
                  fontSize: 13,
                  fontFamily: fontStyle,
                  cursor: 'pointer',
                  letterSpacing: 1,
                  transition: 'all 0.2s',
                  textShadow: '0 0 6px #00ff00',
                  margin: 2,
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.background = '#00ff00';
                  (e.target as HTMLElement).style.color = '#000';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.background = '#000';
                  (e.target as HTMLElement).style.color = '#00ff00';
                }}
              >
                {t(lang, item.labelKey)}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-right controls */}
      {showControls && activeSection === 'home' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.8 } }}
          style={{
            position: 'fixed',
            top: 16,
            [isFa ? 'left' : 'right']: 16,
            display: 'flex',
            gap: 8,
            zIndex: 200,
          }}
        >
          {/* Lang toggle */}
          <button
            onClick={() => onLangSwitch(lang === 'fa' ? 'en' : 'fa')}
            style={{
              background: '#001100',
              border: '1px solid #00ff00',
              color: '#00ff00',
              padding: '6px 12px',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: fontStyle,
            }}
          >
            {lang === 'fa' ? 'EN' : 'FA'}
          </button>
          {/* Admin button */}
          <button
            onClick={onAdminOpen}
            style={{
              background: '#001100',
              border: '1px solid #00ff00',
              color: '#00ff00',
              padding: '6px 12px',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: fontStyle,
            }}
            title={t(lang, 'adminPanel')}
          >
            ⚙
          </button>
        </motion.div>
      )}

      {/* Section Overlay */}
      <AnimatePresence>
        {activeSection !== 'home' && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.97)',
              zIndex: 500,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: fontStyle,
              direction: dir as 'ltr' | 'rtl',
            }}
          >
            {/* Section Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid #00ff00',
              gap: 16,
            }}>
              <button
                onClick={() => setActiveSection('home')}
                style={{
                  background: '#000',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  padding: '6px 16px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: fontStyle,
                }}
              >
                ← {t(lang, 'back')}
              </button>

              <div style={{ flex: 1 }} />

              <div style={{ fontSize: 18, fontWeight: 'bold', color: '#39ff14', textShadow: '0 0 8px #00ff00' }}>
                {t(lang, (activeSection + 'Title') as keyof typeof import('@/lib/i18n').translations['en'])}
              </div>

              <div style={{ flex: 1 }} />

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onLangSwitch(lang === 'fa' ? 'en' : 'fa')}
                  style={{
                    background: '#001100', border: '1px solid #00ff00',
                    color: '#00ff00', padding: '6px 12px', fontSize: 12,
                    cursor: 'pointer', fontFamily: fontStyle,
                  }}
                >
                  {lang === 'fa' ? 'EN' : 'FA'}
                </button>
                <button
                  onClick={onAdminOpen}
                  style={{
                    background: '#001100', border: '1px solid #00ff00',
                    color: '#00ff00', padding: '6px 12px', fontSize: 12,
                    cursor: 'pointer', fontFamily: fontStyle,
                  }}
                >
                  ⚙
                </button>
              </div>
            </div>

            {/* Section Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
              {activeSection === 'about' && <AboutSection data={data} lang={lang} />}
              {activeSection === 'projects' && <ProjectsSection data={data} lang={lang} />}
              {activeSection === 'experience' && <ExperienceSection data={data} lang={lang} />}
              {activeSection === 'education' && <EducationSection data={data} lang={lang} />}
              {activeSection === 'skills' && <SkillsSection data={data} lang={lang} />}
              {activeSection === 'contact' && <ContactSection data={data} lang={lang} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center decorative text when home */}
      {activeSection === 'home' && !nameText && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#00ff0033', fontSize: 12, letterSpacing: 4,
          fontFamily: "'Share Tech Mono', monospace",
        }}>
          INITIALIZING...
        </div>
      )}
    </div>
  );
}
