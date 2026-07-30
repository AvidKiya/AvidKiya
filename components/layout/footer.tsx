'use client';
import { AsciiLogo } from '@/components/ui/ascii-logo';
import { useCms } from '@/lib/cms/cms-context';

export function Footer() {
  const { t } = useCms();
  return (
    <footer className="mt-20 border-t border-glass-border py-12">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 text-center">
        <div className="flex justify-center mb-6 opacity-90">
          <AsciiLogo small />
        </div>
        <p className="text-sm text-text-2">
          © ۲۵۸۵ اَوید کیا. {t('تمامی حقوق محفوظ است.', 'All rights reserved.')}
        </p>
        <div className="mt-4 text-xs text-text-3 flex justify-center gap-4 flex-wrap">
          <a href="/terms" className="hover:text-text-2">{t('قوانین','Terms')}</a>
          <a href="/privacy" className="hover:text-text-2">{t('حریم خصوصی','Privacy')}</a>
          <a href="/refund" className="hover:text-text-2">{t('بازپرداخت','Refund')}</a>
          <a href="/status" className="hover:text-text-2">{t('وضعیت','Status')}</a>
          <a href="/changelog" className="hover:text-text-2">{t('تغییرات','Changelog')}</a>
          <a href="/help" className="hover:text-text-2">{t('راهنما','Help')}</a>
        </div>
      </div>
    </footer>
  );
}
