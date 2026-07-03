"use client";

import { useMemo, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/Icon";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import type { Product } from "@/lib/cms/schema";

const CURRENCY_LABEL: Record<string, { symbol: string; suffix?: boolean }> = {
  USD: { symbol: "$" },
  EUR: { symbol: "€" },
  IRR: { symbol: "ریال", suffix: true },
  TMN: { symbol: "تومان", suffix: true },
  USDT: { symbol: "USDT", suffix: true },
};

function formatPrice(p: Product, lang: "fa" | "en") {
  const cur = CURRENCY_LABEL[p.currency] ?? { symbol: p.currency };
  const finalPrice = p.discount ? p.price * (1 - p.discount) : p.price;
  const nice = finalPrice.toFixed(finalPrice % 1 === 0 ? 0 : 2);
  return cur.suffix ? `${nice} ${cur.symbol}` : `${cur.symbol}${nice}`;
}

export default function ShopPage() {
  const { language, dir } = useApp();
  const { state, resolve } = useCms();
  const [category, setCategory] = useState<string>("all");

  const products = state.shop.products;
  const categories = state.shop.categories;

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => resolve(p.category ?? { fa: "", en: "" }) === category);
  }, [products, category, resolve]);

  if (!state.shop.enabled) {
    return (
      <>
        <TopNav />
        <main className="pt-32 pb-16 text-center">
          <p className="opacity-70">
            {language === "fa" ? "فروشگاه غیرفعال است" : "Shop is disabled"}
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopNav />
      <main className="relative z-10 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{
              background: "rgba(33,241,168,0.1)",
              border: "1px solid rgba(33,241,168,0.25)",
              color: "var(--primary)",
            }}
          >
            <Icon name="shopping_cart" size={14} />
            {resolve(state.shop.title)}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: "var(--on-surface)" }}
          >
            {resolve(state.shop.title)}
          </h1>
          <p
            className="opacity-70 text-sm max-w-2xl mx-auto"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {resolve(state.shop.subtitle)}
          </p>
        </header>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <CategoryChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label={language === "fa" ? "همه" : "All"}
          />
          {categories.map((c, i) => {
            const label = resolve(c);
            return (
              <CategoryChip
                key={i}
                active={category === label}
                onClick={() => setCategory(label)}
                label={label}
              />
            );
          })}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-xl opacity-60">
            <Icon name="shopping_cart" size={48} />
            <p className="mt-3">{language === "fa" ? "محصولی یافت نشد" : "No products"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
      style={{
        background: active ? "var(--primary)" : "var(--surface-container-solid)",
        color: active ? "var(--on-primary)" : "var(--on-surface)",
        borderColor: active ? "var(--primary)" : "var(--outline-variant)",
      }}
    >
      {label}
    </button>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const { language } = useApp();
  const { resolve, state } = useCms();
  const contactEmail = state.identity.email;

  const finalPrice = p.discount ? p.price * (1 - p.discount) : p.price;
  const priceLabel = formatPrice(p, language);

  return (
    <article
      className="glass-panel rounded-xl overflow-hidden flex flex-col transition-all hover:-translate-y-1"
      style={{ background: "var(--surface-container-solid)" }}
    >
      {/* Image / placeholder */}
      <div
        className="w-full flex items-center justify-center relative"
        style={{
          aspectRatio: "4/3",
          background: p.image
            ? undefined
            : "linear-gradient(135deg, rgba(33,241,168,0.08), rgba(33,241,168,0.02))",
        }}
      >
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={resolve(p.title)}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon name="shopping_cart" size={48} color="var(--primary)" />
        )}
        {p.featured && (
          <span
            className="absolute top-2 start-2 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{
              background: "var(--primary)",
              color: "var(--on-primary)",
            }}
          >
            ★ {language === "fa" ? "ویژه" : "FEATURED"}
          </span>
        )}
        {p.discount && (
          <span
            className="absolute top-2 end-2 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: "#ffb400", color: "#000" }}
          >
            −{Math.round(p.discount * 100)}%
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {p.category && (
          <div
            className="text-[10px] uppercase tracking-widest opacity-70 mb-1"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {resolve(p.category)}
          </div>
        )}
        <h3
          className="font-bold text-base mb-1"
          style={{ color: "var(--on-surface)" }}
        >
          {resolve(p.title)}
        </h3>
        <p
          className="text-xs opacity-70 mb-4 flex-1"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {resolve(p.description)}
        </p>

        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {p.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "var(--surface-container-highest)",
                  color: "var(--on-surface-variant)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div
          className="flex items-center justify-between pt-3 border-t"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <div>
            {p.discount ? (
              <>
                <div
                  className="text-[11px] line-through opacity-50"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {p.currency === "USD" ? "$" : ""}
                  {p.price}
                </div>
                <div
                  className="font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {priceLabel}
                </div>
              </>
            ) : (
              <div className="font-bold" style={{ color: "var(--primary)" }}>
                {priceLabel}
              </div>
            )}
          </div>
          <a
            href={
              p.href ||
              `mailto:${contactEmail}?subject=${encodeURIComponent("Order: " + resolve(p.title))}`
            }
            target={p.href && p.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-transform hover:scale-105"
            style={{
              background:
                p.inStock === false
                  ? "var(--surface-container-highest)"
                  : "var(--primary)",
              color:
                p.inStock === false
                  ? "var(--on-surface-variant)"
                  : "var(--on-primary)",
              pointerEvents: p.inStock === false ? "none" : "auto",
            }}
          >
            <Icon name="shopping_cart" size={12} />
            {p.inStock === false
              ? language === "fa"
                ? "ناموجود"
                : "Sold out"
              : language === "fa"
              ? "خرید"
              : "Buy"}
          </a>
        </div>
      </div>
    </article>
  );
}
