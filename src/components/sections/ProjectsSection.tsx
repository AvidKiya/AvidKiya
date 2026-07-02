'use client';
import React from 'react';
import { PortfolioData } from '@/lib/data';
import { Language, t } from '@/lib/i18n';

interface Props { data: PortfolioData; lang: Language; }

export default function ProjectsSection({ data, lang }: Props) {
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: fontStyle, color: '#00ff00' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {data.projects.map((project, i) => {
          const title = isFa ? project.titleFa : project.title;
          const desc = isFa ? project.descriptionFa : project.description;
          return (
            <div key={project.id} style={{
              border: '1px solid #00ff00',
              padding: 24,
              background: '#000500',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#39ff14')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#00ff00')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                  fontSize: 16, fontWeight: 'bold', color: '#39ff14',
                  textShadow: '0 0 6px #00ff00',
                }}>
                  {String(i + 1).padStart(2, '0')}. {title}
                </div>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.85 }}>
                {desc}
              </div>

              {project.tech.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{t(lang, 'technologies')}: </span>
                  {project.tech.map(tech => (
                    <span key={tech} style={{
                      fontSize: 11,
                      border: '1px solid #00ff0055',
                      padding: '2px 8px',
                      color: '#00ff0099',
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 'auto', flexDirection: isFa ? 'row-reverse' : 'row' }}>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" style={{
                    color: '#000', background: '#00ff00', padding: '6px 14px',
                    fontSize: 12, textDecoration: 'none', fontFamily: fontStyle,
                  }}>
                    {t(lang, 'viewProject')}
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" style={{
                    color: '#00ff00', border: '1px solid #00ff00', padding: '6px 14px',
                    fontSize: 12, textDecoration: 'none', fontFamily: fontStyle,
                  }}>
                    {t(lang, 'viewCode')}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {data.projects.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.4, marginTop: 64 }}>
          {isFa ? 'هنوز پروژه‌ای اضافه نشده' : 'No projects added yet'}
        </div>
      )}
    </div>
  );
}
