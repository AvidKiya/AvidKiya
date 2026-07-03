"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, ListShell, Section } from "../common";
import ImageUpload from "@/components/ui/ImageUpload";
import type { Product } from "@/lib/cms/schema";

const CURRENCIES = ["USD", "EUR", "IRR", "TMN", "USDT"] as const;

export default function ShopEditor() {
  const { state, update, addToList } = useCms();
  const s = state.shop;

  return (
    <Section title="Shop" desc="Digital products, consultations, downloads — anything you sell.">
      <Card title="Shop settings">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--on-surface)" }}>
            <input
              type="checkbox"
              checked={s.enabled}
              onChange={(e) => update("shop.enabled", e.target.checked)}
            />
            Enable /shop route
          </label>
          <I18nRow label="Shop title" value={s.title} onChange={(v) => update("shop.title", v)} />
          <I18nRow label="Shop subtitle" value={s.subtitle} onChange={(v) => update("shop.subtitle", v)} multiline />
        </div>
      </Card>

      <Card title={`Categories (${s.categories.length})`}>
        <div className="space-y-2">
          {s.categories.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input dir="rtl" value={c.fa} onChange={(e) => update(`shop.categories.${i}.fa`, e.target.value)} placeholder="فارسی" />
              <Input value={c.en} onChange={(e) => update(`shop.categories.${i}.en`, e.target.value)} placeholder="English" />
              <button
                onClick={() => update("shop.categories", s.categories.filter((_, k) => k !== i))}
                style={{ color: "#ffb4ab" }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              update("shop.categories", [...s.categories, { fa: "دسته جدید", en: "New category" }])
            }
            className="text-xs px-3 py-1.5 rounded border border-dashed"
            style={{ borderColor: "rgba(33,241,168,0.4)", color: "var(--primary)" }}
          >
            + Add category
          </button>
        </div>
      </Card>

      <Card title={`Products (${s.products.length})`}>
        <ListShell
          items={s.products}
          path="shop.products"
          gridCols={1}
          addLabel="Add product"
          onAdd={() =>
            addToList<Product>("shop.products", {
              id: `p-${Date.now()}`,
              title: { fa: "محصول جدید", en: "New product" },
              description: { fa: "توضیحات", en: "Description" },
              price: 0,
              currency: "USD",
              inStock: true,
              createdAt: new Date().toISOString(),
            })
          }
          render={(p, i) => (
            <div className="space-y-3">
              <ImageUpload
                label="Product image"
                value={p.image}
                onChange={(v) => update(`shop.products.${i}.image`, v)}
                aspectRatio="4/3"
                maxSizeKB={300}
              />
              <I18nRow label="Title" value={p.title} onChange={(v) => update(`shop.products.${i}.title`, v)} />
              <I18nRow label="Description" value={p.description} onChange={(v) => update(`shop.products.${i}.description`, v)} multiline />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={p.price}
                    onChange={(e) => update(`shop.products.${i}.price`, parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <select
                    value={p.currency}
                    onChange={(e) => update(`shop.products.${i}.currency`, e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--outline-variant)", color: "var(--on-surface)" }}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Discount (0..1)</Label>
                  <Input
                    type="number"
                    step="0.05"
                    min={0}
                    max={1}
                    value={p.discount ?? 0}
                    onChange={(e) => update(`shop.products.${i}.discount`, parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Flags</Label>
                  <div className="flex flex-col gap-1 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={p.inStock !== false}
                        onChange={(e) => update(`shop.products.${i}.inStock`, e.target.checked)}
                      /> In stock
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!p.featured}
                        onChange={(e) => update(`shop.products.${i}.featured`, e.target.checked)}
                      /> Featured
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <I18nRow
                  label="Category"
                  value={p.category ?? { fa: "", en: "" }}
                  onChange={(v) => update(`shop.products.${i}.category`, v)}
                />
                <div>
                  <Label>Tags (comma sep)</Label>
                  <Input
                    dir="ltr"
                    value={(p.tags ?? []).join(", ")}
                    onChange={(e) =>
                      update(
                        `shop.products.${i}.tags`,
                        e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <Label>External checkout URL (optional; default mailto:)</Label>
                <Input dir="ltr" value={p.href ?? ""} onChange={(e) => update(`shop.products.${i}.href`, e.target.value)} />
              </div>
            </div>
          )}
        />
      </Card>
    </Section>
  );
}
