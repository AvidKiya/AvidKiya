'use client';

import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

export default function FeaturedProjects() {
  const { lang, resolve, cms } = useApp();
  const projects = cms.dashboard.projects.filter(p => p.featured);

  if (projects.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Icon name="star" size={18} className="text-accent-amber" />
          {tl('featuredWork', lang)}
        </h2>
        <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
          {tl('viewAll', lang)}
          <Icon name={lang === 'fa' ? 'chevron-left' : 'chevron-right'} size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="glass-card p-5 hover:border-primary/30 transition group">
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition">{resolve(p.title)}</h3>
            <p className="text-sm text-text-secondary mb-3 line-clamp-2">{resolve(p.description)}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {p.tech.map(t => (
                <span key={t} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-mono">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {p.url && p.url !== '#' && (
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Icon name="external-link" size={12} />
                  {lang === 'fa' ? 'مشاهده' : 'View'}
                </a>
              )}
              {p.github && p.github !== '#' && (
                <a href={p.github} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1">
                  <Icon name="code" size={12} />
                  {lang === 'fa' ? 'کد' : 'Code'}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
