'use client';
import React from 'react';
import { PortfolioData } from '@/lib/data';
import { Language } from '@/lib/i18n';

interface Props { data: PortfolioData; lang: Language; }

export default function ExperienceSection({ data, lang }: Props) {
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: fontStyle, color: '#00ff00' }}>
      {data.experience.map((exp, i) => {
        const company = isFa ? exp.companyFa : exp.company;
        const role = isFa ? exp.roleFa : exp.role;
        const period = isFa ? exp.periodFa : exp.period;
        const desc = isFa ? exp.descriptionFa : exp.description;

        return (
          <div key={exp.id} style={{
            borderLeft: '3px solid #00ff00',
            paddingLeft: isFa ? 0 : 24,
            paddingRight: isFa ? 24 : 0,
            borderRight: isFa ? '3px solid #00ff00' : 'none',
            borderLeft_: isFa ? 'none' : '3px solid #00ff00',
            marginBottom: 32,
            position: 'relative',
          }}>
            {/* Dot */}
            <div style={{
              position: 'absolute',
              [isFa ? 'right' : 'left']: -8,
              top: 0,
              width: 13, height: 13,
              background: '#00ff00',
              borderRadius: '50%',
              boxShadow: '0 0 8px #00ff00',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isFa ? 'row-reverse' : 'row' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#39ff14' }}>{company}</div>
                <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>{role}</div>
              </div>
              <div style={{ fontSize: 12, opacity: 0.6, border: '1px solid #00ff0033', padding: '4px 12px' }}>
                {period}
              </div>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.8, marginTop: 12 }}>
              {desc}
            </div>
          </div>
        );
      })}
      {data.experience.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.4, marginTop: 64 }}>
          {isFa ? 'هنوز تجربه‌ای اضافه نشده' : 'No experience added yet'}
        </div>
      )}
    </div>
  );
}
