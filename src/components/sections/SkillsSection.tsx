'use client';
import React from 'react';
import { PortfolioData } from '@/lib/data';
import { Language, t } from '@/lib/i18n';

interface Props { data: PortfolioData; lang: Language; }

export default function SkillsSection({ data, lang }: Props) {
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', fontFamily: fontStyle, color: '#00ff00' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {data.skills.map((skill) => {
          const name = isFa ? skill.nameFa : skill.name;
          return (
            <div key={skill.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexDirection: isFa ? 'row-reverse' : 'row' }}>
                <span style={{ fontSize: 14 }}>{name}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  {t(lang, 'level')}: {skill.level}%
                </span>
              </div>
              <div style={{
                height: 8,
                background: '#001100',
                border: '1px solid #00ff0055',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${skill.level}%`,
                  background: 'linear-gradient(90deg, #003300, #00ff00)',
                  boxShadow: '0 0 8px #00ff00',
                  transition: 'width 1s ease',
                }} />
                {/* Segments */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: 0,
                    left: `${(i + 1) * 10}%`,
                    height: '100%',
                    width: 1,
                    background: '#001100',
                    zIndex: 2,
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {data.skills.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.4, marginTop: 64 }}>
          {isFa ? 'هنوز مهارتی اضافه نشده' : 'No skills added yet'}
        </div>
      )}
    </div>
  );
}
