// Persian (Shamsi/Jalali) Calendar Utilities
// Algorithm based on NASA's calendar calculations

const GREGORIAN_EPOCH = 1721425.5;
const PERSIAN_EPOCH = 1948320.5;

function div(a: number, b: number): number {
  return Math.floor(a / b);
}

function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b);
}

function leapGREGORIAN(y: number): boolean {
  return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
}

function gregorianToJD(year: number, month: number, day: number): number {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (year - 1) +
    Math.floor((year - 1) / 4) -
    Math.floor((year - 1) / 100) +
    Math.floor((year - 1) / 400) +
    Math.floor((367 * month - 362) / 12) +
    (month <= 2 ? 0 : leapGREGORIAN(year) ? -1 : -2) +
    day
  );
}

function jdToGregorian(jd: number): [number, number, number] {
  const wjd = Math.floor(jd - 0.5) + 0.5;
  const depoch = wjd - GREGORIAN_EPOCH;
  const quadricent = Math.floor(depoch / 146097);
  const dqc = mod(depoch, 146097);
  const cent = Math.floor(dqc / 36524);
  const dcent = mod(dqc, 36524);
  const quad = Math.floor(dcent / 1461);
  const dquad = mod(dcent, 1461);
  const yindex = Math.floor(dquad / 365);
  const year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
  if (cent !== 4 && yindex !== 4) {
    const yearDay = wjd - gregorianToJD(year, 1, 1);
    let month: number;
    if (wjd < gregorianToJD(year, 3, 1)) {
      month = Math.floor(yearDay / 31) + 1;
    } else {
      month = Math.floor((yearDay + 2) / 30.6) + 3;
    }
    const day = wjd - gregorianToJD(year, month, 1) + 1;
    return [year, month, day];
  }
  return [year, 1, 1];
}

function leapPERSIAN(year: number): boolean {
  return mod(year * 8 + 21, 33) < 8;
}

function persianToJD(year: number, month: number, day: number): number {
  const epbase = year - (year >= 0 ? 474 : 473);
  const epyear = 474 + mod(epbase, 2820) + 474;
  return (
    day +
    (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6) +
    Math.floor((epyear * 682 - 110) / 2816) +
    (epyear - 1) * 365 +
    Math.floor(epbase / 2820) * 1029983 +
    (PERSIAN_EPOCH - 1)
  );
}

function jdToPersian(jd: number): [number, number, number] {
  const depoch = jd - persianToJD(475, 1, 1);
  const cycle = Math.floor(depoch / 1029983);
  const cyear = mod(depoch, 1029983);
  let ycycle: number;
  if (cyear === 1029982) {
    ycycle = 2820;
  } else {
    const aux1 = Math.floor(cyear / 366);
    const aux2 = mod(cyear, 366);
    ycycle = Math.floor((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
  }
  let year = ycycle + 2820 * cycle + 474;
  if (year <= 0) year--;
  const yday = jd - persianToJD(year, 1, 1) + 1;
  const month = yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
  const day = jd - persianToJD(year, month, 1) + 1;
  return [year, month, day];
}

export interface PersianDate {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number; // 0=شنبه, 6=جمعه
  dayName: string;
  monthName: string;
}

const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const PERSIAN_WEEKDAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

const PERSIAN_DIGITS = ["۰","۱","۲","۳","۴","۵","۶","","۸","۹"];

export function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d)]);
}

export function getPersianDate(date: Date = new Date()): PersianDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();
  const jd = gregorianToJD(gYear, gMonth, gDay);
  const [year, month, day] = jdToPersian(jd);

  // Day of week (0=شنبه)
  const jsDay = date.getDay(); // 0=Sun
  // Convert: JS Sun=0 -> Persian شنبه=0 (Sat=6 in JS)
  const dayOfWeek = (jsDay + 1) % 7;

  return {
    year,
    month,
    day,
    dayOfWeek,
    dayName: PERSIAN_WEEKDAYS[dayOfWeek],
    monthName: PERSIAN_MONTHS[month - 1],
  };
}

export function getPersianMonthDays(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return leapPERSIAN(year) ? 30 : 29;
}

export function getFirstDayOfMonth(year: number, month: number): number {
  const jd = persianToJD(year, month, 1);
  const date = new Date();
  const gregorian = jdToGregorian(jd);
  const d = new Date(gregorian[0], gregorian[1] - 1, gregorian[2]);
  const jsDay = d.getDay();
  return (jsDay + 1) % 7;
}

export function gregorianToPersian(date: Date): PersianDate {
  return getPersianDate(date);
}

export function persianToGregorian(year: number, month: number, day: number): Date {
  const jd = persianToJD(year, month, day);
  const [gy, gm, gd] = jdToGregorian(jd);
  return new Date(gy, gm - 1, gd);
}

// Hakhmaneshi (Achaemenid) Calendar: Persian + 1180
export function getHakhmaneshiYear(persianYear: number): number {
  return persianYear + 1180;
}

// Persian calendar events
export interface CalendarEvent {
  month: number;
  day: number;
  nameFa: string;
  nameEn: string;
  type: "holiday" | "celebration" | "historical";
}

export const PERSIAN_EVENTS: CalendarEvent[] = [
  { month: 1, day: 1, nameFa: "نوروز", nameEn: "Nowruz", type: "holiday" },
  { month: 1, day: 2, nameFa: "عید نوروز", nameEn: "Nowruz Holiday", type: "holiday" },
  { month: 1, day: 3, nameFa: "عید نوروز", nameEn: "Nowruz Holiday", type: "holiday" },
  { month: 1, day: 4, nameFa: "عید نوروز", nameEn: "Nowruz Holiday", type: "holiday" },
  { month: 1, day: 12, nameFa: "روز جمهوری اسلامی", nameEn: "Islamic Republic Day", type: "historical" },
  { month: 1, day: 13, nameFa: "سیزده‌بدر", nameEn: "Sizdah Bedar", type: "celebration" },
  { month: 3, day: 14, nameFa: "رحلت امام خمینی", nameEn: "Demise of Imam Khomeini", type: "historical" },
  { month: 3, day: 15, nameFa: "قیام ۱۵ خرداد", nameEn: "15 Khordad", type: "historical" },
  { month: 6, day: 8, nameFa: "روز مبارزه با تروریسم", nameEn: "Anti-Terrorism Day", type: "historical" },
  { month: 7, day: 16, nameFa: "روز کودک", nameEn: "Children's Day", type: "celebration" },
  { month: 7, day: 24, nameFa: "روز پیوند اولیاء و مربیان", nameEn: "Parents-Teachers Day", type: "celebration" },
  { month: 10, day: 5, nameFa: "روز بزرگداشت خواجه نصیرالدین طوسی", nameEn: "Nasir al-Din al-Tusi Day", type: "historical" },
  { month: 10, day: 19, nameFa: "روز نیروی هوایی", nameEn: "Air Force Day", type: "historical" },
  { month: 11, day: 12, nameFa: "روز بزرگداشت خوارزمی", nameEn: "Khwarizmi Day", type: "historical" },
  { month: 11, day: 19, nameFa: "روز نیروی دریایی", nameEn: "Navy Day", type: "historical" },
  { month: 11, day: 22, nameFa: "پیروزی انقلاب اسلامی", nameEn: "Islamic Revolution Victory", type: "historical" },
  { month: 12, day: 5, nameFa: "روز بزرگداشت خواجوی کرمانی", nameEn: "Khwaju Kermani Day", type: "historical" },
  { month: 12, day: 14, nameFa: "روز احسان و نیکوکاری", nameEn: "Charity Day", type: "celebration" },
  { month: 12, day: 25, nameFa: "روز بزرگداشت فردوسی", nameEn: "Ferdowsi Day", type: "historical" },
  { month: 12, day: 29, nameFa: "روز ملی شدن نفت", nameEn: "Oil Nationalization Day", type: "historical" },
];

// Ancient Persian / Hakhmaneshi celebrations
export const HAKHMANESHI_EVENTS: CalendarEvent[] = [
  { month: 1, day: 1, nameFa: "نوروز هخامنشی", nameEn: "Achaemenid Nowruz", type: "celebration" },
  { month: 1, day: 6, nameFa: "روز زادروز کوروش بزرگ", nameEn: "Cyrus the Great Day", type: "celebration" },
  { month: 7, day: 1, nameFa: "جشن مهرگان", nameEn: "Mehregan", type: "celebration" },
  { month: 7, day: 16, nameFa: "روز مهر", nameEn: "Mithra Day", type: "celebration" },
  { month: 9, day: 1, nameFa: "آذرجشن", nameEn: "Azar Celebration", type: "celebration" },
  { month: 10, day: 1, nameFa: "روز دی", nameEn: "Day Celebration", type: "celebration" },
  { month: 10, day: 30, nameFa: "جشن سده", nameEn: "Sadeh", type: "celebration" },
  { month: 11, day: 5, nameFa: "سپندارمذگان", nameEn: "Sepandarmazgan", type: "celebration" },
  { month: 11, day: 10, nameFa: "جشن بهمنگان", nameEn: "Bahmanegan", type: "celebration" },
  { month: 4, day: 13, nameFa: "جشن تیرگان", nameEn: "Tirgan", type: "celebration" },
  { month: 5, day: 10, nameFa: "جشن مردگان", nameEn: "Mordadgan", type: "celebration" },
  { month: 12, day: 29, nameFa: "جشن اسفندگان", nameEn: "Esfandegan", type: "celebration" },
  { month: 12, day: 30, nameFa: "شب یلدا (چله)", nameEn: "Yalda Night", type: "celebration" },
];

export function getTodayEvent(): CalendarEvent | null {
  const p = getPersianDate();
  const event = [...PERSIAN_EVENTS, ...HAKHMANESHI_EVENTS].find(
    (e) => e.month === p.month && e.day === p.day
  );
  return event || null;
}

export function getNextEvent(): CalendarEvent | null {
  const p = getPersianDate();
  const all = [...PERSIAN_EVENTS, ...HAKHMANESHI_EVENTS].sort(
    (a, b) => a.month * 100 + a.day - (b.month * 100 + b.day)
  );
  const todayVal = p.month * 100 + p.day;
  const next = all.find((e) => e.month * 100 + e.day > todayVal);
  return next || all[0]; // Wrap to next year
}

export function getMonthCalendar(year: number, month: number): (number | null)[][] {
  const daysInMonth = getPersianMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}
