'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon, type IconName } from '@/components/ui/icons';
import { useCms } from '@/lib/cms/cms-context';

const donationIcons: Record<string, IconName> = {
  ZarinPal: 'creditCard',
  'Buy Me a Coffee': 'coffee',
  Bitcoin: 'bitcoin',
  'حمایت ریالی': 'creditCard',
};

export default function GiftsPage() {
  const { cms, tf, t } = useCms();
  const downloads = cms.gifts.downloads;
  const donations = cms.gifts.donationLinks;
  const title = tf(cms.gifts.title) || t('هدیه‌ها', 'Gifts');
  const subtitle = tf(cms.gifts.subtitle) || t('دانلودهای رایگان و لینک‌های حمایت مالی اینجا نمایش داده می‌شود.', 'Free downloads and donation links appear here.');
  const downloadTitle = tf(cms.gifts.downloadTitle) || t('هدیه من به شما', 'My gifts to you');

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-14 h-14 rounded-[18px] bg-primary/12 text-primary flex items-center justify-center mx-auto mb-4"><AppIcon name="gift" size={26} /></div>
        <h1 className="text-3xl font-black mb-2">{title}</h1>
        <p className="text-text-2">{subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-6">{downloadTitle}</h2>
          <div className="space-y-4">
            {downloads.length === 0 ? (
              <GlassCard className="text-center !p-8">
                <div className="text-text-3 text-[13px] mb-3">{t('هنوز دانلودی اضافه نشده است.', 'No gift downloads have been added yet.')}</div>
                <Link href="/kiya/panel" className="glass-btn-primary inline-block text-[12.5px] px-4 py-2">{t('افزودن از پنل مدیر', 'Add from admin panel')}</Link>
              </GlassCard>
            ) : downloads.map((item) => (
              <GlassCard key={item.title}>
                <div className="flex justify-between items-start gap-4">
                  <div><h3 className="font-bold">{item.title}</h3><div className="text-[12px] text-text-3 mt-1">{item.url}</div></div>
                  <a href={item.url} className="glass-btn px-4 py-2 text-sm" download>{t('دانلود', 'Download')}</a>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">{t('هدیه شما به من', 'Your gift to me')}</h2>
          <p className="text-text-2 mb-6">{t('اگر از محتوا لذت می‌برید، می‌توانید از طریق لینک‌های زیر حمایت کنید.', 'If you enjoy the content, you can support through the links below.')}</p>
          <div className="space-y-4">
            {donations.length === 0 ? (
              <GlassCard className="text-center !p-8">
                <div className="text-text-3 text-[13px] mb-3">{t('هنوز لینک حمایتی تنظیم نشده است.', 'No donation links have been configured yet.')}</div>
                <Link href="/kiya/panel" className="glass-btn-primary inline-block text-[12.5px] px-4 py-2">{t('تنظیم از پنل مدیر', 'Configure in admin panel')}</Link>
              </GlassCard>
            ) : donations.map((item) => (
              <GlassCard key={item.label}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center shrink-0"><AppIcon name={donationIcons[item.label] || 'gift'} size={20} /></div>
                  <div><div className="font-bold">{item.label}</div><div className="text-sm text-text-2">{t('حمایت مالی', 'Donation')}</div></div>
                </a>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
