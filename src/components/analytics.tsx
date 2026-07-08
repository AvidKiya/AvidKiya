'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCms } from '@/lib/cms/cms-context';

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, path: location.pathname, referrer: document.referrer, props }),
    keepalive: true,
  }).catch(() => {});
}

export function Analytics() {
  const { cms } = useCms();
  const pathname = usePathname();
  const { enabled, plausibleDomain, googleId } = cms.analytics;

  useEffect(() => {
    if (!enabled) return;
    trackEvent('page_view', { path: pathname });
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <>
      {plausibleDomain && <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      {googleId && (<><Script src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`} strategy="afterInteractive" /><Script id="ga-init" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${googleId}');`}</Script></>)}
    </>
  );
}
