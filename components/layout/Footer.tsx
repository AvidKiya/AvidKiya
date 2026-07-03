"use client";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { BrandIcon } from "@/components/ui/Icon";

export function Footer(){
  const { cms, resolve } = useCms();
  const { lang } = useApp();
  return (
    <footer className="mt-20 border-t border-border glass no-print">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <div className="text-text-muted">
          © {new Date().getFullYear()} {resolve(cms.identity.fullName)} — {lang==="fa" ? "همه حقوق محفوظ است" : "All rights reserved"}
        </div>
        <div className="flex items-center gap-4">
          {cms.socials.filter(s=>s.enabled).map(s=>(
            <a key={s.id} href={s.url} target="_blank" className="text-text-muted hover:text-primary transition"><BrandIcon platform={s.platform} /></a>
          ))}
        </div>
      </div>
    </footer>
  );
}
