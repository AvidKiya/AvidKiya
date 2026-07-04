'use client';

import Link from 'next/link';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';

export function ProjectGrid() {
  const { language } = useApp();
  const { cms, t } = useCms();
  
  const featuredProjects = cms.dashboard.projects.filter(p => p.featured).slice(0, 4);
  
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black">
              {language === 'fa' ? 'پروژه‌های برگزیده' : 'Featured Work'}
            </h2>
            <p className="text-[var(--text-secondary)] mt-1">
              {language === 'fa' 
                ? 'نمونه‌ای از کارهای اخیر من'
                : 'A selection of my recent work'}
            </p>
          </div>
          
          <Link
            href="/projects"
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors text-sm font-medium"
          >
            {language === 'fa' ? 'همه پروژه‌ها' : 'View All'}
            <Icon name={language === 'fa' ? 'arrow-left' : 'arrow-right'} size={16} />
          </Link>
        </div>
        
        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              className="glass-card-strong p-6 group hover:border-[var(--border-active)] transition-all animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Image/Placeholder */}
              {project.image ? (
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-[var(--bg-tertiary)]">
                  <img
                    src={project.image}
                    alt={t(project.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl mb-4 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent-cyan)]/20 flex items-center justify-center">
                  <Icon name="folder" size={48} className="text-[var(--primary)] opacity-50" />
                </div>
              )}
              
              {/* Project Info */}
              <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-colors">
                {t(project.title)}
              </h3>
              
              <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
                {t(project.description)}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Links */}
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Icon name="github" size={16} />
                    {language === 'fa' ? 'سورس' : 'Source'}
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Icon name="external-link" size={16} />
                    {language === 'fa' ? 'دمو' : 'Demo'}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectGrid;
