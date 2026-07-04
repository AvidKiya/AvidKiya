'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';

function ResumeContent() {
  const searchParams = useSearchParams();
  const { language } = useApp();
  const { cms, t } = useCms();
  
  // Auto-print if ?print=true
  useEffect(() => {
    if (searchParams.get('print') === 'true') {
      setTimeout(() => window.print(), 500);
    }
  }, [searchParams]);
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Print Button */}
        <div className="no-print mb-6 flex justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white font-medium hover:brightness-110 transition-all"
          >
            <Icon name="printer" size={18} />
            {language === 'fa' ? 'چاپ رزومه' : 'Print Resume'}
          </button>
        </div>
        
        {/* Resume Content */}
        <div className="glass-card-strong p-8 lg:p-12 print:bg-white print:shadow-none print:p-0">
          
          {/* Header */}
          <header className="text-center pb-6 mb-6 border-b border-[var(--border-color)] print:border-gray-300">
            <h1 className="text-4xl font-black gradient-text print:text-black mb-2">
              {t(cms.identity.fullName)}
            </h1>
            <p className="text-xl text-[var(--text-secondary)] print:text-gray-600 mb-4">
              {t(cms.identity.title)}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-[var(--text-muted)] print:text-gray-500">
              <span className="flex items-center gap-1">
                <Icon name="mail" size={14} />
                {cms.identity.email}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="phone" size={14} />
                {cms.resume.phone}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="globe" size={14} />
                {cms.resume.website}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="map-pin" size={14} />
                {t(cms.identity.location)}
              </span>
            </div>
          </header>
          
          {/* Summary */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Icon name="user" size={18} className="text-[var(--primary)] print:text-blue-600" />
              {language === 'fa' ? 'خلاصه' : 'Summary'}
            </h2>
            <p className="text-[var(--text-secondary)] print:text-gray-600 leading-relaxed">
              {t(cms.resume.summary)}
            </p>
          </section>
          
          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="briefcase" size={18} className="text-[var(--primary)] print:text-blue-600" />
              {language === 'fa' ? 'تجربه کاری' : 'Experience'}
            </h2>
            
            <div className="space-y-6">
              {cms.resume.experience.map(exp => (
                <div key={exp.id} className="relative ps-6 border-s-2 border-[var(--border-color)] print:border-gray-300">
                  <div className="absolute -start-[9px] top-0 w-4 h-4 rounded-full bg-[var(--primary)] print:bg-blue-600" />
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold">{t(exp.position)}</h3>
                      <p className="text-[var(--text-secondary)] print:text-gray-600">{t(exp.company)}</p>
                    </div>
                    <span className="text-sm text-[var(--text-muted)] print:text-gray-500">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  
                  <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)] print:text-gray-600">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i}>{t(bullet)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          
          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="code" size={18} className="text-[var(--primary)] print:text-blue-600" />
              {language === 'fa' ? 'مهارت‌ها' : 'Skills'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {cms.resume.skills.map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                    <span className="text-[var(--text-muted)] print:text-gray-500">{skill.percent}%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-tertiary)] print:bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] print:bg-blue-600 rounded-full"
                      style={{ width: `${skill.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Education */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="award" size={18} className="text-[var(--primary)] print:text-blue-600" />
              {language === 'fa' ? 'تحصیلات' : 'Education'}
            </h2>
            
            <div className="space-y-4">
              {cms.resume.education.map(edu => (
                <div key={edu.id} className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{t(edu.degree)}</h3>
                    <p className="text-[var(--text-secondary)] print:text-gray-600">{t(edu.institution)}</p>
                  </div>
                  <span className="text-sm text-[var(--text-muted)] print:text-gray-500 flex-shrink-0">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Languages */}
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="globe" size={18} className="text-[var(--primary)] print:text-blue-600" />
              {language === 'fa' ? 'زبان‌ها' : 'Languages'}
            </h2>
            
            <div className="flex flex-wrap gap-4">
              {cms.resume.languages.map(lang => (
                <div key={lang.id} className="flex items-center gap-2">
                  <span className="font-medium">{t(lang.name)}:</span>
                  <span className="text-[var(--text-secondary)] print:text-gray-600">{t(lang.level)}</span>
                </div>
              ))}
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResumeContent />
    </Suspense>
  );
}
