import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "@/contexts/AppContext";
import { defaultCms } from "@/lib/cms/schema";
import { ClientShell } from "@/components/layout/ClientShell";

export const metadata: Metadata = {
  title: "Avid Kiya — System Architect",
  description: "Official portfolio of Avid Kiya, System Architect & Backend Engineer.",
};

function AntiFlash(){
  const code = `
  (function(){
    try{
      var l = localStorage.getItem('ak_lang') || '${defaultCms.settings.defaultLanguage}';
      var t = localStorage.getItem('ak_theme') || '${defaultCms.settings.defaultTheme}';
      document.documentElement.setAttribute('lang', l);
      document.documentElement.setAttribute('dir', l==='fa' ? 'rtl' : 'ltr');
      if(t==='light') document.documentElement.classList.add('light');
    }catch(e){}
  })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <AntiFlash />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <AppProvider defaultLang={defaultCms.settings.defaultLanguage} defaultTheme={defaultCms.settings.defaultTheme}>
          <ClientShell>{children}</ClientShell>
        </AppProvider>
      </body>
    </html>
  );
}
