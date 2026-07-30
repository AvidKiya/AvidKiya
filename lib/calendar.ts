// تقویم شمسی، میلادی، شاهنشاهی/اوستایی
import { DAILY_QUOTES_365 } from './calendar-quotes';

export const PERSIAN_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
export const AVESTAN_MONTHS = [
  { name:'فروردین', meaning:'فروهرها' },
  { name:'اردیبهشت', meaning:'بهترین راستی' },
  { name:'خرداد', meaning:'کمال و رسایی' },
  { name:'تیر', meaning:'ستاره باران‌آور' },
  { name:'اَمرداد', meaning:'بی‌مرگی و جاودانگی' },
  { name:'شهریور', meaning:'شهریاری آرمانی' },
  { name:'مهر', meaning:'پیمان و فروغ' },
  { name:'آبان', meaning:'آب‌ها' },
  { name:'آذر', meaning:'آتش' },
  { name:'دی', meaning:'آفریدگار' },
  { name:'بهمن', meaning:'اندیشه نیک' },
  { name:'اسفند', meaning:'فروتنی مقدس' },
];
export const GREGORIAN_MONTHS_FA = ['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
export const PERSIAN_DAYS = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];

export const AVESTAN_DAYS = [
  { name:'هرمزد', avestan:'Ahura Mazdā', meaning:'سرور دانا / آفریدگار', concept:'اهورامزدا', rest:true },
  { name:'بهمن', avestan:'Vohu Manah', meaning:'اندیشه نیک / منش نیک', concept:'وهومن', nabor:true },
  { name:'اردیبهشت', avestan:'Aša Vahišta', meaning:'بهترین راستی', concept:'اشه وهیشته' },
  { name:'شهریور', avestan:'Xšaθra Vairya', meaning:'شهریاری آرمانی', concept:'خشتره وییریه' },
  { name:'سپندارمذ', avestan:'Spənta Ārmaiti', meaning:'فروتنی و عشق مقدس', concept:'سپنتا آرمئیتی' },
  { name:'خرداد', avestan:'Haurvatāt', meaning:'کمال و رسایی', concept:'هئوروتات' },
  { name:'اَمرداد', avestan:'Amərətāt', meaning:'بی‌مرگی و جاودانگی', concept:'امرتات' },
  { name:'دی به آذر', avestan:'Daδuš-Ātar', meaning:'آفریدگار آتش', concept:'اهورامزدا', rest:true },
  { name:'آذر', avestan:'Ātar', meaning:'آتش', concept:'ایزد آذر' },
  { name:'آبان', avestan:'Āpō', meaning:'آب‌ها', concept:'ایزد آبان' },
  { name:'خور', avestan:'Hvar', meaning:'خورشید', concept:'ایزد خورشید' },
  { name:'ماه', avestan:'Māh', meaning:'ماه', concept:'ایزد ماه', nabor:true },
  { name:'تیر', avestan:'Tištrya', meaning:'ستاره باران‌آور', concept:'ایزد تیشتر' },
  { name:'گوش', avestan:'Gəuš', meaning:'جان جهان / جانوران', concept:'نگاهبان چارپایان', nabor:true },
  { name:'دی به مهر', avestan:'Daδuš-Miθra', meaning:'آفریدگار مهر', concept:'اهورامزدا', rest:true },
  { name:'مهر', avestan:'Miθra', meaning:'پیمان و فروغ', concept:'ایزد مهر' },
  { name:'سروش', avestan:'Sraoša', meaning:'الهام و فرمانبرداری', concept:'ایزد سروش' },
  { name:'رشن', avestan:'Rašnu', meaning:'دادگری', concept:'ایزد رشن' },
  { name:'فروردین', avestan:'Fravašayō', meaning:'فروهرها', concept:'فروشی‌ها' },
  { name:'بهرام', avestan:'Vərəθraγna', meaning:'پیروزی', concept:'ایزد بهرام' },
  { name:'رام', avestan:'Rāman', meaning:'آرامش و شادی', concept:'ایزد رام', nabor:true },
  { name:'باد', avestan:'Vāta', meaning:'باد', concept:'ایزد باد' },
  { name:'دی به دین', avestan:'Daδuš-Daēnā', meaning:'آفریدگار دین', concept:'اهورامزدا', rest:true },
  { name:'دین', avestan:'Daēnā', meaning:'وجدان و بینش درونی', concept:'ایزد دین' },
  { name:'اَرد', avestan:'Aši', meaning:'خوشبختی و دارایی', concept:'ایزد ارد' },
  { name:'اشتاد', avestan:'Arštāt', meaning:'راستی و عدالت', concept:'ایزد اشتاد' },
  { name:'آسمان', avestan:'Asman', meaning:'آسمان', concept:'ایزد آسمان' },
  { name:'زامیاد', avestan:'Zam', meaning:'زمین', concept:'ایزد زامیاد' },
  { name:'مهراسپند', avestan:'Manthra Spenta', meaning:'گفتار مقدس', concept:'کلام ایزدی' },
  { name:'انارام', avestan:'Anaghra Raočā', meaning:'روشنایی بی‌پایان', concept:'نور ابدی' },
];
export const ANCIENT_DAYS = AVESTAN_DAYS.map(d => d.name);

export type CalendarMode = 'imperial' | 'jalali' | 'gregorian';
export type CalendarCell = {
  key: string;
  day: number | null;
  label: string;
  subLabel?: string;
  title?: string;
  isToday?: boolean;
  isFestival?: boolean;
  isRest?: boolean;
  isNabor?: boolean;
};

// تبدیل میلادی به شمسی
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) { jy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let jm, jd;
  if (days < 186) { jm = 1 + Math.floor(days / 31); jd = 1 + (days % 31); }
  else { jm = 7 + Math.floor((days - 186) / 30); jd = 1 + ((days - 186) % 30); }
  return [jy, jm, jd];
}

// تبدیل شمسی به میلادی
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595;
  let days = -355668 + (365 * jy) + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd;
  days += (jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186;
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const gd = days + 1;
  const sal_a = [0,31,((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28,31,30,31,30,31,31,30,31,30,31];
  let gm = 0;
  let day = gd;
  for (gm = 1; gm <= 12 && day > sal_a[gm]; gm++) day -= sal_a[gm];
  return [gy, gm, day];
}

// شمسی به شاهنشاهی؛ مبدأ رسمی: ۵۵۹ پیش از میلاد، بنابراین ۱۴۰۵ = ۲۵۸۵
export function jalaliToImperial(jy: number): number { return jy + 1180; }

// میلادی به یزدگردی
export function gregorianToYazdgerdi(gy: number): number { return gy - 621; }

// نام روز اوستایی
export function getAncientDayName(jd: number): string { return AVESTAN_DAYS[(jd - 1) % 30].name; }
export function getAvestanDayInfo(jd: number) { return AVESTAN_DAYS[(jd - 1) % 30]; }

export function getJalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  const [ny, nm, nd] = jalaliToGregorian(jy + 1, 1, 1);
  const [cy, cm, cd] = jalaliToGregorian(jy, 1, 1);
  const diff = (Date.UTC(ny, nm - 1, nd) - Date.UTC(cy, cm - 1, cd)) / 86400000;
  return diff === 366 ? 30 : 29;
}

export function getGregorianMonthLength(gy: number, gm: number): number {
  return new Date(gy, gm, 0).getDate();
}

function weekIndexSaturdayFirst(date: Date): number {
  return date.getDay() === 6 ? 0 : date.getDay() + 1;
}

// تشخیص جشن
export function getFestival(jd: number, jm: number): string | null {
  const festivals: Record<string,string> = {
    '1-1': 'نوروز',
    '19-1': 'فروردین‌گان',
    '3-2': 'اردیبهشتگان',
    '6-3': 'خردادگان',
    '13-4': 'تیرگان',
    '7-5': 'اَمردادگان',
    '4-6': 'شهریورگان',
    '16-7': 'مهرگان',
    '10-8': 'آبانگان',
    '9-9': 'آذرگان',
    '1-10': 'دیگان',
    '8-10': 'دیگان',
    '15-10': 'دیگان',
    '23-10': 'دیگان',
    '2-11': 'بهمن‌گان',
    '5-12': 'سپندارمذگان',
    '30-9': 'یلدا',
    '7-8': 'روز کوروش بزرگ',
  };
  return festivals[`${jd}-${jm}`] || null;
}

// عدد فارسی
export function toPersianDigits(n: number | string): string {
  const fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(n).replace(/\d/g, d => fa[+d]);
}

// تاریخ کامل امروز
export function getTodayCalendar(date = new Date()) {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
  const imperialYear = jalaliToImperial(jy);
  const yazdgerdiYear = gregorianToYazdgerdi(gy);
  const ancientDay = getAncientDayName(jd);
  const avestanDay = getAvestanDayInfo(jd);
  const festival = getFestival(jd, jm);
  const weekDay = PERSIAN_DAYS[weekIndexSaturdayFirst(date)];
  return {
    gregorian: { y: gy, m: gm, d: gd, monthName: GREGORIAN_MONTHS_FA[gm - 1] },
    jalali: { y: jy, m: jm, d: jd, monthName: PERSIAN_MONTHS[jm-1], weekDay },
    imperial: { y: imperialYear, m: jm, d: jd, monthName: AVESTAN_MONTHS[jm-1].name },
    yazdgerdi: { y: yazdgerdiYear, m: jm, d: jd },
    ancientDay,
    avestanDay,
    festival,
  };
}

export function getCalendarGrid(mode: CalendarMode, cal = getTodayCalendar()) {
  const weekDays = ['ش','ی','د','س','چ','پ','ج'];
  const cells: CalendarCell[] = [];
  const pushBlanks = (count: number) => {
    for (let i = 0; i < count; i++) cells.push({ key:`blank-${i}`, day:null, label:'' });
  };

  if (mode === 'gregorian') {
    const days = getGregorianMonthLength(cal.gregorian.y, cal.gregorian.m);
    const first = new Date(cal.gregorian.y, cal.gregorian.m - 1, 1);
    pushBlanks(weekIndexSaturdayFirst(first));
    for (let day = 1; day <= days; day++) {
      const gDate = new Date(cal.gregorian.y, cal.gregorian.m - 1, day);
      const [jy, jm, jd] = gregorianToJalali(cal.gregorian.y, cal.gregorian.m, day);
      cells.push({
        key:`g-${day}`,
        day,
        label: toPersianDigits(day),
        subLabel: toPersianDigits(jd),
        isToday: day === cal.gregorian.d,
        title: `${day} ${GREGORIAN_MONTHS_FA[cal.gregorian.m - 1]} ${cal.gregorian.y} — ${PERSIAN_DAYS[weekIndexSaturdayFirst(gDate)]} — برابر ${toPersianDigits(`${jy}/${jm}/${jd}`)}`,
      });
    }
    return {
      weekDays,
      cells,
      title: `${GREGORIAN_MONTHS_FA[cal.gregorian.m - 1]} ${cal.gregorian.y}`,
      todayLabel: `${cal.gregorian.d} ${GREGORIAN_MONTHS_FA[cal.gregorian.m - 1]} ${cal.gregorian.y}`,
      meta: 'تقویم میلادی با نمایش ریزتاریخ شمسی در هر روز',
    };
  }

  const jy = cal.jalali.y;
  const jm = cal.jalali.m;
  const days = getJalaliMonthLength(jy, jm);
  const [fgY, fgM, fgD] = jalaliToGregorian(jy, jm, 1);
  pushBlanks(weekIndexSaturdayFirst(new Date(fgY, fgM - 1, fgD)));

  for (let day = 1; day <= days; day++) {
    const avestan = getAvestanDayInfo(day);
    const festival = getFestival(day, jm);
    const [gy, gm, gd] = jalaliToGregorian(jy, jm, day);
    cells.push({
      key:`j-${day}`,
      day,
      label: mode === 'imperial' ? avestan.name : toPersianDigits(day),
      subLabel: mode === 'imperial' ? toPersianDigits(day) : avestan.name,
      isToday: day === cal.jalali.d,
      isFestival: !!festival,
      isRest: !!avestan.rest,
      isNabor: !!avestan.nabor,
      title: mode === 'imperial'
        ? `روز ${avestan.name}، ماه ${AVESTAN_MONTHS[jm - 1].name} — ${avestan.meaning}${festival ? ` — ${festival}` : ''}`
        : `${toPersianDigits(day)} ${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)} — ${gy}/${gm}/${gd}${festival ? ` — ${festival}` : ''}`,
    });
  }

  return {
    weekDays,
    cells,
    title: mode === 'imperial'
      ? `${AVESTAN_MONTHS[jm - 1].name} ${toPersianDigits(jalaliToImperial(jy))}`
      : `${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`,
    todayLabel: mode === 'imperial'
      ? `روز ${cal.avestanDay.name}، ماه ${AVESTAN_MONTHS[jm - 1].name}، سال ${toPersianDigits(cal.imperial.y)}`
      : `${toPersianDigits(cal.jalali.d)} ${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`,
    meta: mode === 'imperial'
      ? `شاهنشاهی ایران؛ روزها با نام‌های اوستایی نمایش داده می‌شوند. ${AVESTAN_MONTHS[jm - 1].meaning}`
      : 'تقویم هجری شمسی با نام روزهای اوستایی در زیر هر روز',
  };
}

// سخنان بزرگان
export const QUOTES = {
  kourosh: [
    'من کوروش، شاه بزرگ، شاه شاهان، شاه سرزمین‌های پهناور...',
    'هر کس آزاد است که دین خود را انتخاب کند',
    'اگر می‌خواهی دوست داشته باشی، اول باید ببخشی',
    'من آزادی و امنیت را به همه مردم هدیه می‌کنم',
    'بهترین رهبر کسی است که مردمش را خوشبخت کند',
    'رفتار نیک، گفتار نیک، پندار نیک',
    'فرمان دادم که همه مردم در پرستش خدای خود آزاد باشند',
    'عدالت، پایه‌ی پایداری حکومت است',
    'مردم را به زور نمی‌توان خوشبخت کرد',
    'بزرگی یک ملت به بزرگی دل مردمانش است',
    'صلح بهتر از جنگ است، حتی اگر پیروزی در جنگ باشد',
    'بخشش، نشانه‌ی قدرت است نه ضعف',
    'حقیقت را بگو حتی اگر تلخ باشد',
    'کار امروز را به فردا مسپار',
    'دانش، روشنایی راه است',
  ],
  mohammadReza: [
    'ما باید ایران را بسازیم',
    'تمدن بزرگ، هدف ماست',
    'ایران باید به جایگاه واقعی خود بازگردد',
    'پیشرفت ایران، آرزوی من است',
    'ما به سوی تمدن بزرگ در حرکتیم',
    'آموزش، کلید پیشرفت یک ملت است',
    'زنان، نیمی از نیروی سازنده‌ی کشورند',
  ],
  rezaShah: [
    'ایران باید مدرن شود',
    'ما باید از عقب‌ماندگی نجات یابیم',
    'راه‌آهن، شاهرگ حیاتی کشور است',
    'نظم و انضباط، پایه‌ی پیشرفت است',
    'ایران نوین، ایران قوی',
  ]
};

export function getDailyQuote(date = new Date()): { text: string; author: string } {
  const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const dayOfYear = Array.from({ length: jm - 1 }, (_, i) => getJalaliMonthLength(jy, i + 1))
    .reduce((sum, days) => sum + days, 0) + jd - 1;
  const q = DAILY_QUOTES_365[dayOfYear % DAILY_QUOTES_365.length];
  return { text: q.text, author: q.author };
}

// سازگاری با نسخه قبلی
export function getMonthCalendar(jy: number, jm: number, jdToday: number) {
  const daysInMonth = getJalaliMonthLength(jy, jm);
  return Array.from({length: daysInMonth}, (_, i) => {
    const day = i + 1;
    return {
      day,
      isToday: day === jdToday,
      ancientName: getAncientDayName(day),
      festival: getFestival(day, jm),
    };
  });
}
