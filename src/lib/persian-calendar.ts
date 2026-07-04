/* ── Persian (Jalali) Calendar ── */

const MONTH_NAMES_FA = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const MONTH_NAMES_EN = ['Farvardin','Ordibehesht','Khordad','Tir','Mordad','Shahrivar','Mehr','Aban','Azar','Dey','Bahman','Esfand'];
const WEEKDAY_FA = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه','شنبه'];
const WEEKDAY_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function toJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0,31,(gy%4===0&&gy%100!==0)||(gy%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400);
  for (let i = 0; i < gm; i++) days += g_d_m[i];
  days += gd;
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) { jy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let jm: number, jd: number;
  if (days < 186) { jm = 1 + Math.floor(days / 31); jd = 1 + (days % 31); }
  else { days -= 186; jm = 7 + Math.floor(days / 30); jd = 1 + (days % 30); }
  return [jy, jm, jd];
}

export interface PersianDate {
  jy: number; jm: number; jd: number;
  monthName: string; monthNameEn: string;
  weekday: string; weekdayEn: string;
  akhYear: number;
}

export function getPersianDate(date: Date = new Date()): PersianDate {
  const [jy, jm, jd] = toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return {
    jy, jm, jd,
    monthName: MONTH_NAMES_FA[jm - 1],
    monthNameEn: MONTH_NAMES_EN[jm - 1],
    weekday: WEEKDAY_FA[date.getDay()],
    weekdayEn: WEEKDAY_EN[date.getDay()],
    akhYear: jy + 1180,
  };
}

/* ── Achaemenid / Iranian occasions ── */
interface Occasion { month: number; day: number; title: { fa: string; en: string } }

const OCCASIONS: Occasion[] = [
  { month: 1, day: 1, title: { fa: '🌿 نوروز — سال نو ایرانی', en: '🌿 Nowruz — Persian New Year' } },
  { month: 1, day: 2, title: { fa: 'نوروز', en: 'Nowruz' } },
  { month: 1, day: 3, title: { fa: 'نوروز', en: 'Nowruz' } },
  { month: 1, day: 4, title: { fa: 'نوروز', en: 'Nowruz' } },
  { month: 1, day: 13, title: { fa: '🌳 سیزده‌بدر', en: '🌳 Sizdah Bedar (Nature Day)' } },
  { month: 4, day: 1, title: { fa: '☀️ جشن تیرگان', en: '☀️ Tirgan Festival' } },
  { month: 7, day: 2, title: { fa: '🔥 جشن مهرگان', en: '🔥 Mehregan Festival' } },
  { month: 7, day: 7, title: { fa: '📜 روز کوروش بزرگ', en: '📜 Cyrus the Great Day' } },
  { month: 8, day: 10, title: { fa: '🔥 جشن آبانگان', en: '🔥 Abanagan Festival' } },
  { month: 9, day: 1, title: { fa: '🔥 جشن آذرگان', en: '🔥 Azargan Festival' } },
  { month: 9, day: 30, title: { fa: '🌙 شب یلدا', en: '🌙 Yalda Night' } },
  { month: 10, day: 1, title: { fa: '🔥 جشن دیگان', en: '🔥 Dey Festival' } },
  { month: 11, day: 5, title: { fa: '🔥 جشن بهمنگان', en: '🔥 Bahmanagan Festival' } },
  { month: 12, day: 5, title: { fa: '🔥 جشن اسفندگان', en: '🔥 Esfandgan Festival' } },
  { month: 12, day: 29, title: { fa: '🔥 چهارشنبه‌سوری', en: '🔥 Chaharshanbe Suri' } },
];

export function getTodayOccasion(jm: number, jd: number): { fa: string; en: string } | null {
  const found = OCCASIONS.find(o => o.month === jm && o.day === jd);
  return found ? found.title : null;
}

export function getNextOccasion(jm: number, jd: number): { fa: string; en: string } {
  // Find next upcoming occasion
  for (const o of OCCASIONS) {
    if (o.month > jm || (o.month === jm && o.day > jd)) return o.title;
  }
  return OCCASIONS[0].title; // wrap around to Nowruz
}

export function getAllOccasions() { return OCCASIONS; }
