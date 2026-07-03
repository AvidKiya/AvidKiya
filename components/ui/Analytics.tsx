"use client";

import Script from "next/script";
import { useCms } from "@/contexts/CmsContext";

export default function Analytics() {
  const { state } = useCms();
  if (!state.analytics.enabled) return null;

  return (
    <>
      {state.analytics.plausibleDomain && (
        <Script
          defer
          data-domain={state.analytics.plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      )}
      {state.analytics.googleId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${state.analytics.googleId}`}
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${state.analytics.googleId}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
