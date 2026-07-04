import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "AvidKiya — System Architect & Backend Engineer",
  description: "Portfolio of Avid Kia — System Architect & Backend Engineer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Anti-flash script */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('ak-theme');
              var l = localStorage.getItem('ak-lang');
              if (t === 'light') document.documentElement.classList.add('light');
              if (l === 'en') { document.documentElement.lang = 'en'; document.documentElement.dir = 'ltr'; }
            } catch(e){}
          })();
        `}} />
      </head>
      <body className="antialiased min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
