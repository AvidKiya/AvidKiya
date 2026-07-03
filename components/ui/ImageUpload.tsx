"use client";

import { useRef, useState } from "react";
import Icon from "./Icon";

interface Props {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
  maxSizeKB?: number;
  aspectRatio?: string; // e.g. "16/9"
}

/**
 * Image picker that stores images as base64 data URLs directly in the CMS
 * state (KV-friendly, no external hosting needed).
 *
 * - Files are downscaled + re-encoded to keep KV entries small
 *   (default max ~300KB after compression).
 * - Supports drag & drop.
 * - Also accepts a plain https:// URL for external images.
 */
export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  maxSizeKB = 300,
  aspectRatio = "16/9",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please pick an image file.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await compressImage(file, maxSizeKB);
      onChange(dataUrl);
    } catch (e: any) {
      setError(e?.message ?? "Failed to process image");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="block text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={() => {
            setUrlMode(!urlMode);
            setUrlInput(value && value.startsWith("http") ? value : "");
          }}
          className="text-[10px] px-2 py-0.5 rounded opacity-70 hover:opacity-100"
          style={{
            background: "var(--surface-container-highest)",
            color: "var(--on-surface)",
          }}
        >
          {urlMode ? "Upload file" : "Use URL"}
        </button>
      </div>

      {urlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            dir="ltr"
            className="flex-1 rounded-md px-3 py-2 text-sm outline-none"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--outline-variant)",
              color: "var(--on-surface)",
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim()) {
                onChange(urlInput.trim());
                setUrlMode(false);
              }
            }}
            className="px-3 rounded-md text-sm font-bold"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            Set
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className="relative rounded-lg border-2 border-dashed cursor-pointer overflow-hidden transition-all hover:brightness-110"
          style={{
            borderColor: "var(--outline-variant)",
            background: value ? "transparent" : "rgba(0,0,0,0.2)",
            aspectRatio,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />

          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Remove this image?")) onChange(undefined);
                }}
                className="absolute top-2 end-2 w-8 h-8 rounded-full grid place-items-center"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  color: "#ffb4ab",
                }}
                title="Remove"
              >
                <Icon name="delete" size={16} />
              </button>
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <Icon name={busy ? "sync" : "upload"} size={24} color="var(--primary)" />
              <div className="text-xs opacity-80">
                {busy
                  ? "Processing..."
                  : "Click or drag & drop an image"}
              </div>
              <div className="text-[10px] opacity-50">
                Max {maxSizeKB}KB after compression · JPEG/PNG/WebP
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-xs mt-1" style={{ color: "#ffb4ab" }}>
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Downscale + re-encode an image so that the resulting base64 string
 * stays under ~maxSizeKB. Uses a canvas to strip metadata and progressively
 * lower JPEG quality/dimensions until the target is hit.
 */
async function compressImage(file: File, maxSizeKB: number): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  let maxDim = 1600;
  let quality = 0.85;

  for (let attempt = 0; attempt < 8; attempt++) {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const out = canvas.toDataURL("image/jpeg", quality);
    // base64 chars → bytes: length * 3/4 (approx)
    const kb = (out.length * 3) / 4 / 1024;
    if (kb <= maxSizeKB) return out;
    // Shrink for next attempt
    if (quality > 0.4) quality -= 0.15;
    else maxDim = Math.round(maxDim * 0.75);
  }
  throw new Error(
    "Could not compress below the target size. Try a smaller image."
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
