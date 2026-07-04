'use client';

import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

export default function ResumePage() {
  const { lang, resolve, cms } = useApp();
  const r = cms.resume;
  const id = cms.identity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Print button */}
      <div className="flex justify-end mb-4 no-print">
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:brightness-110 transition">
          <Icon name="printer" size={14} />
          {tl('printResume', lang)}
        </button>
      </div>

      <div className="glass-card-strong p-6 md:p-10 space-y-6" style={{ maxWidth: '210mm', margin: '0 auto' }}>
        {/* Header */}
        <div className="text-center border-b border-border-theme pb-4">
          <h1 className="text-3xl font-black">{resolve(id.fullName)}</h1>
          <p className="text-lg text-primary font-medium mt-1">{resolve(id.title)}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1"><Icon name="mail" size={12} /> {id.email}</span>
            <span className="flex items-center gap-1"><Icon name="map-pin" size={12} /> {resolve(id.location)}</span>
            {r.phone && <span className="flex items-center gap-1"><Icon name="user" size={12} /> {r.phone}</span>}
            {r.website && <span className="flex items-center gap-1"><Icon name="globe" size={12} /> {r.website}</span>}
          </div>
        </div>

        {/* Summary */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <Icon name="info" size={16} />
            {tl('summary', lang)}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">{resolve(r.summary)}</p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <Icon name="briefcase" size={16} />
            {tl('experience', lang)}
          </h2>
          <div className="space-y-4">
            {r.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <h3 className="font-bold text-sm">{resolve(exp.title)}</h3>
                  <span className="text-xs text-text-muted">{resolve(exp.period)}</span>
                </div>
                <p className="text-sm text-primary/80 mb-1">{resolve(exp.company)}</p>
                <ul className="list-disc list-inside space-y-1">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-text-secondary">{resolve(b)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <Icon name="bar-chart" size={16} />
            {tl('skills', lang)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {r.skills.map(skill => (
              <div key={skill.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-mono">{skill.name}</span>
                  <span className="text-[10px] text-text-muted">{skill.percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-primary/10">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${skill.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <Icon name="graduation-cap" size={16} />
            {tl('education', lang)}
          </h2>
          {r.education.map(ed => (
            <div key={ed.id} className="flex justify-between items-baseline">
              <div>
                <h3 className="text-sm font-bold">{resolve(ed.degree)}</h3>
                <p className="text-xs text-text-secondary">{resolve(ed.school)}</p>
              </div>
              <span className="text-xs text-text-muted">{ed.year}</span>
            </div>
          ))}
        </section>

        {/* Languages */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <Icon name="globe" size={16} />
            {tl('languagesLabel', lang)}
          </h2>
          <div className="flex flex-wrap gap-4">
            {r.languages.map(l => (
              <div key={l.id} className="text-sm">
                <span className="font-medium">{resolve(l.name)}</span>
                <span className="text-text-muted"> — {resolve(l.level)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
