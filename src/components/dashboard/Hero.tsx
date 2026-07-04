'use client';

import Link from 'next/link';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';

// ASCII Art - Always LTR
const ASCII_LOGO = `▄▀█ █░█ █ █▀▄   █▄▀ █ █▄█ ▄▀█
█▀█ ▀▄▀ █ █▄▀   █░█ █ ░█░ █▀█
░░░ A V I D   D E V H U B ░░░`;

const TECH_CHIPS = ['Go', 'TypeScript', 'Python', 'PostgreSQL', 'Redis', 'Kubernetes', 'Docker', 'gRPC'];

export function Hero() {
  const { language } = useApp();
  const { cms, t } = useCms();
  
  const handlePrintResume = () => {
    const printWindow = window.open('/resume?print=true', '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500);
      };
    }
  };
  
  return (
    <section className="relative min-h-[80vh] flex items-center py-20">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Hero Content */}
          <div className="glass-card-strong p-8 relative overflow-hidden">
            {/* Scan Animation */}
            <div className="scan-line pointer-events-none" />
            
            {/* ASCII Art (Desktop Only) - Always LTR */}
            <div className="hidden lg:block mb-6 overflow-hidden" dir="ltr">
              <pre className="text-[10px] leading-tight text-[var(--primary)] opacity-70 font-mono whitespace-pre text-center">
                {ASCII_LOGO}
              </pre>
            </div>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] pulse-glow" />
              <span className="text-sm font-medium text-[var(--accent-emerald)]">
                {t(cms.dashboard.heroTag)}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="text-[var(--text-primary)]">{t(cms.dashboard.heroTitleA)} </span>
              <span className="gradient-text">{t(cms.dashboard.heroTitleB)}</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-xl">
              {t(cms.dashboard.heroDescription)}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-bold hover:brightness-110 transition-all"
              >
                <Icon name="briefcase" size={18} />
                {t(cms.dashboard.ctaPrimary)}
              </Link>
              
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors font-medium"
              >
                <Icon name="mail" size={18} />
                {t(cms.dashboard.ctaSecondary)}
              </Link>
              
              <button
                onClick={handlePrintResume}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors font-medium"
              >
                <Icon name="printer" size={18} />
                {language === 'fa' ? 'چاپ رزومه' : 'Print CV'}
              </button>
            </div>
            
            {/* Tech Chips */}
            <div className="flex flex-wrap gap-2">
              {TECH_CHIPS.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Right: Profile Card */}
          <div className="glass-card-strong p-6 lg:p-8">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-color)]">
              <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center text-3xl font-black text-white overflow-hidden">
                {cms.brand.logoImage ? (
                  <img src={cms.brand.logoImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : cms.identity.avatar ? (
                  <img src={cms.identity.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  cms.brand.logoLetter || 'A'
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{t(cms.identity.fullName)}</h2>
                <p className="text-[var(--text-secondary)]">{t(cms.identity.title)}</p>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Icon name="map-pin" size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {language === 'fa' ? 'موقعیت' : 'Location'}
                  </p>
                  <p className="font-medium">{t(cms.identity.location)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Icon name="mail" size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {language === 'fa' ? 'ایمیل' : 'Email'}
                  </p>
                  <p className="font-medium">{cms.identity.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Icon name="calendar" size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {language === 'fa' ? 'تجربه' : 'Experience'}
                  </p>
                  <p className="font-medium">
                    {language === 'fa' 
                      ? `${cms.identity.yearsExperience}+ سال`
                      : `${cms.identity.yearsExperience}+ Years`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Icon name="zap" size={18} className="text-[var(--accent-emerald)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {language === 'fa' ? 'وضعیت' : 'Status'}
                  </p>
                  <p className="font-medium text-[var(--accent-emerald)]">
                    {language === 'fa' ? 'آماده همکاری' : 'Available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default Hero;
