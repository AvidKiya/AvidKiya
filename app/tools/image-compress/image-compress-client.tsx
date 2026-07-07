'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';
import { ArrowRight, Upload, Download, ShieldCheck } from 'lucide-react';

export default function ImageCompressClient() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [fileName, setFileName] = useState('image.jpg');
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    compress(url, quality);
  };

  const compress = (url: string, q: number) => {
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const compressedBlobUrl = URL.createObjectURL(blob);
          setCompressedUrl(compressedBlobUrl);
          setCompressedSize(blob.size);
          setProcessing(false);
        },
        'image/jpeg',
        q
      );
    };
    img.src = url;
  };

  const onQualityChange = (q: number) => {
    setQuality(q);
    if (originalUrl) compress(originalUrl, q);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const reduction = originalSize && compressedSize ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-text-3 text-[12.5px] hover:text-text mb-5">
        <ArrowRight size={14} /> بازگشت به ابزارها
      </Link>

      <div className="mb-6">
        <h1 className="text-[26px] md:text-[30px] font-[800] tracking-[-0.015em] flex items-center gap-2">
          <AppIcon name="tools" size={24} className="text-amber" />
          فشرده‌ساز تصویر
        </h1>
        <p className="text-text-2 text-[13px] mt-1 flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald" /> تصویر شما هرگز به سرور ارسال نمی‌شود — همه‌چیز در مرورگر خودتان انجام می‌شود
        </p>
      </div>

      <GlassCard className="!p-6 mb-5 text-center">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <button
          onClick={() => inputRef.current?.click()}
          className="glass-btn-primary !px-6 !py-3 text-[13.5px] flex items-center gap-2 mx-auto"
        >
          <Upload size={16} /> انتخاب تصویر
        </button>
        <p className="text-text-3 text-[11.5px] mt-2">JPG, PNG, WebP</p>
      </GlassCard>

      {originalUrl && (
        <>
          <GlassCard className="!p-5 mb-5">
            <label className="text-[12px] text-text-3 block mb-2">کیفیت فشرده‌سازی: {Math.round(quality * 100)}%</label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => onQualityChange(Number(e.target.value))}
              className="w-full"
            />
          </GlassCard>

          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <GlassCard className="!p-4">
              <div className="text-[11px] text-text-3 mb-2">تصویر اصلی</div>
              <img src={originalUrl} alt="original" className="w-full h-40 object-cover rounded-lg mb-2" />
              <div className="text-[12.5px] font-[700]">{formatSize(originalSize)}</div>
            </GlassCard>
            <GlassCard className="!p-4">
              <div className="text-[11px] text-text-3 mb-2">تصویر فشرده‌شده</div>
              {compressedUrl ? (
                <img src={compressedUrl} alt="compressed" className="w-full h-40 object-cover rounded-lg mb-2" />
              ) : (
                <div className="w-full h-40 rounded-lg bg-white/5 flex items-center justify-center text-text-3 text-[12px] mb-2">
                  {processing ? 'در حال پردازش…' : '—'}
                </div>
              )}
              <div className="text-[12.5px] font-[700] text-emerald">
                {compressedSize ? `${formatSize(compressedSize)} (${reduction}% کاهش)` : '—'}
              </div>
            </GlassCard>
          </div>

          {compressedUrl && (
            <a
              href={compressedUrl}
              download={`compressed-${fileName}`}
              className="glass-btn-primary !w-full !py-3 text-[13.5px] flex items-center justify-center gap-2"
            >
              <Download size={16} /> دانلود تصویر فشرده‌شده
            </a>
          )}
        </>
      )}
    </div>
  );
}
