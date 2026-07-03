"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, ListShell, Section } from "../common";
import type { DonationLink, DownloadItem } from "@/lib/cms/schema";

export default function GiftsEditor() {
  const { state, update, addToList } = useCms();
  const g = state.gifts;

  return (
    <Section title="Gifts" desc="The two-way gift exchange page — donations you can receive and downloads you offer visitors.">
      <Card title="Page header">
        <div className="space-y-3">
          <I18nRow label="Title" value={g.title} onChange={(v) => update("gifts.title", v)} />
          <I18nRow label="Subtitle" value={g.subtitle} onChange={(v) => update("gifts.subtitle", v)} multiline />
        </div>
      </Card>

      <Card title={`Downloads — your gift to visitors (${g.downloads.length})`}>
        <div className="space-y-3 mb-3">
          <I18nRow label="Section title" value={g.downloadTitle} onChange={(v) => update("gifts.downloadTitle", v)} />
          <I18nRow label="Section subtitle" value={g.downloadSubtitle} onChange={(v) => update("gifts.downloadSubtitle", v)} multiline />
        </div>
        <ListShell
          items={g.downloads}
          path="gifts.downloads"
          gridCols={1}
          addLabel="Add download"
          onAdd={() =>
            addToList<DownloadItem>("gifts.downloads", {
              id: `dl-${Date.now()}`,
              title: { fa: "فایل جدید", en: "New download" },
              description: { fa: "توضیح", en: "Description" },
              href: "https://",
              fileType: "config",
              size: "0KB",
              category: { fa: "دسته", en: "Category" },
              free: true,
            })
          }
          render={(d, i) => (
            <div className="space-y-3">
              <I18nRow label="Title" value={d.title} onChange={(v) => update(`gifts.downloads.${i}.title`, v)} />
              <I18nRow label="Description" value={d.description} onChange={(v) => update(`gifts.downloads.${i}.description`, v)} multiline />
              <div>
                <Label>URL (direct download link)</Label>
                <Input dir="ltr" value={d.href} onChange={(e) => update(`gifts.downloads.${i}.href`, e.target.value)} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label>File type</Label>
                  <Input value={d.fileType ?? ""} onChange={(e) => update(`gifts.downloads.${i}.fileType`, e.target.value)} placeholder="config / pdf / zip" />
                </div>
                <div>
                  <Label>Size</Label>
                  <Input value={d.size ?? ""} onChange={(e) => update(`gifts.downloads.${i}.size`, e.target.value)} placeholder="12KB" />
                </div>
                <div className="col-span-2">
                  <I18nRow
                    label="Category"
                    value={d.category ?? { fa: "", en: "" }}
                    onChange={(v) => update(`gifts.downloads.${i}.category`, v)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                <input
                  type="checkbox"
                  checked={d.free !== false}
                  onChange={(e) => update(`gifts.downloads.${i}.free`, e.target.checked)}
                />
                Mark as FREE
              </label>
            </div>
          )}
        />
      </Card>

      <Card title={`Donations — visitors' gift to you (${g.donationLinks.length})`}>
        <div className="space-y-3 mb-3">
          <I18nRow label="Section title" value={g.donationTitle} onChange={(v) => update("gifts.donationTitle", v)} />
          <I18nRow label="Section subtitle" value={g.donationSubtitle} onChange={(v) => update("gifts.donationSubtitle", v)} multiline />
        </div>
        <ListShell
          items={g.donationLinks}
          path="gifts.donationLinks"
          gridCols={1}
          addLabel="Add donation link"
          onAdd={() =>
            addToList<DonationLink>("gifts.donationLinks", {
              id: `dn-${Date.now()}`,
              label: { fa: "روش جدید", en: "New method" },
              href: "https://",
              icon: "heart",
              color: "#ff6b6b",
            })
          }
          render={(d, i) => (
            <div className="space-y-3">
              <I18nRow label="Label" value={d.label} onChange={(v) => update(`gifts.donationLinks.${i}.label`, v)} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>URL</Label>
                  <Input dir="ltr" value={d.href} onChange={(e) => update(`gifts.donationLinks.${i}.href`, e.target.value)} />
                </div>
                <div>
                  <Label>Icon</Label>
                  <select
                    value={d.icon}
                    onChange={(e) => update(`gifts.donationLinks.${i}.icon`, e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--outline-variant)", color: "var(--on-surface)" }}
                  >
                    <option value="heart">Heart</option>
                    <option value="coffee">Coffee</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="rocket_launch">Rocket</option>
                    <option value="star">Star</option>
                  </select>
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={d.color ?? "#ff6b6b"}
                      onChange={(e) => update(`gifts.donationLinks.${i}.color`, e.target.value)}
                      className="h-10 w-14 rounded"
                      style={{ background: "transparent" }}
                    />
                    <Input value={d.color ?? ""} onChange={(e) => update(`gifts.donationLinks.${i}.color`, e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </Card>
    </Section>
  );
}
