"use client";

import React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress, BackToTop } from "@/components/layout/ScrollEffects";

export default function RootPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <TopNav />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
