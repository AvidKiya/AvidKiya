"use client";

import React, { useState } from "react";
import RootPageLayout from "@/components/layout/RootPageLayout";
import { useCms } from "@/contexts/CmsContext";
import { Icon } from "@/components/ui/Icons";

export default function ShopPage() {
  const { t, state, resolve, locale } = useCms();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? state.shop.products
    : state.shop.products.filter((p) => p.category === activeCategory);

  return (
    <RootPageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="text-3xl font-black gradient-text">{resolve(state.shop.title)}</h1>

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeCategory === "all" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]"
            }`}
          >
            {t("shop", "all")}
          </button>
          {state.shop.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition capitalize ${
                activeCategory === cat ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className={`glass overflow-hidden hover:border-[#5d7ae6]/30 transition group ${product.featured ? "ring-1 ring-[var(--color-amber)]/30" : ""}`}>
              {product.image && (
                <div className="aspect-video bg-[var(--color-bg-alt)] overflow-hidden">
                  <img src={product.image} alt={resolve(product.title)} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
              )}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold group-hover:text-[var(--color-primary)] transition">
                    {resolve(product.title)}
                  </h3>
                  {product.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold shrink-0">
                      ⭐ {t("shop", "featured")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{resolve(product.description)}</p>

                {product.tags && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-[var(--color-bg-alt)] text-[10px] text-[var(--color-text-subtle)]">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-black gradient-text">
                    {product.discount ? (
                      <div>
                        <span className="line-through text-[var(--color-text-subtle)] text-sm ms-1">
                          {product.price.usd ? `$${product.price.usd}` : ""}
                        </span>
                        <span className="text-emerald-500">
                          {product.price.usd ? `$${Math.round(product.price.usd * (1 - (product.discount / 100)))}` : ""}
                        </span>
                      </div>
                    ) : (
                      <span>{product.price.usd ? `$${product.price.usd}` : product.price.tmn ? `${product.price.tmn.toLocaleString()} T` : ""}</span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-xs font-bold">
                      −{product.discount}% {t("shop", "off")}
                    </span>
                  )}
                </div>

                {product.soldOut ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-[var(--color-bg-alt)] text-[var(--color-text-subtle)] text-sm font-bold cursor-not-allowed">
                    {t("shop", "soldOut")}
                  </button>
                ) : (
                  <a
                    href={product.buyUrl || "#"}
                    target={product.buyUrl?.startsWith("http") ? "_blank" : undefined}
                    className="block w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold text-center hover:brightness-110 transition"
                  >
                    {t("shop", "buy")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RootPageLayout>
  );
}
