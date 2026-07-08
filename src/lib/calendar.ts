// تقویم هخامنشی + شاهنشاهی + ایران باستان
// بر اساس 04-PERSIAN-CALENDAR.md

export const PERSIAN_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
export const PERSIAN_DAYS = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
export const ANCIENT_DAYS = ['هرمزد','بهمن','اردیبهشت','شهریور','سپندارمز','خورداد','امرداد','دی به آذر','آذر','آبان','خور','ماه','تیر','گوش','دی به مهر','مهر','سروش','رشن','فروردین','بهرام','رام','باد','دی','دین','ارد','اشتاد','آسمان','زامیاد','مانتیس','انارم'];

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
  let gy = (jy <= 979) ? 621 : 1600;
  jy = (jy <= 979) ? jy : jy - 979;
  let days = (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy += 400 * Math.floor(days / 146097);
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
  let gd = days + 1;
  const salA = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 1; gm <= 12 && gd > salA[gm]; gm++) {
    gd -= salA[gm];
  }
  return [gy, gm, gd];
}

// شمسی به شاهنشاهی
export function jalaliToImperial(jy: number): number { return jy + 1180; }

// میلادی به یزدگردی
export function gregorianToYazdgerdi(gy: number): number { return gy - 621; }

// نام روز باستانی
export function getAncientDayName(jd: number): string { return ANCIENT_DAYS[(jd - 1) % 30]; }

// تشخیص جشن
export function getFestival(jd: number, jm: number): string | null {
  const festivals: Record<string,string> = {
    '1-1': 'نوروز',
    '3-2': 'اردیبهشتگان',
    '6-3': 'خردادگان',
    '13-4': 'تیرگان',
    '16-7': 'مهرگان',
    '10-8': 'آبانگان',
    '9-9': 'آذرگان',
    '8-10': 'دیگان',
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
  const festival = getFestival(jd, jm);
  const weekDay = PERSIAN_DAYS[date.getDay() === 6 ? 0 : date.getDay() + 1]; // شنبه اول
  // تقریب
  return {
    gregorian: { y: gy, m: gm, d: gd },
    jalali: { y: jy, m: jm, d: jd, monthName: PERSIAN_MONTHS[jm-1], weekDay },
    imperial: { y: imperialYear, m: jm, d: jd },
    yazdgerdi: { y: yazdgerdiYear, m: jm, d: jd },
    ancientDay,
    festival,
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
  const all = [
    { text: 'Start simple, improve continuously, and let the site grow with your content.', author: 'System' },
    { text: 'A clean launch is better than a crowded demo.', author: 'System' },
    { text: 'Configure only what you need; leave the rest intentionally empty.', author: 'System' },
  ];
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(),0,0).getTime()) / 86400000);
  return all[dayOfYear % all.length];
}

// تقویم ماه کامل
export function getMonthCalendar(jy: number, jm: number, jdToday: number) {
  const daysInMonth = jm <= 6 ? 31 : jm <= 11 ? 30 : 29;
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
