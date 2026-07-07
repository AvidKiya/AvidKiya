'use client';
import Script from 'next/script';
import { useCms } from '@/lib/cms/cms-context';

// Privacy-friendly analytics loader — driven entirely by CMS settings.
// Renders nothing visually; safe no-op until an admin enables + configures it.
export function Analytics() {
  const { cms } = useCms();
  const { enabled, plausibleDomain, googleId } = cms.analytics;

  if (!enabled) return null;

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      {googleId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleId}');`}
          </Script>
        </>
      )}
    </>
  );
}
