'use client';

import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';

const ASCII_ART = `
 █████╗ ██╗   ██╗██╗██████╗     ██████╗ ███████╗██╗   ██╗
██╔══██╗██║   ██║██║██╔══██╗    ██╔══██╗██╔════╝██║   ██║
███████║██║   ██║██║██║  ██║    ██║  ██║█████╗  ██║   ██║
██╔══██║╚██╗ ██╔╝██║██║  ██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝
██║  ██║ ╚████╔╝ ██║██████╔╝    ██████╔╝███████╗ ╚████╔╝
╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝     ╚═════╝ ╚══════╝  ╚═══╝`;

const TECH_CHIPS = ['Go', 'TypeScript', 'Python', 'Rust', 'PostgreSQL', 'Redis', 'Docker', 'K8s'];

export default function Hero() {
  const { lang, resolve, cms } = useApp();
  const d = cms.dashboard;
  const id = cms.identity;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Card */}
        <div className="lg:col-span-2 glass-card-strong relative overflow-hidden p-6 md:p-8">
          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="scan-line absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
          </div>

          {/* ASCII Art */}
          <pre className="text-[6px] sm:text-[8px] md:text-[9px] leading-tight font-mono text-primary/40 mb-6 overflow-hidden select-none" dir="ltr">
            {ASCII_ART}
          </pre>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent-emerald pulse-dot" />
            <span className="text-xs font-medium text-accent-emerald">{resolve(d.heroTag)}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
            <span className="gradient-text">{resolve(d.heroTitleA)}</span>
            <br />
            <span className="text-text-primary">&amp; {resolve(d.heroTitleB)}</span>
          </h1>

          {/* Description */}
          <p className="text-text-secondary text-sm md:text-base mb-6 max-w-xl leading-relaxed">
            {resolve(d.heroDescription)}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/projects"
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:brightness-110 transition flex items-center gap-2">
              <Icon name="code" size={14} />
              {resolve(d.ctaPrimary)}
            </Link>
            <Link href="/about"
              className="px-5 py-2.5 rounded-xl border border-border-strong text-text-primary font-bold text-sm hover:bg-primary/5 transition flex items-center gap-2">
              <Icon name="mail" size={14} />
              {resolve(d.ctaSecondary)}
            </Link>
            <button onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl border border-border-theme text-text-secondary font-medium text-sm hover:bg-primary/5 transition flex items-center gap-2">
              <Icon name="printer" size={14} />
              {lang === 'fa' ? 'چاپ رزومه' : 'Print CV'}
            </button>
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-2">
            {TECH_CHIPS.map(t => (
              <span key={t} className="px-2.5 py-1 rounded-md bg-primary/8 border border-border-theme text-xs font-mono text-text-secondary">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6 space-y-4">
          {/* Avatar */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="text-2xl font-black text-primary">{cms.brand.logoLetter}</span>
          </div>

          <h2 className="text-lg font-bold text-center">{resolve(id.fullName)}</h2>
          <p className="text-sm text-text-secondary text-center">{resolve(id.title)}</p>

          <div className="space-y-3 pt-2">
            <InfoRow icon="map-pin" label={resolve(id.location)} />
            <InfoRow icon="mail" label={id.email} />
            <InfoRow icon="clock" label={lang === 'fa' ? `${id.yearsExperience}+ سال تجربه` : `${id.yearsExperience}+ years exp`} />
            <InfoRow icon="zap" label={lang === 'fa' ? 'آماده همکاری' : 'Available'} />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon name={icon} size={14} className="text-primary shrink-0" />
      <span className="text-text-secondary truncate">{label}</span>
    </div>
  );
}
