"use client";

import React from "react";
import RootPageLayout from "@/components/layout/RootPageLayout";
import { useCms } from "@/contexts/CmsContext";
import { Icon, BrandIcon } from "@/components/ui/Icons";

export default function GiftsPage() {
  const { t, state, resolve, locale } = useCms();

  const platformColors: Record<string, string> = {
    buymeacoffee: "from-amber-400 to-orange-500",
    bitcoin: "from-orange-400 to-yellow-500",
    ethereum: "from-blue-400 to-indigo-500",
    usdt: "from-emerald-400 to-green-500",
    zarinpal: "from-blue-400 to-cyan-500",
  };

  return (
    <RootPageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black gradient-text">{resolve(state.gifts.title)}</h1>
          <p className="text-[var(--color-text-muted)]">{resolve(state.gifts.subtitle)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Downloads - My Gift to You */}
          <div className="glass p-6 space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              {resolve(state.gifts.downloadTitle)}
            </h2>
            <div className="space-y-3">
              {state.gifts.downloads.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-alt)] hover:bg-[#1f1f22]/80 transition group">
                  <div className="w-12 h-12 rounded-xl bg-[#5d7ae6]/10 flex items-center justify-center shrink-0">
                    <Icon name={item.icon ? (item.icon as any) : "FileDown"} size={22} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">{resolve(item.title)}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">{resolve(item.description)}</p>
                    {item.size && <span className="text-[10px] text-[var(--color-text-subtle)]">{item.size}</span>}
                  </div>
                  <a
                    href={item.url}
                    download
                    className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold hover:brightness-110 transition shrink-0 flex items-center gap-1.5"
                  >
                    <Icon name="Download" size={12} />
                    {t("gifts", "download")}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Donations - Your Gift to Me */}
          <div className="glass p-6 space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <span className="text-2xl">💝</span>
              {t("gifts", "yourGifts")}
            </h2>
            <div className="space-y-3">
              {state.gifts.donationLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${platformColors[link.platform] || "from-gray-400 to-gray-600"} text-white hover:scale-[1.02] transition group`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <BrandIcon platform={link.platform as any} size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{resolve(link.label)}</h3>
                    <p className="text-xs text-white/80">{t("gifts", "donate")}</p>
                  </div>
                  <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RootPageLayout>
  );
}
