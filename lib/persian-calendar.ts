/**
 * Persian (Jalali) + Achaemenid (Iranian ancient) calendar helpers.
 *
 * Achaemenid year = Jalali year + 1180 (traditional convention:
 * Cyrus's coronation ≈ 559 BCE → Iranian ancient year 3585 in 2025).
 * We use the widely-cited offset 1180 so year 1404 SH → 2584 AC / 2584 IY.
 */

export interface PersianDate {
  y: number;
  m: number;   // 1..12
  d: number;   // 1..31
  yFa: string; // year in Persian digits
  mName: string; // month name (fa)
  dow: string;  // day of week (fa)
  ac: number;   // Achaemenid year
  hijri?: { y: number; m: number; d: number };
}

const MONTHS_FA = [
  "فروردین", "اردیبهشت", "خرداد",
  "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر",
  "دی", "بهمن", "اسفند",
];
const DAYS_FA = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

export function toFaDigits(input: string | number): string {
  const src = String(input);
  const map = "۰۱۲۳۴۵۶۷۸۹";
  return src.replace(/\d/g, (d) => map[+d]);
}

/* ─── Gregorian → Jalali (Iranian civil calendar) ─────────────
   Reference algorithm: Farhad Reza (public domain). */
function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

export function currentPersianDate(now: Date = new Date()): PersianDate {
  const [jy, jm, jd] = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  const dow = DAYS_FA[now.getDay()];
  return {
    y: jy,
    m: jm,
    d: jd,
    yFa: toFaDigits(jy),
    mName: MONTHS_FA[jm - 1],
    dow,
    ac: jy + 1180,
  };
}

/* ─── Ancient Iranian occasions ────────────────────────────────
   List of Achaemenid / Iranian ancient events, keyed by Jalali month/day.
   Bilingual descriptions.
   Sources: Iranian traditional calendars, Cyrus Cylinder anniversary,
   Mehregan, Yalda, Nowruz, Sepandarmazgan, etc.
*/

export interface Occasion {
  m: number;
  d: number;
  title_fa: string;
  title_en: string;
}

export const OCCASIONS: Occasion[] = [
  { m: 1,  d: 1,  title_fa: "نوروز باستان",              title_en: "Nowruz — Persian New Year" },
  { m: 1,  d: 6,  title_fa: "زادروز زرتشت",              title_en: "Zoroaster's birthday" },
  { m: 1,  d: 13, title_fa: "سیزده‌بدر (روز طبیعت)",     title_en: "Sizdah Bedar (Nature Day)" },
  { m: 2,  d: 2,  title_fa: "گاهنبار میدیوزَرم",         title_en: "Gahanbar Maidyozarem" },
  { m: 2,  d: 10, title_fa: "چهارشنبه‌سوری باستان",     title_en: "Ancient fire festival" },
  { m: 3,  d: 6,  title_fa: "روز داریوش بزرگ",           title_en: "Darius the Great Day" },
  { m: 4,  d: 13, title_fa: "جشن تیرگان",                title_en: "Tirgan Festival" },
  { m: 5,  d: 7,  title_fa: "جشن امردادگان",             title_en: "Amordadgan Festival" },
  { m: 6,  d: 4,  title_fa: "جشن شهریورگان",             title_en: "Shahrivargan Festival" },
  { m: 7,  d: 16, title_fa: "جشن مهرگان",                title_en: "Mehregan Festival" },
  { m: 7,  d: 29, title_fa: "روز کوروش بزرگ",            title_en: "Cyrus the Great Day" },
  { m: 8,  d: 10, title_fa: "جشن آبانگان",               title_en: "Abangan Festival" },
  { m: 9,  d: 9,  title_fa: "جشن آذرگان",                title_en: "Azargan Festival" },
  { m: 9,  d: 30, title_fa: "شب یلدا (چله)",              title_en: "Yalda Night" },
  { m: 10, d: 8,  title_fa: "جشن دیگان",                 title_en: "Deygan Festival" },
  { m: 11, d: 10, title_fa: "جشن سده",                   title_en: "Sadeh Festival" },
  { m: 11, d: 29, title_fa: "سپندارمزگان (روز عشق)",    title_en: "Sepandarmazgan (Love Day)" },
  { m: 12, d: 5,  title_fa: "جشن اسفندگان",              title_en: "Esfandegan Festival" },
];

/** Return today's occasion (if any). */
export function occasionFor(m: number, d: number): Occasion | null {
  return OCCASIONS.find((o) => o.m === m && o.d === d) ?? null;
}

/** Next upcoming occasion within the next 90 days. */
export function nextOccasion(from: PersianDate): Occasion | null {
  // Very approximate: linearize (m-1)*31 + d
  const cur = (from.m - 1) * 31 + from.d;
  const withDelta = OCCASIONS.map((o) => {
    const at = (o.m - 1) * 31 + o.d;
    return { o, delta: (at - cur + 372) % 372 };
  }).sort((a, b) => a.delta - b.delta);
  return withDelta[0]?.o ?? null;
}
