'use client';

import { useCms, useApp } from '@/contexts/AppContext';
import { getPlatformIcon } from '@/components/ui/Icon';

export function Footer() {
  const { language } = useApp();
  const { cms, t } = useCms();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-12 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-center md:text-start">
            <p className="text-[var(--text-secondary)] text-sm">
              {language === 'fa' 
                ? `© ${currentYear} ${t(cms.identity.fullName)}. تمامی حقوق محفوظ است.`
                : `© ${currentYear} ${t(cms.identity.fullName)}. All rights reserved.`}
            </p>
            <p className="text-[var(--text-muted)] text-xs mt-1">
              {language === 'fa'
                ? 'ساخته شده با ❤️ و Next.js'
                : 'Built with ❤️ and Next.js'}
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {cms.socials.filter(s => s.enabled).map(social => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass-card hover:border-[var(--border-active)] transition-colors"
                aria-label={t(social.label)}
              >
                {getPlatformIcon(social.platform, 18)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
