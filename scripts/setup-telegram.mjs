import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;
const site = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '').replace(/\/$/, '');
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!token || !site) {
  console.error('TELEGRAM_BOT_TOKEN and NEXT_PUBLIC_SITE_URL/SITE_URL are required');
  process.exit(1);
}
const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: `${site}/api/telegram/webhook`, secret_token: secret || undefined, allowed_updates: ['message'] }),
});
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
if (!data.ok) process.exit(1);
