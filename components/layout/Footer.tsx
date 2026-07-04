"use client";

import React from "react";
import { useCms } from "@/contexts/CmsContext";
import { BrandIcon } from "@/components/ui/Icons";

export function Footer() {
  const { state, locale } = useCms();

  return (
    <footer className="no-print border-t border-[var(--color-bg-alt)] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[var(--color-text-subtle)]">
            © {new Date().getFullYear()} {state.brand.brandName}. {locale === "fa" ? "تمامی حقوق محفوظ است." : "All rights reserved."}
          </div>
          <div className="flex items-center gap-3">
            {state.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[var(--color-bg-alt)] transition text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
              >
                <BrandIcon platform={s.platform} size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
