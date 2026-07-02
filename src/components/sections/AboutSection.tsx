'use client';
import React from 'react';
import { PortfolioData } from '@/lib/data';
import { Language, t } from '@/lib/i18n';

interface Props { data: PortfolioData; lang: Language; }

export default function AboutSection({ data, lang }: Props) {
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";
  const name = isFa ? data.personal.nameFa : data.personal.name;
  const title = isFa ? data.personal.titleFa : data.personal.title;
  const bio = isFa ? data.personal.bioFa : data.personal.bio;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: fontStyle, color: '#00ff00' }}>
      <div style={{
        border: '1px solid #00ff00',
        padding: 32,
        marginBottom: 24,
        background: '#000500',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, flexDirection: isFa ? 'row-reverse' : 'row' }}>
          <div style={{
            width: 80, height: 80,
            border: '3px solid #00ff00',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 'bold', color: '#39ff14',
            textShadow: '0 0 12px #00ff00',
            flexShrink: 0,
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#39ff14', textShadow: '0 0 8px #00ff00' }}>
              {name}
            </div>
            <div style={{ fontSize: 14, color: '#00ff0099', marginTop: 4 }}>
              {title}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 14, lineHeight: 2, opacity: 0.9 }}>
          {bio}
        </div>
      </div>

      {/* Contact Links */}
      <div style={{ border: '1px solid #00ff0033', padding: 24, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {data.personal.email && (
          <a href={`mailto:${data.personal.email}`} style={{ color: '#4598ff', fontSize: 13 }}>
            📧 {data.personal.email}
          </a>
        )}
        {data.personal.github && (
          <a href={data.personal.github} target="_blank" rel="noreferrer" style={{ color: '#4598ff', fontSize: 13 }}>
            🐙 GitHub
          </a>
        )}
        {data.personal.linkedin && (
          <a href={data.personal.linkedin} target="_blank" rel="noreferrer" style={{ color: '#4598ff', fontSize: 13 }}>
            💼 LinkedIn
          </a>
        )}
        {data.personal.twitter && (
          <a href={data.personal.twitter} target="_blank" rel="noreferrer" style={{ color: '#4598ff', fontSize: 13 }}>
            🐦 Twitter
          </a>
        )}
        {data.personal.website && (
          <a href={data.personal.website} target="_blank" rel="noreferrer" style={{ color: '#4598ff', fontSize: 13 }}>
            🌐 Website
          </a>
        )}
      </div>
    </div>
  );
}
