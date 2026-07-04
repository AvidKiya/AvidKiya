'use client';

import { useApp } from '@/contexts/AppContext';
import { GitHubIcon, TelegramIcon, LinkedInIcon } from '@/components/ui/Icon';

export default function Footer() {
  const { lang, cms, resolve } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border-theme mt-16 no-print">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs font-black">
              {cms.brand.logoLetter}
            </span>
            <span>© {year} {resolve(cms.brand.brandName)}</span>
          </div>

          <div className="flex items-center gap-3">
            {cms.socials.filter(s => s.visible).map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-primary/10 transition text-text-secondary hover:text-text-primary">
                {s.platform === 'github' && <GitHubIcon size={16} />}
                {s.platform === 'telegram' && <TelegramIcon size={16} />}
                {s.platform === 'linkedin' && <LinkedInIcon size={16} />}
                {!['github','telegram','linkedin'].includes(s.platform) && <span className="text-xs">{s.platform}</span>}
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          {lang === 'fa' ? 'ساخته شده با ❤️ و کد' : 'Built with ❤️ and code'}
        </p>
      </div>
    </footer>
  );
}
