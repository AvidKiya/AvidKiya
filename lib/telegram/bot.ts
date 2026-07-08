// Telegram Secretary Bot — KIYA
// Mini App ready

export interface TgUpdate {
  message?: { chat:{id:number}; text?:string; from?:{id:number; first_name?:string; username?:string} };
  callback_query?: any;
}

const COMMANDS: Record<string, string> = {
  '/start': `سلام! من منشی هوشمند KIYA هستم 🧠

دستورات:
/link KIYA-XXXX — اتصال حساب
/tasks — وظایف امروز
/status — آمار امروز
/report — گزارش هفتگی
/energy 1-10 — ثبت انرژی
/mood good|ok|bad
/idea … — ثبت ایده
/search … — جستجو
/help

هر پیامی بفرستی = Quick Capture با AI`,
  '/help': 'راهنما: /tasks /status /goals /energy /mood /idea /search /report',
  '/tasks': '📋 وظایف امروز\n□ گزارش مالی ⏰ فردا\n□ تماس با سارا\n☑ ورزش ✅',
  '/status': '📊 امروز:\n✅ ۳ تکمیل\n⏳ ۲ مانده\n🎯 ۱ هدف فعال\n🔥 Streak: ۵ روز\n⚡ انرژی: 7/10',
  '/report': '📊 هفته:\n✅ ۱۵/۲۰ وظیفه\n🎯 ۲ هدف پیشرفت\n💰 ۱,۲۰۰,۰۰۰ ت هزینه\n💡 بینش: ورزش → انرژی +۲',
};

export async function handleTelegramUpdate(update: TgUpdate, env: { KIYA_DB?: any; BOT_TOKEN?: string }) {
  const msg = update.message;
  if (!msg) return { ok: true };
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();

  let reply = '';
  if (text.startsWith('/link ')) {
    const code = text.split(' ')[1];
    reply = code?.startsWith('KIYA-') 
      ? `✅ حساب متصل شد!\n🔑 ${code}\n\nحالا هر پیامی = Quick Capture\n📱 داشبورد: /planner`
      : '❌ کد نامعتبر — فرمت: KIYA-XXXX-XXXX-XXXX';
  } else if (COMMANDS[text.split(' ')[0]]) {
    reply = COMMANDS[text.split(' ')[0]];
  } else if (text.startsWith('/energy')) {
    const n = parseInt(text.split(' ')[1]||'');
    reply = n>=1 && n<=10 ? `⚡ انرژی ${n}/10 ثبت شد\n📈 عالیه!` : 'عدد ۱ تا ۱۰ بفرست: /energy 7';
  } else if (text.startsWith('/mood')) {
    reply = '😊 خلق‌وخو ثبت شد — ممنون!';
  } else if (text.startsWith('/search ')) {
    const q = text.replace('/search ','');
    reply = `🔍 «${q}»\n۱. قرارداد X (۲ هفته پیش)\n۲. یادداشت قرارداد\n۳. وظیفه بررسی قرارداد`;
  } else if (text.length > 0) {
    // Quick Capture AI mock
    const types = ['TASK','NOTE','IDEA','GOAL','REMINDER'];
    const type = types[Math.floor(Math.random()*types.length)];
    reply = `✅ ثبت شد | ${type}\n📋 ${text.slice(0,60)}\n⏰ یادآوری تنظیم شد\n\n📱 مشاهده در داشبورد`;
  } else {
    reply = COMMANDS['/start'];
  }

  // In production: fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {...})
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text: reply,
    reply_markup: {
      inline_keyboard: [
        [{ text: '📱 باز کردن KIYA', web_app: { url: 'https://avidkiya.pages.dev/planner/app' } }],
        [{ text: '📋 وظایف', callback_data: 'tasks' }, { text: '📊 آمار', callback_data: 'stats' }]
      ]
    }
  };
}

// Mini App init validation (Telegram WebApp)
export function validateTelegramInitData(initData: string, botToken: string): boolean {
  // TODO: HMAC-SHA256 check
  // Phase5 stub — return true in dev
  return true;
}
