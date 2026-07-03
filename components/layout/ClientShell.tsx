"use client";
import { CmsProvider } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { BackgroundLayers } from "@/components/layout/BackgroundLayers";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { BgMusic } from "@/components/ui/BgMusic";
import dynamic from "next/dynamic";
const EditModeBar = dynamic(()=> import("@/components/cms/EditModeBar").then(m=>m.EditModeBar), { ssr: false });

export function ClientShell({ children }: { children: React.ReactNode }){
  const { lang } = useApp();
  return (
    <CmsProvider appLang={lang}>
      <ScrollProgress />
      <BackgroundLayers />
      <TopNav />
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <BgMusic />
      <EditModeBar />
    </CmsProvider>
  );
}
