'use client';

import { GlassCard } from '@/components/ui/glass';
import { AppIcon, type IconName } from '@/components/ui/icons';
import { useCms } from '@/lib/cms/cms-context';

const donationIcons: Record<string, IconName> = {
  'ZarinPal': 'creditCard',
  'Buy Me a Coffee': 'coffee',
  'Bitcoin': 'bitcoin',
  'حمایت ریالی': 'creditCard',
};

export default function GiftsPage() {
  const { cms, tf } = useCms();
  const downloads = cms.gifts.downloads;
  const donations = cms.gifts.donationLinks;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">{tf(cms.gifts.title)}</h1>
        <p className="text-text-2">{tf(cms.gifts.subtitle)}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Downloads Column */}
        <div>
          <h2 className="text-xl font-bold mb-6">{tf(cms.gifts.downloadTitle)}</h2>
          <div className="space-y-4">
            {downloads.map((item) => (
              <GlassCard key={item.title}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                  </div>
                  <a
                    href={item.url}
                    className="glass-btn px-4 py-2 text-sm"
                    download
                  >
                    دانلود
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Donations Column */}
        <div>
          <h2 className="text-xl font-bold mb-6">حمایت مالی</h2>
          <p className="text-text-2 mb-6">
            اگر از محتوای من لذت می‌برید، می‌توانید از طریق راه‌های زیر حمایت کنید.
          </p>
          <div className="space-y-4">
            {donations.map((item) => (
              <GlassCard key={item.label}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <AppIcon name={donationIcons[item.label] || 'gift'} size={20} />
                  </div>
                  <div>
                    <div className="font-bold">{item.label}</div>
                    <div className="text-sm text-text-2">حمایت مالی</div>
                  </div>
                </a>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
