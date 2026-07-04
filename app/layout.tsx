import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppProvider";

export const metadata: Metadata = {
  title: "AvidKiya OS — System Architect & Backend Engineer",
  description: "Portfolio of Avid Kiya — System Architect & Backend Engineer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var locale = localStorage.getItem('avidkiya-locale') || 'fa';
                  var theme = localStorage.getItem('avidkiya-theme') || 'dark';
                  document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
                  document.documentElement.lang = locale;
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        <div id="print-resume-container" />
      </body>
    </html>
  );
}
