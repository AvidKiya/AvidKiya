"use client";

import { useCms } from "@/contexts/CmsContext";
import { Card, I18nRow, Input, Label, ListShell, Section, Textarea } from "../common";
import ImageUpload from "@/components/ui/ImageUpload";
import type { Announcement, PollOption } from "@/lib/cms/schema";

export default function AnnouncementsEditor() {
  const { state, update, addToList } = useCms();

  return (
    <Section
      title="Announcements"
      desc="News, polls, maps and any updates you want to share with visitors. Set an expiry date to auto-move an item to archive."
    >
      <Card>
        <ListShell
          items={state.announcements}
          path="announcements"
          gridCols={1}
          addLabel="Add announcement"
          onAdd={() =>
            addToList<Announcement>("announcements", {
              id: `ann-${Date.now()}`,
              kind: "news",
              title: { fa: "عنوان جدید", en: "New title" },
              body: { fa: "متن...", en: "Body..." },
              createdAt: new Date().toISOString(),
            })
          }
          render={(a, i) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Kind</Label>
                  <select
                    value={a.kind}
                    onChange={(e) => update(`announcements.${i}.kind`, e.target.value)}
                    className="w-full rounded-md px-3 py-2 text-sm"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  >
                    <option value="news">News</option>
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="poll">Poll</option>
                    <option value="map">Map</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <Label>Expires at (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={a.expiresAt ? a.expiresAt.slice(0, 16) : ""}
                    onChange={(e) =>
                      update(
                        `announcements.${i}.expiresAt`,
                        e.target.value ? new Date(e.target.value).toISOString() : undefined
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Flags</Label>
                  <div className="flex flex-col gap-1 text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!a.pinned}
                        onChange={(e) => update(`announcements.${i}.pinned`, e.target.checked)}
                      /> Pinned
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!a.archived}
                        onChange={(e) => update(`announcements.${i}.archived`, e.target.checked)}
                      /> Archived
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!a.hidden}
                        onChange={(e) => update(`announcements.${i}.hidden`, e.target.checked)}
                      /> Hidden
                    </label>
                  </div>
                </div>
              </div>

              <I18nRow label="Title" value={a.title} onChange={(v) => update(`announcements.${i}.title`, v)} />
              <I18nRow
                label="Body"
                value={a.body ?? { fa: "", en: "" }}
                onChange={(v) => update(`announcements.${i}.body`, v)}
                multiline
              />

              {(a.kind === "image" || a.kind === "news") && (
                <ImageUpload
                  label="Image"
                  value={a.image}
                  onChange={(v) => update(`announcements.${i}.image`, v)}
                  maxSizeKB={300}
                />
              )}

              {a.kind === "poll" && (
                <div className="border-t pt-3" style={{ borderColor: "var(--outline-variant)" }}>
                  <I18nRow
                    label="Question"
                    value={a.poll?.question ?? { fa: "سوال", en: "Question" }}
                    onChange={(v) => {
                      const cur = a.poll ?? { question: v, options: [] as PollOption[] };
                      update(`announcements.${i}.poll`, { ...cur, question: v });
                    }}
                  />
                  <div className="mt-3">
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {(a.poll?.options ?? []).map((opt, oi) => (
                        <div key={opt.id} className="flex gap-2 items-center">
                          <Input
                            value={opt.label.fa}
                            onChange={(e) =>
                              update(
                                `announcements.${i}.poll.options.${oi}.label.fa`,
                                e.target.value
                              )
                            }
                            placeholder="فارسی"
                            dir="rtl"
                          />
                          <Input
                            value={opt.label.en}
                            onChange={(e) =>
                              update(
                                `announcements.${i}.poll.options.${oi}.label.en`,
                                e.target.value
                              )
                            }
                            placeholder="English"
                          />
                          <div className="w-16 text-center text-xs" style={{ color: "var(--on-surface-variant)" }}>
                            {opt.votes}
                          </div>
                          <button
                            onClick={() =>
                              update(
                                `announcements.${i}.poll.options`,
                                (a.poll?.options ?? []).filter((_, k) => k !== oi)
                              )
                            }
                            style={{ color: "#ffb4ab" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const cur = a.poll ?? {
                            question: { fa: "", en: "" },
                            options: [] as PollOption[],
                          };
                          update(`announcements.${i}.poll`, {
                            ...cur,
                            options: [
                              ...cur.options,
                              {
                                id: `opt-${Date.now()}`,
                                label: { fa: "گزینه", en: "Option" },
                                votes: 0,
                              },
                            ],
                          });
                        }}
                        className="text-xs px-3 py-1.5 rounded border border-dashed"
                        style={{ borderColor: "rgba(33,241,168,0.4)", color: "var(--primary)" }}
                      >
                        + Add option
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {a.kind === "map" && (
                <div className="border-t pt-3 grid grid-cols-3 gap-3" style={{ borderColor: "var(--outline-variant)" }}>
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={a.map?.lat ?? 35.6892}
                      onChange={(e) =>
                        update(`announcements.${i}.map`, {
                          ...(a.map ?? {}),
                          lat: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={a.map?.lng ?? 51.389}
                      onChange={(e) =>
                        update(`announcements.${i}.map`, {
                          ...(a.map ?? {}),
                          lng: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Zoom</Label>
                    <Input
                      type="number"
                      value={a.map?.zoom ?? 12}
                      onChange={(e) =>
                        update(`announcements.${i}.map`, {
                          ...(a.map ?? {}),
                          zoom: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>CTA URL (optional)</Label>
                  <Input dir="ltr" value={a.href ?? ""} onChange={(e) => update(`announcements.${i}.href`, e.target.value)} />
                </div>
                <I18nRow
                  label="CTA label"
                  value={a.hrefLabel ?? { fa: "", en: "" }}
                  onChange={(v) => update(`announcements.${i}.hrefLabel`, v)}
                />
              </div>
            </div>
          )}
        />
      </Card>
    </Section>
  );
}
