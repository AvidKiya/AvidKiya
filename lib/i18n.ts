import type { I18nText, Lang } from './cms/schema';
export function isI18nText(v: unknown): v is I18nText { return !!v && typeof v === 'object' && 'fa' in v && 'en' in v; }
export function resolveText(value: I18nText | string | undefined | null, lang: Lang): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.fa || value.en || '';
}
export const navItems = [
  { href:'/', label:{fa:'خانه', en:'Home'}, icon:'home' },
  { href:'/projects', label:{fa:'پروژه‌ها', en:'Projects'}, icon:'folder' },
  { href:'/about', label:{fa:'درباره', en:'About'}, icon:'terminal' },
  { href:'/resume', label:{fa:'رزومه', en:'Resume'}, icon:'fileText' },
  { href:'/gifts', label:{fa:'هدیه‌ها', en:'Gifts'}, icon:'gift' },
  { href:'/announcements', label:{fa:'اعلانات', en:'Announcements'}, icon:'megaphone' },
  { href:'/comments', label:{fa:'نظرات', en:'Comments'}, icon:'messageCircle' },
  { href:'/shop', label:{fa:'فروشگاه', en:'Shop'}, icon:'shoppingBag' },
  { href:'/admin', label:{fa:'ادمین', en:'Admin'}, icon:'lock' },
];
export const labels = {
  print: { fa:'چاپ رزومه', en:'Print CV' },
  contact: { fa:'تماس', en:'Contact' },
  language: { fa:'زبان', en:'Language' },
  theme: { fa:'تم', en:'Theme' },
};
