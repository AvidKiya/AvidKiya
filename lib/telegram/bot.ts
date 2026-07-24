// Telegram Secretary Bot — AvidKiya
// Portfolio assistant mock

export interface TgUpdate {
  message?: { chat:{id:number}; text?:string; from?:{id:number; first_name?:string; username?:string} };
  callback_query?: any;
}

const COMMANDS: Record<string, string> = {
  '/start': `سلام! من دستیار تلگرام اَوید کیا هستم 👋

دستورات:
/status — وضعیت همکاری
/services — خدمات
/projects — نمونه‌کارها
/idea … — ثبت ایده پروژه
/search … — جستجو
/help

هر پیامی بفرستی = به‌عنوان درخواست یا ایده پروژه ثبت می‌شود.`,
  '/help': 'راهنما: /status /services /projects /idea /search',
  '/status': '📊 وضعیت: آماده بررسی پروژه‌های وب، AI و Cloudflare Edge\n⏱ پاسخ معمول: کمتر از ۱۲ ساعت',
  '/services': '🛠 خدمات:\n• Next.js Product Development\n• Cloudflare Edge Architecture\n• Automation & AI Agents\n• UI/UX & Portfolio Redesign',
  '/projects': '💼 نمونه‌کارها:\navidkiya.com/projects\n• DevHub OS\n• Shop & Tools Suite\n• Cloudflare Edge Architecture',
};

export async function handleTelegramUpdate(update: TgUpdate, env: { KIYA_DB?: any; BOT_TOKEN?: string }) {
  const msg = update.message;
  if (!msg) return { ok: true };
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();

  let reply = '';
  if (COMMANDS[text.split(' ')[0]]) {
    reply = COMMANDS[text.split(' ')[0]];
  } else if (text.startsWith('/idea')) {
    reply = `✅ ایده ثبت شد\n💡 ${text.replace('/idea','').trim().slice(0,80) || 'بدون عنوان'}\n\nبرای شروع رسمی، فرم تماس سایت را هم پر کن: avidkiya.com/contact`;
  } else if (text.startsWith('/search ')) {
    const q = text.replace('/search ','');
    reply = `🔍 نتیجه برای «${q}»:\n۱. نمونه‌کارها: avidkiya.com/projects\n۲. خدمات: avidkiya.com/services\n۳. ابزارها: avidkiya.com/tools`;
  } else if (text.length > 0) {
    reply = `✅ پیام دریافت شد\n📋 ${text.slice(0,80)}\n\nبرای پاسخ سریع‌تر: avidkiya.com/contact`;
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
        [{ text: '🌐 باز کردن سایت', url: 'https://avidkiya.com' }],
        [{ text: '💼 نمونه‌کارها', url: 'https://avidkiya.com/projects' }, { text: '✉️ تماس', url: 'https://avidkiya.com/contact' }]
      ]
    }
  };
}

export function validateTelegramInitData(initData: string, botToken: string): boolean {
  // TODO: HMAC-SHA256 check
  return true;
}
