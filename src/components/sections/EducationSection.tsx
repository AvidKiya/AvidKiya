'use client';
import React from 'react';
import { PortfolioData } from '@/lib/data';
import { Language } from '@/lib/i18n';

interface Props { data: PortfolioData; lang: Language; }

export default function EducationSection({ data, lang }: Props) {
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: fontStyle, color: '#00ff00' }}>
      {data.education.map((edu) => {
        const school = isFa ? edu.schoolFa : edu.school;
        const degree = isFa ? edu.degreeFa : edu.degree;
        const period = isFa ? edu.periodFa : edu.period;

        return (
          <div key={edu.id} style={{
            border: '1px solid #00ff00',
            padding: 24,
            marginBottom: 20,
            background: '#000500',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isFa ? 'row-reverse' : 'row',
            gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#39ff14' }}>{school}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>{degree}</div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6, border: '1px solid #00ff0033', padding: '4px 12px', flexShrink: 0 }}>
              {period}
            </div>
          </div>
        );
      })}
      {data.education.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.4, marginTop: 64 }}>
          {isFa ? 'هنوز تحصیلاتی اضافه نشده' : 'No education added yet'}
        </div>
      )}
    </div>
  );
}
