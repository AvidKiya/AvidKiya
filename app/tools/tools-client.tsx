'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  Braces,
  CalendarDays,
  Check,
  Copy,
  Download,
  FileCode,
  Hash,
  Image as ImageIcon,
  KeyRound,
  WandSparkles,
} from 'lucide-react';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';
import {
  AVESTAN_MONTHS,
  PERSIAN_MONTHS,
  getAvestanDayInfo,
  getFestival,
  gregorianToJalali,
  jalaliToGregorian,
  jalaliToImperial,
  toPersianDigits,
} from '@/lib/calendar';

type ToolId = 'date' | 'image' | 'json' | 'hash' | 'base64' | 'password';
type ImageFormat = 'image/jpeg' | 'image/webp' | 'image/png';

const toolIcons: Record<ToolId, ReactNode> = {
  date: <CalendarDays size={18} />,
  image: <ImageIcon size={18} />,
  json: <Braces size={18} />,
  hash: <Hash size={18} />,
  base64: <FileCode size={18} />,
  password: <KeyRound size={18} />,
};

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
};

const toHex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');

export default function ToolsClient(){
  const { cms, tf, t } = useCms();
  const tools = cms.tools.items.filter(x=>x.enabled);
  const cats = ['همه', ...cms.tools.categories];
  const [cat, setCat] = useState('همه');
  const [q, setQ] = useState('');
  const [active, setActive] = useState<ToolId>('date');
  const [copied, setCopied] = useState('');

  const today = new Date();
  const [todayJy, todayJm, todayJd] = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const [jy, setJy] = useState(todayJy);
  const [jm, setJm] = useState(todayJm);
  const [jd, setJd] = useState(todayJd);
  const [gy, setGy] = useState(today.getFullYear());
  const [gm, setGm] = useState(today.getMonth() + 1);
  const [gd, setGd] = useState(today.getDate());
  const [dateSource, setDateSource] = useState<'jalali'|'gregorian'>('jalali');

  const [jsonInput, setJsonInput] = useState('{\n  "name": "Avid Kiya",\n  "stack": ["Next.js", "Cloudflare", "AI"]\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const [hashInput, setHashInput] = useState('Avid Kiya');
  const [hashAlg, setHashAlg] = useState<'SHA-256'|'SHA-1'>('SHA-256');
  const [hashOutput, setHashOutput] = useState('');

  const [baseInput, setBaseInput] = useState('سلام Avid Kiya');
  const [baseOutput, setBaseOutput] = useState('');
  const [baseError, setBaseError] = useState('');

  const [passLength, setPassLength] = useState(20);
  const [password, setPassword] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageQuality, setImageQuality] = useState(0.78);
  const [imageMaxWidth, setImageMaxWidth] = useState(1600);
  const [imageFormat, setImageFormat] = useState<ImageFormat>('image/webp');
  const [imageResult, setImageResult] = useState<{ url:string; size:number; name:string } | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState('');

  const list = useMemo(()=> tools.filter(x=>
    (cat==='همه' || x.category===cat) &&
    (!q || tf(x.title).toLowerCase().includes(q.toLowerCase()) || tf(x.description).toLowerCase().includes(q.toLowerCase()))
  ), [tools, cat, q, tf]);

  const toolMap: Record<string, ToolId> = {
    'date-converter': 'date',
    'image-compressor': 'image',
    json: 'json',
    hash: 'hash',
    base64: 'base64',
    password: 'password',
  };

  const dateResult = useMemo(() => {
    const jalali = dateSource === 'jalali' ? [jy, jm, jd] : gregorianToJalali(gy, gm, gd);
    const gregorian = dateSource === 'gregorian' ? [gy, gm, gd] : jalaliToGregorian(jy, jm, jd);
    const [rJy, rJm, rJd] = jalali as [number, number, number];
    const [rGy, rGm, rGd] = gregorian as [number, number, number];
    const avestan = getAvestanDayInfo(rJd);
    const festival = getFestival(rJd, rJm);
    return {
      jalali: `${toPersianDigits(rJy)}/${toPersianDigits(String(rJm).padStart(2,'0'))}/${toPersianDigits(String(rJd).padStart(2,'0'))}`,
      gregorian: `${rGy}-${String(rGm).padStart(2,'0')}-${String(rGd).padStart(2,'0')}`,
      imperial: `${toPersianDigits(jalaliToImperial(rJy))}/${toPersianDigits(String(rJm).padStart(2,'0'))}/${toPersianDigits(String(rJd).padStart(2,'0'))}`,
      month: PERSIAN_MONTHS[rJm - 1],
      avestanMonth: AVESTAN_MONTHS[rJm - 1].name,
      avestanDay: avestan.name,
      avestanMeaning: avestan.meaning,
      festival,
    };
  }, [dateSource, gd, gm, gy, jd, jm, jy]);

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(()=>setCopied(''), 1400);
    } catch {}
  };

  const formatJson = (mode: 'pretty'|'minify') => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(mode === 'pretty' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
      setJsonError('');
    } catch (e:any) {
      setJsonError(e.message || 'JSON نامعتبر است');
      setJsonOutput('');
    }
  };

  const makeHash = async () => {
    const data = new TextEncoder().encode(hashInput);
    const digest = await crypto.subtle.digest(hashAlg, data);
    setHashOutput(toHex(digest));
  };

  const encodeBase64 = () => {
    setBaseError('');
    setBaseOutput(btoa(unescape(encodeURIComponent(baseInput))));
  };
  const decodeBase64 = () => {
    try {
      setBaseError('');
      setBaseOutput(decodeURIComponent(escape(atob(baseInput.trim()))));
    } catch {
      setBaseError('Base64 نامعتبر است');
      setBaseOutput('');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=?';
    const arr = new Uint32Array(passLength);
    crypto.getRandomValues(arr);
    setPassword(Array.from({length: passLength}, (_, i) => chars[arr[i] % chars.length]).join(''));
  };

  const compressImage = async () => {
    if (!imageFile) return;
    setImageBusy(true);
    setImageError('');
    setImageResult(null);
    try {
      const url = URL.createObjectURL(imageFile);
      const img = document.createElement('img');
      img.src = url;
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
      const scale = Math.min(1, imageMaxWidth / img.naturalWidth);
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas آماده نیست');
      ctx.drawImage(img, 0, 0, width, height);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, imageFormat, imageQuality));
      URL.revokeObjectURL(url);
      if (!blob) throw new Error('فشرده‌سازی انجام نشد');
      const ext = imageFormat === 'image/webp' ? 'webp' : imageFormat === 'image/png' ? 'png' : 'jpg';
      setImageResult({ url: URL.createObjectURL(blob), size: blob.size, name: imageFile.name.replace(/\.[^.]+$/, '') + `-compressed.${ext}` });
    } catch (e:any) {
      setImageError(e.message || 'خطا در فشرده‌سازی تصویر');
    } finally {
      setImageBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-7 md:py-10">
      <div className="grid lg:grid-cols-[1fr_330px] gap-4 mb-6 items-stretch">
        <GlassCard className="!p-6 md:!p-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber/10 text-amber border border-amber/20 px-3 py-1 text-[11.5px] mb-4">
            <WandSparkles size={13} /> {t('ابزارهای کاربردی، سریع و داخل مرورگر', 'Useful, fast and in-browser tools')}
          </div>
          <h1 className="text-[28px] md:text-[36px] font-[850] tracking-[-0.025em] flex items-center gap-2">
            <AppIcon name="tools" size={28} className="text-amber" />
            {t('ابزارهای آنلاین کاربردی','Useful Online Tools')}
          </h1>
          <p className="text-text-2 text-[13.5px] md:text-[14px] mt-3 leading-7 max-w-2xl">
            {t('ابزارهای بی‌مصرف حذف شدند؛ اینجا ابزارهایی قرار گرفته که واقعاً در کار روزانه به درد می‌خورند: تبدیل تاریخ، فشرده‌سازی عکس، JSON، هش، Base64 و رمز امن.', 'Useless tools were removed; this section now focuses on practical daily utilities: date conversion, image compression, JSON, hash, Base64 and secure passwords.')}
          </p>
        </GlassCard>
        <GlassCard className="!p-5 flex flex-col justify-center">
          <div className="text-[12px] text-text-3 mb-2">{t('جستجوی سریع ابزار', 'Quick tool search')}</div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('جستجوی ابزار…','Search tools…')} className="glass-input !w-full !py-[10px] text-[13px]" />
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[11px] text-text-3">
            <div className="rounded-[12px] bg-white/[0.035] py-2">{tools.length} ابزار</div>
            <div className="rounded-[12px] bg-white/[0.035] py-2">Private</div>
            <div className="rounded-[12px] bg-white/[0.035] py-2">Free</div>
          </div>
        </GlassCard>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5 text-[12.5px]">
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-3 py-[7px] rounded-full border transition ${cat===c ? 'bg-primary text-[#052e28] border-primary font-[600]' : 'glass-card !px-3 !py-[7px] text-text-2 hover:text-text'}`}>{c}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4 items-start">
        <div className="space-y-2 lg:sticky lg:top-[84px]">
          {list.map(tool=>{
            const id = toolMap[tool.id] || 'date';
            return (
              <button key={tool.id} onClick={()=>setActive(id)} className={`w-full text-start transition rounded-[18px] ${active===id ? 'ring-1 ring-primary/40' : ''}`}>
                <GlassCard className={`!p-4 ${active===id ? 'bg-primary/[0.055]' : ''}`}>
                  <div className="flex items-start gap-3 mb-1">
                    <div className="w-9 h-9 rounded-[12px] bg-amber/10 text-amber flex items-center justify-center shrink-0">{toolIcons[id]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-[700] text-[14px]">{tf(tool.title)}</div>
                      <div className="text-[12.5px] text-text-2 leading-relaxed mt-1">{tf(tool.description)}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-text-3 shrink-0">{tool.category}</span>
                  </div>
                </GlassCard>
              </button>
            );
          })}
          {list.length===0 && <GlassCard className="!p-5 text-center text-text-3 text-[13px]">ابزاری پیدا نشد</GlassCard>}
        </div>

        <GlassCard className="!p-4 md:!p-5 min-h-[520px]">
          {active === 'date' && (
            <div id="date-converter">
              <ToolTitle title="تبدیل تاریخ" subtitle="تبدیل شمسی، میلادی و شاهنشاهی همراه با نام روز اوستایی" />
              <div className="glass-card !p-1 flex rounded-full mb-4 max-w-[360px]">
                <button onClick={()=>setDateSource('jalali')} className={`flex-1 rounded-full py-2 text-[12px] ${dateSource==='jalali' ? 'bg-primary text-[#052e28] font-bold' : 'text-text-3'}`}>ورودی شمسی</button>
                <button onClick={()=>setDateSource('gregorian')} className={`flex-1 rounded-full py-2 text-[12px] ${dateSource==='gregorian' ? 'bg-primary text-[#052e28] font-bold' : 'text-text-3'}`}>ورودی میلادی</button>
              </div>
              {dateSource === 'jalali' ? (
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <NumberField label="سال شمسی" value={jy} setValue={setJy} />
                  <NumberField label="ماه" value={jm} setValue={setJm} />
                  <NumberField label="روز" value={jd} setValue={setJd} />
                </div>
              ) : (
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <NumberField label="Gregorian year" value={gy} setValue={setGy} dir="ltr" />
                  <NumberField label="Month" value={gm} setValue={setGm} dir="ltr" />
                  <NumberField label="Day" value={gd} setValue={setGd} dir="ltr" />
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-3">
                <ResultCard label="هجری شمسی" value={`${dateResult.jalali} ${dateResult.month}`} />
                <ResultCard label="میلادی" value={dateResult.gregorian} dir="ltr" />
                <ResultCard label="شاهنشاهی" value={`${dateResult.imperial} ${dateResult.avestanMonth}`} />
              </div>
              <div className="mt-3 rounded-[16px] border border-glass-border bg-white/[0.035] p-4 text-[13px] leading-7">
                <div>روز اوستایی: <b className="text-primary">{dateResult.avestanDay}</b></div>
                <div className="text-text-2">معنی: {dateResult.avestanMeaning}</div>
                {dateResult.festival && <div className="text-amber mt-1">جشن: {dateResult.festival}</div>}
              </div>
            </div>
          )}

          {active === 'image' && (
            <div id="image-compressor">
              <ToolTitle title="فشرده‌سازی عکس" subtitle="کاهش حجم تصویر داخل مرورگر؛ فایل شما آپلود نمی‌شود" />
              <input type="file" accept="image/*" onChange={e=>{ setImageFile(e.target.files?.[0] || null); setImageResult(null); }} className="glass-input w-full" />
              <div className="grid sm:grid-cols-3 gap-3 my-4">
                <label className="text-[12px] text-text-3">کیفیت: {Math.round(imageQuality * 100)}٪<input type="range" min="0.35" max="0.95" step="0.01" value={imageQuality} onChange={e=>setImageQuality(Number(e.target.value))} className="w-full mt-2" /></label>
                <NumberField label="حداکثر عرض" value={imageMaxWidth} setValue={setImageMaxWidth} dir="ltr" />
                <label className="text-[12px] text-text-3">فرمت خروجی<select value={imageFormat} onChange={e=>setImageFormat(e.target.value as ImageFormat)} className="glass-input !py-[9px] mt-1"><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label>
              </div>
              <button onClick={compressImage} disabled={!imageFile || imageBusy} className="glass-btn-primary !py-2 !px-4 text-[12.5px] disabled:opacity-40">{imageBusy ? 'در حال فشرده‌سازی...' : 'فشرده‌سازی'}</button>
              {imageError && <div className="text-rose text-[12.5px] mt-3">{imageError}</div>}
              {imageFile && <div className="text-text-3 text-[12px] mt-3">حجم اولیه: {formatBytes(imageFile.size)}</div>}
              {imageResult && (
                <div className="mt-4 rounded-[16px] border border-glass-border bg-white/[0.035] p-4">
                  <div className="grid sm:grid-cols-3 gap-2 text-[12px] mb-3">
                    <ResultCard label="حجم جدید" value={formatBytes(imageResult.size)} />
                    <ResultCard label="کاهش" value={imageFile ? `${Math.max(0, Math.round((1 - imageResult.size / imageFile.size) * 100))}٪` : '—'} />
                    <ResultCard label="فرمت" value={imageFormat.split('/')[1].toUpperCase()} />
                  </div>
                  <a href={imageResult.url} download={imageResult.name} className="glass-btn-primary !py-2 !px-4 text-[12.5px] inline-flex items-center gap-2"><Download size={14} /> دانلود تصویر فشرده</a>
                </div>
              )}
            </div>
          )}

          {active === 'json' && (
            <div id="json">
              <ToolTitle title="فرمت و اعتبارسنجی JSON" subtitle="Pretty، Minify و پیدا کردن خطا" />
              <textarea value={jsonInput} onChange={e=>setJsonInput(e.target.value)} rows={10} dir="ltr" className="glass-input font-mono text-[12.5px] w-full resize-y" />
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={()=>formatJson('pretty')} className="glass-btn-primary !py-2 !px-4 text-[12.5px]">Pretty</button>
                <button onClick={()=>formatJson('minify')} className="glass-btn !py-2 !px-4 text-[12.5px]">Minify</button>
                <button onClick={()=>copy('json', jsonOutput || jsonInput)} className="glass-btn !py-2 !px-4 text-[12.5px] inline-flex items-center gap-1"><Copy size={13}/> {copied==='json' ? 'کپی شد' : 'کپی'}</button>
              </div>
              {jsonError && <div className="mt-3 text-rose text-[12.5px]">{jsonError}</div>}
              {jsonOutput && <pre dir="ltr" className="mt-3 rounded-[14px] border border-glass-border bg-black/20 p-4 overflow-auto text-[12px] leading-6 max-h-[260px]">{jsonOutput}</pre>}
            </div>
          )}

          {active === 'hash' && (
            <div id="hash">
              <ToolTitle title="تولید هش" subtitle="ساخت SHA-256 یا SHA-1 برای متن، توکن یا checksum" />
              <textarea value={hashInput} onChange={e=>setHashInput(e.target.value)} rows={6} className="glass-input w-full resize-y" />
              <div className="flex flex-wrap gap-2 mt-3">
                <select value={hashAlg} onChange={e=>setHashAlg(e.target.value as 'SHA-256'|'SHA-1')} className="glass-input !py-2 !w-[130px]"><option>SHA-256</option><option>SHA-1</option></select>
                <button onClick={makeHash} className="glass-btn-primary !py-2 !px-4 text-[12.5px]">ساخت هش</button>
                <button onClick={()=>copy('hash', hashOutput)} disabled={!hashOutput} className="glass-btn !py-2 !px-4 text-[12.5px] inline-flex items-center gap-1 disabled:opacity-40"><Copy size={13}/> {copied==='hash' ? 'کپی شد' : 'کپی'}</button>
              </div>
              {hashOutput && <div dir="ltr" className="mt-3 rounded-[16px] border border-glass-border bg-white/[0.035] p-4 font-mono text-[12px] break-all">{hashOutput}</div>}
            </div>
          )}

          {active === 'base64' && (
            <div id="base64">
              <ToolTitle title="Base64 Encode / Decode" subtitle="تبدیل امن متن فارسی و انگلیسی به Base64 و برعکس" />
              <textarea value={baseInput} onChange={e=>setBaseInput(e.target.value)} rows={7} className="glass-input w-full resize-y" />
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={encodeBase64} className="glass-btn-primary !py-2 !px-4 text-[12.5px]">Encode</button>
                <button onClick={decodeBase64} className="glass-btn !py-2 !px-4 text-[12.5px]">Decode</button>
                <button onClick={()=>copy('base64', baseOutput)} disabled={!baseOutput} className="glass-btn !py-2 !px-4 text-[12.5px] inline-flex items-center gap-1 disabled:opacity-40"><Copy size={13}/> {copied==='base64' ? 'کپی شد' : 'کپی'}</button>
              </div>
              {baseError && <div className="text-rose text-[12.5px] mt-3">{baseError}</div>}
              {baseOutput && <div className="mt-3 rounded-[16px] border border-glass-border bg-white/[0.035] p-4 text-[13px] leading-7 break-all">{baseOutput}</div>}
            </div>
          )}

          {active === 'password' && (
            <div id="password">
              <ToolTitle title="سازنده رمز امن" subtitle="رمز قوی، تصادفی و قابل کپی" />
              <label className="text-[12.5px] text-text-2">طول رمز: {passLength}</label>
              <input type="range" min={12} max={64} value={passLength} onChange={e=>setPassLength(Number(e.target.value))} className="w-full mt-2" />
              <div dir="ltr" className="mt-4 rounded-[16px] border border-glass-border bg-white/[0.035] px-4 py-5 font-mono text-[15px] break-all min-h-[70px] flex items-center">{password || 'Click Generate'}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={generatePassword} className="glass-btn-primary !py-2 !px-4 text-[12.5px]">Generate</button>
                <button onClick={()=>copy('password', password)} disabled={!password} className="glass-btn !py-2 !px-4 text-[12.5px] inline-flex items-center gap-1 disabled:opacity-40"><Copy size={13}/> {copied==='password' ? 'کپی شد' : 'کپی'}</button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function ToolTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mb-4"><h2 className="text-[20px] font-[800] tracking-[-0.015em]">{title}</h2><p className="text-[12.5px] text-text-3 mt-1">{subtitle}</p></div>;
}

function NumberField({ label, value, setValue, dir }: { label:string; value:number; setValue:(v:number)=>void; dir?: 'rtl'|'ltr' }) {
  return <label className="text-[12px] text-text-3">{label}<input type="number" value={value} onChange={e=>setValue(Number(e.target.value))} dir={dir} className="glass-input !py-[9px] mt-1" /></label>;
}

function ResultCard({ label, value, dir }: { label:string; value:string; dir?: 'rtl'|'ltr' }) {
  return <div className="rounded-[14px] border border-glass-border bg-white/[0.035] p-3"><div className="text-[10.5px] text-text-3 mb-1">{label}</div><div className="font-bold text-[13px] break-words" dir={dir}>{value}</div></div>;
}
