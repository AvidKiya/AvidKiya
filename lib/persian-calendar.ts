// Persian Calendar Utilities
// Based on jalaali-js algorithm

const PERSIAN_MONTHS_FA = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const PERSIAN_MONTHS_EN = [
  'Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar',
  'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'
];

const PERSIAN_WEEKDAYS_FA = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const PERSIAN_WEEKDAYS_FULL_FA = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
const PERSIAN_WEEKDAYS_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Hakhameneshi occasions (Persian calendar celebrations)
interface Occasion {
  month: number;
  day: number;
  titleFa: string;
  titleEn: string;
}

const HAKHAMENESHI_OCCASIONS: Occasion[] = [
  { month: 1, day: 1, titleFa: 'نوروز', titleEn: 'Nowruz' },
  { month: 1, day: 2, titleFa: 'نوروز', titleEn: 'Nowruz' },
  { month: 1, day: 3, titleFa: 'نوروز', titleEn: 'Nowruz' },
  { month: 1, day: 4, titleFa: 'نوروز', titleEn: 'Nowruz' },
  { month: 1, day: 6, titleFa: 'روز امید', titleEn: 'Day of Hope' },
  { month: 1, day: 13, titleFa: 'سیزده‌بدر', titleEn: 'Sizdah Bedar' },
  { month: 2, day: 10, titleFa: 'جشن اردیبهشتگان', titleEn: 'Ordibehesht Festival' },
  { month: 3, day: 6, titleFa: 'جشن خردادگان', titleEn: 'Khordadgan Festival' },
  { month: 4, day: 13, titleFa: 'جشن تیرگان', titleEn: 'Tirgan Festival' },
  { month: 5, day: 7, titleFa: 'جشن مردادگان', titleEn: 'Mordadgan Festival' },
  { month: 6, day: 4, titleFa: 'جشن شهریورگان', titleEn: 'Shahrivargan Festival' },
  { month: 6, day: 31, titleFa: 'روز کوروش بزرگ', titleEn: 'Cyrus the Great Day' },
  { month: 7, day: 10, titleFa: 'جشن مهرگان', titleEn: 'Mehregan Festival' },
  { month: 7, day: 16, titleFa: 'روز کوروش بزرگ', titleEn: 'Cyrus Day' },
  { month: 8, day: 10, titleFa: 'جشن آبانگان', titleEn: 'Abanagan Festival' },
  { month: 9, day: 1, titleFa: 'جشن آذرگان', titleEn: 'Azaragan Festival' },
  { month: 9, day: 30, titleFa: 'شب یلدا', titleEn: 'Yalda Night' },
  { month: 10, day: 1, titleFa: 'جشن دیگان', titleEn: 'Deygan Festival' },
  { month: 10, day: 5, titleFa: 'روز زرتشت', titleEn: 'Zoroaster Day' },
  { month: 11, day: 2, titleFa: 'جشن بهمنگان', titleEn: 'Bahmanagan Festival' },
  { month: 11, day: 22, titleFa: 'جشن سپندارمذگان', titleEn: 'Sepandarmazgan' },
  { month: 12, day: 5, titleFa: 'جشن اسفندگان', titleEn: 'Esfandgan Festival' },
  { month: 12, day: 19, titleFa: 'جشن فروردینگان', titleEn: 'Farvardingan Festival' },
  { month: 12, day: 29, titleFa: 'چهارشنبه‌سوری', titleEn: 'Chaharshanbe Suri' }
];

// Jalaali conversion functions
function div(a: number, b: number): number {
  return Math.floor(a / b);
}

function mod(a: number, b: number): number {
  return a - div(a, b) * b;
}

function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
    1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
  ];
  
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jm, jump, leap, n, i;

  for (i = 1; i < bl; i++) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump!, 33) === 4 && jump! - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump! - n < 6) n = n - jump! + div(jump! + 4, 33) * 33;
  leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  
  return { leap, gy, march };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return (
    gregorianToJulian(r.gy, 3, r.march) +
    (jm - 1) * 31 -
    div(jm, 7) * (jm - 7) +
    jd -
    1
  );
}

function d2j(jdn: number): { jy: number; jm: number; jd: number } {
  const gy = julianToGregorian(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = gregorianToJulian(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      const jm = 1 + div(k, 31);
      const jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    } else {
      k -= 186;
    }
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  const jm = 7 + div(k, 30);
  const jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

function gregorianToJulian(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function julianToGregorian(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

// Public API
export function toJalaali(date: Date): { jy: number; jm: number; jd: number } {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  const jdn = gregorianToJulian(gy, gm, gd);
  return d2j(jdn);
}

export function toGregorian(jy: number, jm: number, jd: number): Date {
  const jdn = j2d(jy, jm, jd);
  const g = julianToGregorian(jdn);
  return new Date(g.gy, g.gm - 1, g.gd);
}

export function isLeapJalaaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

export function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

export function getPersianWeekday(date: Date): number {
  // Saturday = 0, Sunday = 1, ..., Friday = 6
  const day = date.getDay();
  return (day + 1) % 7;
}

export function getHakhameneshiYear(jy: number): number {
  return jy + 1180;
}

export function getTodayOccasion(jm: number, jd: number, lang: 'fa' | 'en'): string | null {
  const occasion = HAKHAMENESHI_OCCASIONS.find(o => o.month === jm && o.day === jd);
  if (occasion) {
    return lang === 'fa' ? occasion.titleFa : occasion.titleEn;
  }
  return null;
}

export function getNextOccasion(jm: number, jd: number, lang: 'fa' | 'en'): { title: string; daysLeft: number } | null {
  // Sort occasions and find the next one
  const sorted = [...HAKHAMENESHI_OCCASIONS].sort((a, b) => {
    const aVal = a.month * 100 + a.day;
    const bVal = b.month * 100 + b.day;
    return aVal - bVal;
  });
  
  const currentVal = jm * 100 + jd;
  
  for (const occasion of sorted) {
    const occasionVal = occasion.month * 100 + occasion.day;
    if (occasionVal > currentVal) {
      // Calculate days left (simplified)
      let daysLeft = 0;
      for (let m = jm; m < occasion.month; m++) {
        daysLeft += jalaaliMonthLength(1403, m); // Use current year
      }
      daysLeft += occasion.day - jd;
      
      return {
        title: lang === 'fa' ? occasion.titleFa : occasion.titleEn,
        daysLeft
      };
    }
  }
  
  // Next year's Nowruz
  return {
    title: lang === 'fa' ? 'نوروز' : 'Nowruz',
    daysLeft: 365 - (jm * 30 + jd) + 1
  };
}

export function getAllOccasions(): Occasion[] {
  return HAKHAMENESHI_OCCASIONS;
}

export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, d => persianDigits[parseInt(d)]);
}

export function getPersianMonthName(month: number, lang: 'fa' | 'en'): string {
  return lang === 'fa' ? PERSIAN_MONTHS_FA[month - 1] : PERSIAN_MONTHS_EN[month - 1];
}

export function getPersianWeekdayName(weekday: number, lang: 'fa' | 'en', full = false): string {
  if (lang === 'fa') {
    return full ? PERSIAN_WEEKDAYS_FULL_FA[weekday] : PERSIAN_WEEKDAYS_FA[weekday];
  }
  return PERSIAN_WEEKDAYS_EN[weekday];
}

export function getMonthDays(jy: number, jm: number): { day: number; weekday: number; isHoliday: boolean; occasion?: string }[] {
  const days: { day: number; weekday: number; isHoliday: boolean; occasion?: string }[] = [];
  const monthLength = jalaaliMonthLength(jy, jm);
  
  for (let d = 1; d <= monthLength; d++) {
    const gDate = toGregorian(jy, jm, d);
    const weekday = getPersianWeekday(gDate);
    const occasion = HAKHAMENESHI_OCCASIONS.find(o => o.month === jm && o.day === d);
    
    days.push({
      day: d,
      weekday,
      isHoliday: weekday === 6 || !!occasion, // Friday or occasion
      occasion: occasion?.titleFa
    });
  }
  
  return days;
}

export { PERSIAN_MONTHS_FA, PERSIAN_MONTHS_EN, PERSIAN_WEEKDAYS_FA, PERSIAN_WEEKDAYS_EN, PERSIAN_WEEKDAYS_FULL_FA };
