'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, WandSparkles } from 'lucide-react';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';

type ToolId = 'json' | 'password' | 'slug' | 'text' | 'image';

const normalizePersian = (value: string) => value
  .replace(/[ي]/g, 'ی')
  .replace(/[ك]/g, 'ک')
  .replace(/\s+/g, ' ')
  .trim();

const slugify = (value: string) => normalizePersian(value)
  .toLowerCase()
  .replace(/[\u064B-\u065F]/g, '')
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

export default function ToolsClient(){
  const { cms, tf, t } = useCms();
  const tools = cms.tools.items.filter(x=>x.enabled);
  const cats = ['همه', ...cms.tools.categories];
  const [cat, setCat] = useState('همه');
  const [q, setQ] = useState('');
  const [active, setActive] = useState<ToolId>('json');
  const [copied, setCopied] = useState('');

  const [jsonInput, setJsonInput] = useState('{\n  "name": "Avid Kiya",\n  "stack": ["Next.js", "Cloudflare", "AI"]\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const [passLength, setPassLength] = useState(18);
  const [password, setPassword] = useState('');
  const [slugInput, setSlugInput] = useState('طراحی پرتفولیو حرفه‌ای با Next.js');
  const [textInput, setTextInput] = useState('  این   یک متن    نمونه برای   پاک‌سازی است.  ');

  const list = useMemo(()=> tools.filter(x=>
    (cat==='همه' || x.category===cat) &&
    (!q || tf(x.title).toLowerCase().includes(q.toLowerCase()) || tf(x.description).toLowerCase().includes(q.toLowerCase()))
  ), [tools, cat, q, tf]);

  const toolMap: Record<string, ToolId> = {
    json: 'json',
    password: 'password',
    slug: 'slug',
    text: 'text',
    'image-checklist': 'image',
  };

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

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=?';
    const cryptoApi = typeof crypto !== 'undefined' ? crypto : undefined;
    const arr = new Uint32Array(passLength);
    cryptoApi?.getRandomValues(arr);
    const value = Array.from({length: passLength}, (_, i) => chars[(arr[i] || Math.floor(Math.random()*chars.length)) % chars.length]).join('');
    setPassword(value);
  };

  const cleanText = useMemo(() => normalizePersian(textInput)
    .replace(/\s+([،؛:.!?؟])/g, '$1')
    .replace(/([،؛:.!?؟])([^\s])/g, '$1 $2'), [textInput]);
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  const slug = slugify(slugInput);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-7 md:py-10">
      <div className="grid lg:grid-cols-[1fr_330px] gap-4 mb-6 items-stretch">
        <GlassCard className="!p-6 md:!p-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber/10 text-amber border border-amber/20 px-3 py-1 text-[11.5px] mb-4">
            <WandSparkles size={13} /> {t('بدون ثبت‌نام، داخل مرورگر، سریع', 'No sign-up, in-browser, fast')}
          </div>
          <h1 className="text-[28px] md:text-[36px] font-[850] tracking-[-0.025em] flex items-center gap-2">
            <AppIcon name="tools" size={28} className="text-amber" />
            {t('ابزارهای آنلاین اَوید کیا','Avid Kiya Online Tools')}
          </h1>
          <p className="text-text-2 text-[13.5px] md:text-[14px] mt-3 leading-7 max-w-2xl">
            {t('ابزارهای روزمره توسعه و محتوا را مستقیم داخل سایت اجرا کن: JSON، رمز امن، اسلاگ، پاک‌سازی متن و چک‌لیست تصویر.', 'Run daily development and content utilities directly in the site: JSON, secure passwords, slugs, text cleanup and image checklist.')}
          </p>
        </GlassCard>
        <GlassCard className="!p-5 flex flex-col justify-center">
          <div className="text-[12px] text-text-3 mb-2">{t('جستجوی سریع ابزار', 'Quick tool search')}</div>
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder={t('جستجوی ابزار…','Search tools…')}
            className="glass-input !w-full !py-[10px] text-[13px]"
          />
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[11px] text-text-3">
            <div className="rounded-[12px] bg-white/[0.035] py-2">{tools.length} ابزار</div>
            <div className="rounded-[12px] bg-white/[0.035] py-2">Client-side</div>
            <div className="rounded-[12px] bg-white/[0.035] py-2">Free</div>
          </div>
        </GlassCard>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5 text-[12.5px]">
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            className={`px-3 py-[7px] rounded-full border transition ${cat===c ? 'bg-primary text-[#052e28] border-primary font-[600]' : 'glass-card !px-3 !py-[7px] text-text-2 hover:text-text'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[310px_1fr] gap-4 items-start">
        <div className="space-y-2">
          {list.map(tool=>{
            const id = toolMap[tool.id] || 'json';
            return (
              <button key={tool.id} onClick={()=>setActive(id)} className={`w-full text-start transition rounded-[18px] ${active===id ? 'ring-1 ring-primary/40' : ''}`}>
                <GlassCard className={`!p-4 ${active===id ? 'bg-primary/[0.055]' : ''}`}>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="font-[700] text-[14px]">{tf(tool.title)}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-text-3">{tool.category}</span>
                  </div>
                  <div className="text-[12.5px] text-text-2 leading-relaxed">{tf(tool.description)}</div>
                </GlassCard>
              </button>
            );
          })}
          {list.length===0 && <GlassCard className="!p-5 text-center text-text-3 text-[13px]">ابزاری پیدا نشد</GlassCard>}
        </div>

        <GlassCard className="!p-4 md:!p-5 min-h-[520px]">
          {active === 'json' && (
            <div id="json">
              <ToolTitle title="فرمت JSON" subtitle="اعتبارسنجی، pretty و minify" />
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

          {active === 'password' && (
            <div id="password">
              <ToolTitle title="سازنده رمز امن" subtitle="رمز قوی، تصادفی و قابل کپی" />
              <label className="text-[12.5px] text-text-2">طول رمز: {passLength}</label>
              <input type="range" min={10} max={48} value={passLength} onChange={e=>setPassLength(Number(e.target.value))} className="w-full mt-2" />
              <div dir="ltr" className="mt-4 rounded-[16px] border border-glass-border bg-white/[0.035] px-4 py-5 font-mono text-[15px] break-all min-h-[70px] flex items-center">
                {password || 'Click Generate…'}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={generatePassword} className="glass-btn-primary !py-2 !px-4 text-[12.5px]">Generate</button>
                <button onClick={()=>copy('password', password)} disabled={!password} className="glass-btn !py-2 !px-4 text-[12.5px] inline-flex items-center gap-1 disabled:opacity-40"><Copy size={13}/> {copied==='password' ? 'کپی شد' : 'کپی'}</button>
              </div>
            </div>
          )}

          {active === 'slug' && (
            <div id="slug">
              <ToolTitle title="ساخت اسلاگ" subtitle="عنوان فارسی یا انگلیسی را به URL تمیز تبدیل کن" />
              <input value={slugInput} onChange={e=>setSlugInput(e.target.value)} className="glass-input w-full" />
              <div dir="ltr" className="mt-3 rounded-[16px] border border-glass-border bg-white/[0.035] p-4 font-mono text-[13px] break-all">{slug || '—'}</div>
              <button onClick={()=>copy('slug', slug)} className="glass-btn-primary !py-2 !px-4 text-[12.5px] mt-3 inline-flex items-center gap-1"><Copy size={13}/> {copied==='slug' ? 'کپی شد' : 'کپی اسلاگ'}</button>
            </div>
          )}

          {active === 'text' && (
            <div id="text">
              <ToolTitle title="پاک‌سازی متن" subtitle="نرمال‌سازی فارسی، حذف فاصله اضافه و شمارش کلمات" />
              <textarea value={textInput} onChange={e=>setTextInput(e.target.value)} rows={8} className="glass-input w-full resize-y" />
              <div className="grid sm:grid-cols-3 gap-2 my-3 text-[12px] text-text-3">
                <div className="rounded-[12px] bg-white/[0.035] p-3">کلمات: <b className="text-text">{wordCount}</b></div>
                <div className="rounded-[12px] bg-white/[0.035] p-3">کاراکتر: <b className="text-text">{cleanText.length}</b></div>
                <div className="rounded-[12px] bg-white/[0.035] p-3">خط‌ها: <b className="text-text">{cleanText ? cleanText.split('\n').length : 0}</b></div>
              </div>
              <div className="rounded-[16px] border border-glass-border bg-white/[0.035] p-4 text-[13px] leading-7 min-h-[90px]">{cleanText || '—'}</div>
              <button onClick={()=>copy('text', cleanText)} className="glass-btn-primary !py-2 !px-4 text-[12.5px] mt-3 inline-flex items-center gap-1"><Copy size={13}/> {copied==='text' ? 'کپی شد' : 'کپی متن تمیز'}</button>
            </div>
          )}

          {active === 'image' && (
            <div id="image">
              <ToolTitle title="چک‌لیست بهینه‌سازی تصویر" subtitle="قبل از انتشار صفحه محصول یا مقاله" />
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'از WebP/AVIF برای تصاویر بزرگ استفاده کن.',
                  'عرض تصویر hero را دقیقاً متناسب با layout خروجی بگیر.',
                  'برای هر تصویر alt توصیفی و کوتاه بنویس.',
                  'تصاویر پایین صفحه را lazy-load کن.',
                  'حجم تصویرهای محتوایی را زیر ۲۵۰KB نگه دار.',
                  'نام فایل را SEO-friendly و بدون فاصله انتخاب کن.',
                ].map(item=>(
                  <div key={item} className="rounded-[14px] border border-glass-border bg-white/[0.035] p-3 text-[12.8px] text-text-2 flex gap-2 leading-6">
                    <Check size={15} className="text-emerald shrink-0 mt-1" /> {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function ToolTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[20px] font-[800] tracking-[-0.015em]">{title}</h2>
      <p className="text-[12.5px] text-text-3 mt-1">{subtitle}</p>
    </div>
  );
}
