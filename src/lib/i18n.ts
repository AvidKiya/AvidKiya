import type { I18nText } from './cms/schema';

export type Lang = 'fa' | 'en';
export type Theme = 'dark' | 'light';

export function resolve(text: I18nText | string | undefined, lang: Lang): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.en || text.fa || '';
}

export const t: Record<string, Record<Lang, string>> = {
  home: { fa: 'خانه', en: 'Home' },
  projects: { fa: 'پروژه‌ها', en: 'Projects' },
  about: { fa: 'درباره من', en: 'About' },
  resume: { fa: 'رزومه', en: 'Resume' },
  gifts: { fa: 'هدیه‌ها', en: 'Gifts' },
  announcements: { fa: 'اعلانات', en: 'Announcements' },
  comments: { fa: 'نظرات', en: 'Comments' },
  shop: { fa: 'فروشگاه', en: 'Shop' },
  admin: { fa: 'مدیریت', en: 'Admin' },
  printResume: { fa: 'چاپ رزومه', en: 'Print Resume' },
  viewWork: { fa: 'مشاهده کارها', en: 'View Work' },
  contactMe: { fa: 'ارتباط با من', en: 'Contact Me' },
  sendMessage: { fa: 'ارسال پیام', en: 'Send Message' },
  name: { fa: 'نام', en: 'Name' },
  email: { fa: 'ایمیل', en: 'Email' },
  subject: { fa: 'موضوع', en: 'Subject' },
  message: { fa: 'پیام', en: 'Message' },
  submit: { fa: 'ارسال', en: 'Submit' },
  loading: { fa: 'در حال بارگذاری...', en: 'Loading...' },
  featuredWork: { fa: 'نمونه کارها', en: 'Featured Work' },
  allProjects: { fa: 'همه پروژه‌ها', en: 'All Projects' },
  viewAll: { fa: 'مشاهده همه', en: 'View All' },
  stars: { fa: 'ستاره', en: 'Stars' },
  forks: { fa: 'فورک', en: 'Forks' },
  download: { fa: 'دانلود', en: 'Download' },
  donate: { fa: 'حمایت مالی', en: 'Donate' },
  active: { fa: 'فعال', en: 'Active' },
  archive: { fa: 'آرشیو', en: 'Archive' },
  all: { fa: 'همه', en: 'All' },
  vote: { fa: 'رأی', en: 'Vote' },
  yourComment: { fa: 'نظر شما', en: 'Your Comment' },
  role: { fa: 'سمت', en: 'Role' },
  rating: { fa: 'امتیاز', en: 'Rating' },
  buy: { fa: 'خرید', en: 'Buy' },
  soldOut: { fa: 'تمام شد', en: 'Sold Out' },
  off: { fa: 'تخفیف', en: 'OFF' },
  login: { fa: 'ورود', en: 'Login' },
  password: { fa: 'رمز عبور', en: 'Password' },
  systemStatus: { fa: 'وضعیت سیستم', en: 'System Status' },
  search: { fa: 'جستجو', en: 'Search' },
  skills: { fa: 'مهارت‌ها', en: 'Skills' },
  contact: { fa: 'تماس', en: 'Contact' },
  experience: { fa: 'تجربیات', en: 'Experience' },
  education: { fa: 'تحصیلات', en: 'Education' },
  languagesLabel: { fa: 'زبان‌ها', en: 'Languages' },
  summary: { fa: 'خلاصه', en: 'Summary' },
  myGiftToYou: { fa: 'هدیه من به شما', en: 'My Gift to You' },
  yourGiftToMe: { fa: 'هدیه شما به من', en: 'Your Gift to Me' },
  subscribeNewsletter: { fa: 'عضویت در خبرنامه', en: 'Subscribe to Newsletter' },
  enterEmail: { fa: 'ایمیل خود را وارد کنید', en: 'Enter your email' },
  subscribe: { fa: 'عضویت', en: 'Subscribe' },
  successSubmit: { fa: 'با موفقیت ارسال شد!', en: 'Successfully submitted!' },
  errorSubmit: { fa: 'خطا در ارسال', en: 'Error submitting' },
  pending: { fa: 'در انتظار تأیید', en: 'Pending approval' },
  approved: { fa: 'تأیید شده', en: 'Approved' },
};

export function tl(key: string, lang: Lang): string {
  return t[key]?.[lang] || key;
}

/* Persian numerals */
const faDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
export function toPersianNum(n: number | string): string {
  return String(n).replace(/\d/g, d => faDigits[parseInt(d)]);
}
