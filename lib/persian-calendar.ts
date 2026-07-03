// Lightweight Jalali conversion (Jalaali-js simplified)
function toJalaali(gy:number, gm:number, gd:number){
  const g_d_m=[0,31,59,90,120,151,181,212,243,273,304,334];
  const gy2 = (gm > 2)? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) { jy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let jm, jd;
  if (days < 186) { jm = 1 + Math.floor(days / 31); jd = 1 + (days % 31); }
  else { jm = 7 + Math.floor((days - 186) / 30); jd = 1 + ((days - 186) % 30); }
  return { jy, jm, jd };
}

export function nowJalali(){
  const d = new Date();
  const j = toJalaali(d.getFullYear(), d.getMonth()+1, d.getDate());
  return j;
}

const faMonths = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const faWeekdays = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه","شنبه"];

export function formatJalali(jy:number,jm:number,jd:number){
  return `${jd} ${faMonths[jm-1]} ${jy}`;
}

export function getWeekdayFa(date = new Date()){
  return faWeekdays[date.getDay()];
}

// Achaemenid year = jalali + 1180
export function achaemenidYear(jy:number){ return jy + 1180; }

const events: Record<string,string> = {
  "1-1": "جشن نوروز",
  "1-2": "نوروز",
  "1-3": "نوروز",
  "1-12": "روز جمهوری اسلامی",
  "1-13": "سیزده‌بدر",
  "6-31": "جشن شهریورگان",
  "7-16": "جشن مهرگان",
  "10-10": "جشن سده",
  "12-29": "چهارشنبه‌سوری",
  "7-7": "روز کوروش بزرگ",
  "9-30": "شب یلدا",
};

export function getEvent(jm:number, jd:number){
  return events[`${jm}-${jd}`] || null;
}

export function getUpcomingEvent(jm:number,jd:number){
  const keys = Object.keys(events).map(k=>{ const [m,d]=k.split('-').map(Number); return {m,d, text: events[k]} }).sort((a,b)=> a.m*31+a.d - (b.m*31+b.d));
  const today = jm*31+jd;
  for(const e of keys){ if(e.m*31+e.d >= today) return e.text; }
  return keys[0]?.text || "";
}

export function monthDays(jm:number, jy:number){
  if(jm<=6) return 31;
  if(jm<=11) return 30;
  // Esfand: leap approx
  const leap = ((jy % 33) % 4) === 1 ? 30 : 29;
  return leap;
}

// generate calendar grid
export function buildMonthGrid(jy:number, jm:number, jd_today:number){
  const days = monthDays(jm, jy);
  // weekday offset: find first day weekday (use g date approx)
  // Simplified: start at saturday grid
  let startOffset = 0;
  try {
    // crude
    const g = new Date();
    const firstDiff = jd_today -1;
    const first = new Date(g.getTime() - firstDiff*86400000);
    startOffset = (first.getDay()+1)%7; // sat=0
  } catch {}
  const cells: { day: number | null, today: boolean }[] = [];
  for(let i=0;i<startOffset;i++) cells.push({day:null, today:false});
  for(let d=1; d<=days; d++) cells.push({day:d, today: d===jd_today});
  while(cells.length % 7 !== 0) cells.push({day:null, today:false});
  return cells;
}

export const fullEventList = Object.entries(events).map(([k,v])=>{
  const [m,d]=k.split('-').map(Number);
  return { month: faMonths[m-1], day: d, title: v, m, d };
}).sort((a,b)=> a.m*10+a.d - b.m*10-b.d);
