const faDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
export function toFaDigits(input: string | number) { return String(input).replace(/\d/g, d => faDigits[Number(d)]); }
export function getPersianDate(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const parts = fmt.formatToParts(date);
  const year = Number(parts.find(p=>p.type==='year')?.value.replace(/[۰-۹]/g, d => String(faDigits.indexOf(d))) || '0');
  return { formatted: fmt.format(date), achaemenidYear: year + 1180 };
}
export const achaemenidEvents = [
  { month:1, day:1, name:{fa:'نوروز — آغاز سال نو', en:'Nowruz — Persian New Year'} },
  { month:1, day:13, name:{fa:'سیزده‌بدر', en:'Sizdah Be-dar'} },
  { month:7, day:10, name:{fa:'مهرگان', en:'Mehregan'} },
  { month:8, day:7, name:{fa:'روز کوروش بزرگ', en:'Cyrus the Great Day'} },
  { month:9, day:30, name:{fa:'شب یلدا', en:'Yalda Night'} },
  { month:12, day:29, name:{fa:'پایان سال و آمادگی نوروز', en:'Year-end Nowruz preparation'} },
];
export function todayOrNextEvent(lang: 'fa'|'en') {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', { month:'numeric', day:'numeric' }).formatToParts(now);
  const month = Number(parts.find(p=>p.type==='month')?.value || 1);
  const day = Number(parts.find(p=>p.type==='day')?.value || 1);
  const current = month * 100 + day;
  const sorted = [...achaemenidEvents].sort((a,b)=>a.month*100+a.day - (b.month*100+b.day));
  const today = sorted.find(e=>e.month===month && e.day===day);
  const next = today || sorted.find(e => e.month*100+e.day > current) || sorted[0];
  return { event: next.name[lang], isToday: !!today };
}
