import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CmsProvider } from "@/lib/cms/cms-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminGate } from "@/components/layout/admin-gate-client";
import { ErrorBoundary } from "@/components/error-boundary";
import { PwaRegister } from "@/components/pwa-register";
import { ExitPopup } from "@/components/exit-popup";
import { Analytics } from "@/components/analytics";
import { OfflineSync } from "@/components/offline-sync";
import { PushRegister } from "@/components/push-register";

export const metadata: Metadata = {
  title: "New Site",
  description: "A clean, configurable website shell.",
  keywords: ["portfolio", "planner", "shop", "services", "Next.js"],
  authors: [{ name: "Site owner" }],
  creator: "Site owner",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "New Site",
    title: "New Site",
    description: "A clean, configurable website shell.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('avidkiya_theme')||'dark';var l=localStorage.getItem('avidkiya_lang')||'en';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.setAttribute('lang',l);document.documentElement.setAttribute('dir',l==='fa'?'rtl':'ltr');}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-vazir antialiased">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-[0.10] blur-[120px]" style={{background:'radial-gradient(circle, #5d7ae6 0%, transparent 70%)'}} />
          <div className="absolute top-[40%] -left-40 w-[420px] h-[420px] rounded-full opacity-[0.07] blur-[110px]" style={{background:'radial-gradient(circle, #c084fc 0%, transparent 70%)'}} />
        </div>

        <CmsProvider>
          <ErrorBoundary>
            <Header />
            <main className="min-h-[70vh]">
              {children}
            </main>
            <Footer />
            <AdminGate />
            <ExitPopup />
            <Analytics />
            <OfflineSync />
            <PushRegister />
          </ErrorBoundary>
          <PwaRegister />
        </CmsProvider>
      </body>
    </html>
  );
}
