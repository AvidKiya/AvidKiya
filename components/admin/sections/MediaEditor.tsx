"use client";

import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { Card, I18nRow, Input, Label, Section } from "../common";
import ImageUpload from "@/components/ui/ImageUpload";

export default function MediaEditor() {
  const { state, update } = useCms();
  const { language } = useApp();
  const m = state.music;
  const h = state.heroObject;

  return (
    <Section
      title={language === "fa" ? "رسانه (موسیقی و اشیای نمایشی)" : "Media (music & hero object)"}
      desc={
        language === "fa"
          ? "موسیقی پس‌زمینه سایت و شیء نمایشی کنار متن اصلی."
          : "Background music and hero-side showcase object."
      }
    >
      <Card title={language === "fa" ? "موسیقی پس‌زمینه" : "Background music"}>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--on-surface)" }}>
            <input
              type="checkbox"
              checked={m.enabled}
              onChange={(e) => update("music.enabled", e.target.checked)}
            />
            {language === "fa" ? "فعال کردن موسیقی" : "Enable music"}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              <input
                type="checkbox"
                checked={m.autoplay}
                onChange={(e) => update("music.autoplay", e.target.checked)}
              />
              {language === "fa" ? "پخش خودکار" : "Autoplay"}
            </label>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
              <input
                type="checkbox"
                checked={m.loop}
                onChange={(e) => update("music.loop", e.target.checked)}
              />
              {language === "fa" ? "تکرار" : "Loop"}
            </label>
            <div>
              <Label>{language === "fa" ? "بلندی صدا" : "Volume"} ({Math.round(m.volume * 100)}%)</Label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={m.volume}
                onChange={(e) => update("music.volume", parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--primary)" }}
              />
            </div>
          </div>
          <div>
            <Label>{language === "fa" ? "لینک فایل صوتی (mp3/ogg)" : "Audio URL (mp3/ogg)"}</Label>
            <Input
              dir="ltr"
              value={m.src}
              onChange={(e) => update("music.src", e.target.value)}
              placeholder="https://example.com/song.mp3"
            />
            <p className="text-[11px] opacity-70 mt-1" style={{ color: "var(--on-surface-variant)" }}>
              {language === "fa"
                ? "می‌توانی فایل mp3 را روی گیت‌هاب یا هر جای عمومی آپلود کنی و لینک مستقیمش را اینجا بگذاری."
                : "Upload an mp3 to GitHub or any public host and paste the direct link here."}
            </p>
          </div>
          <div>
            <Label>{language === "fa" ? "عنوان (اختیاری)" : "Title (optional)"}</Label>
            <Input
              value={m.title ?? ""}
              onChange={(e) => update("music.title", e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card title={language === "fa" ? "شیء نمایشی کنار متن اصلی" : "Hero showcase object"}>
        <div className="space-y-3">
          <div>
            <Label>{language === "fa" ? "نوع" : "Kind"}</Label>
            <select
              value={h.kind}
              onChange={(e) => update("heroObject.kind", e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--outline-variant)",
                color: "var(--on-surface)",
              }}
            >
              <option value="none">{language === "fa" ? "بدون شیء" : "None"}</option>
              <option value="image">{language === "fa" ? "تصویر (PNG/JPG/SVG/GIF)" : "Image (PNG/JPG/SVG/GIF)"}</option>
              <option value="model3d">{language === "fa" ? "مدل ۳بعدی (.glb / .gltf)" : "3D model (.glb / .gltf)"}</option>
            </select>
          </div>

          {h.kind === "image" && (
            <ImageUpload
              label={language === "fa" ? "تصویر" : "Image"}
              value={h.src}
              onChange={(v) => update("heroObject.src", v ?? "")}
              aspectRatio="1/1"
              maxSizeKB={400}
            />
          )}

          {h.kind === "model3d" && (
            <>
              <div>
                <Label>{language === "fa" ? "لینک فایل .glb / .gltf" : ".glb / .gltf model URL"}</Label>
                <Input
                  dir="ltr"
                  value={h.src}
                  onChange={(e) => update("heroObject.src", e.target.value)}
                  placeholder="https://example.com/model.glb"
                />
              </div>
              <ImageUpload
                label={language === "fa" ? "تصویر پیش‌نمایش (Poster)" : "Poster image (fallback)"}
                value={h.posterSrc}
                onChange={(v) => update("heroObject.posterSrc", v ?? "")}
                aspectRatio="1/1"
                maxSizeKB={200}
              />
              <label className="flex items-center gap-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                <input
                  type="checkbox"
                  checked={!!h.autoRotate}
                  onChange={(e) => update("heroObject.autoRotate", e.target.checked)}
                />
                {language === "fa" ? "چرخش خودکار" : "Auto-rotate"}
              </label>
            </>
          )}

          <I18nRow
            label={language === "fa" ? "متن جایگزین" : "Alt text"}
            value={h.alt ?? { fa: "", en: "" }}
            onChange={(v) => update("heroObject.alt", v)}
          />
        </div>
      </Card>
    </Section>
  );
}
