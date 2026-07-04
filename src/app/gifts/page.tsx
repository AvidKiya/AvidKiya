'use client';

import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';

export default function GiftsPage() {
  const { language } = useApp();
  const { cms, t } = useCms();
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black gradient-text mb-4">
            {t(cms.gifts.title)}
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            {t(cms.gifts.subtitle)}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Donations - Your Gift to Me */}
          <div className="glass-card-strong p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-amber)]/20 flex items-center justify-center">
                <Icon name="heart" size={24} className="text-[var(--accent-amber)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {language === 'fa' ? 'هدیه شما به من' : 'Your Gift to Me'}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {language === 'fa' ? 'حمایت مالی' : 'Financial Support'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {cms.gifts.donationLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:border hover:border-[var(--border-active)] transition-all group"
                  style={{ borderColor: 'transparent' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${link.color}20` }}
                  >
                    <Icon name={link.icon} size={24} className={`text-[${link.color}]`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">
                      {t(link.label)}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {link.platform}
                    </p>
                  </div>
                  <Icon name="arrow-right" size={18} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Downloads - My Gift to You */}
          <div className="glass-card-strong p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-emerald)]/20 flex items-center justify-center">
                <Icon name="gift" size={24} className="text-[var(--accent-emerald)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {t(cms.gifts.downloadTitle)}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {language === 'fa' ? 'دانلودهای رایگان' : 'Free Downloads'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {cms.gifts.downloads.map(download => (
                <a
                  key={download.id}
                  href={download.url}
                  download
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:border hover:border-[var(--border-active)] transition-all group"
                  style={{ borderColor: 'transparent' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary-glow)] flex items-center justify-center">
                    <Icon name={download.icon} size={24} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">
                      {t(download.title)}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {t(download.description)}
                    </p>
                    {download.size && (
                      <span className="text-xs text-[var(--text-muted)]">
                        {download.size}
                      </span>
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--primary)] text-white">
                    <Icon name="download" size={18} />
                  </div>
                </a>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
