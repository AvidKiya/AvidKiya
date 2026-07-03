import { I18nText, Lang } from './cms/schema';

export function t(text: I18nText | string | undefined, lang: Lang): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] ?? text.fa ?? text.en ?? '';
}

export const uiStrings: Record<Lang, Record<string,string>> = {
  fa: {
    home: "خانه",
    projects: "پروژه‌ها",
    about: "درباره",
    resume: "رزومه",
    gifts: "هدیه‌ها",
    announcements: "اعلانات",
    comments: "نظرات",
    shop: "فروشگاه",
    admin: "مدیریت",
    viewWork: "مشاهده کارها",
    contact: "تماس",
    printCV: "چاپ رزومه",
    featuredWork: "کارهای برجسته",
    language: "زبان",
    theme: "تم",
    dark: "شب",
    light: "روز",
    editMode: "حالت ویرایش",
    save: "ذخیره",
    cancel: "لغو",
    delete: "حذف",
    edit: "ویرایش",
    add: "افزودن",
    search: "جستجو",
    filter: "فیلتر",
    all: "همه",
    active: "فعال",
    archive: "آرشیو",
    send: "ارسال",
    name: "نام",
    email: "ایمیل",
    message: "پیام",
    submit: "ثبت",
    buy: "خرید",
    download: "دانلود",
    donate: "حمایت",
    close: "بستن",
    open: "باز کردن",
    loading: "در حال بارگذاری...",
  },
  en: {
    home: "Home",
    projects: "Projects",
    about: "About",
    resume: "Resume",
    gifts: "Gifts",
    announcements: "Announcements",
    comments: "Comments",
    shop: "Shop",
    admin: "Admin",
    viewWork: "View Work",
    contact: "Contact",
    printCV: "Print CV",
    featuredWork: "Featured Work",
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    editMode: "Edit mode",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    all: "All",
    active: "Active",
    archive: "Archive",
    send: "Send",
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Submit",
    buy: "Buy",
    download: "Download",
    donate: "Donate",
    close: "Close",
    open: "Open",
    loading: "Loading...",
  }
};

export function ui(lang: Lang, key: string) {
  return uiStrings[lang][key] ?? key;
}

export const faDigits = (s: string | number) => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
export const enDigits = (s: string) => s.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
