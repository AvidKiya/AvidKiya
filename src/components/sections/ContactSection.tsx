'use client';
import React from 'react';
import { PortfolioData } from '@/lib/data';
import { Language, t } from '@/lib/i18n';

interface Props { data: PortfolioData; lang: Language; }

export default function ContactSection({ data, lang }: Props) {
  const isFa = lang === 'fa';
  const fontStyle = isFa ? 'Vazirmatn, sans-serif' : "'Share Tech Mono', monospace";
  const location = isFa ? data.contact.locationFa : data.contact.location;

  const items = [
    { label: t(lang, 'emailLabel'), value: data.contact.email, href: `mailto:${data.contact.email}`, icon: '📧' },
    { label: t(lang, 'phoneLabel'), value: data.contact.phone, href: `tel:${data.contact.phone}`, icon: '📱' },
    { label: t(lang, 'locationLabel'), value: location, href: null, icon: '📍' },
  ];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: fontStyle, color: '#00ff00' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.filter(i => i.value).map(item => (
          <div key={item.label} style={{
            border: '1px solid #00ff00',
            padding: 20,
            background: '#000500',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexDirection: isFa ? 'row-reverse' : 'row',
          }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div style={{ textAlign: isFa ? 'right' : 'left' }}>
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>{item.label}</div>
              {item.href ? (
                <a href={item.href} style={{ color: '#4598ff', fontSize: 15 }}>{item.value}</a>
              ) : (
                <div style={{ fontSize: 15 }}>{item.value}</div>
              )}
            </div>
          </div>
        ))}

        {/* Social Links */}
        <div style={{ border: '1px solid #00ff0033', padding: 20, display: 'flex', gap: 12, flexWrap: 'wrap', flexDirection: isFa ? 'row-reverse' : 'row' }}>
          {data.personal.github && (
            <a href={data.personal.github} target="_blank" rel="noreferrer" style={{
              color: '#000', background: '#00ff00', padding: '8px 20px',
              fontSize: 13, textDecoration: 'none', fontFamily: fontStyle,
            }}>
              GitHub
            </a>
          )}
          {data.personal.linkedin && (
            <a href={data.personal.linkedin} target="_blank" rel="noreferrer" style={{
              color: '#4598ff', border: '1px solid #4598ff', padding: '8px 20px',
              fontSize: 13, textDecoration: 'none', fontFamily: fontStyle,
            }}>
              LinkedIn
            </a>
          )}
          {data.personal.twitter && (
            <a href={data.personal.twitter} target="_blank" rel="noreferrer" style={{
              color: '#1da1f2', border: '1px solid #1da1f2', padding: '8px 20px',
              fontSize: 13, textDecoration: 'none', fontFamily: fontStyle,
            }}>
              Twitter
            </a>
          )}
          {data.personal.email && (
            <a href={`mailto:${data.personal.email}`} style={{
              color: '#39ff14', border: '1px solid #39ff14', padding: '8px 20px',
              fontSize: 13, textDecoration: 'none', fontFamily: fontStyle,
            }}>
              {t(lang, 'sendEmail')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
