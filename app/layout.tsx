import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { CmsProvider } from "@/contexts/CmsContext";
import EditModeBar from "@/components/cms/EditModeBar";

export const metadata: Metadata = {
  title: "AVID KIYA — Systems Architect Portfolio",
  description:
    "Portfolio of Avid Kiya — Systems Architect building resilient distributed systems.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0d1510",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Default to Persian + Dark. AppProvider will sync from localStorage on mount.
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        {/* Self-hosted fonts (Material Symbols + Vazirmatn + Hanken Grotesk +
            Fira Sans). Bundled in /public/fonts — no dependency on Google
            Fonts CDN so the site works in regions where fonts.googleapis.com
            is blocked. */}
        <link rel="preload" href="/fonts/vazirmatn-400.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
        {/* Prevent theme flash: apply saved theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var lang = localStorage.getItem('avidkiya:lang') || 'fa';
                  var theme = localStorage.getItem('avidkiya:theme') || 'dark';
                  var html = document.documentElement;
                  html.setAttribute('lang', lang);
                  html.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
                  html.classList.remove('dark','light');
                  html.classList.add(theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen relative overflow-x-hidden">
        <AppProvider>
          <CmsProvider>
            {children}
            <EditModeBar />
          </CmsProvider>
        </AppProvider>
      </body>
    </html>
  );
}
