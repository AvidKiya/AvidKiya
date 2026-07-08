export function isTelegramConfigured() {
  return !!process.env.TELEGRAM_BOT_TOKEN;
}

export async function sendTelegramMessage(chatId: number | string, text: string, options?: { parseMode?: 'HTML' | 'MarkdownV2' }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log(`Telegram reply to ${chatId}: ${text}`);
    return { sent: false, reason: 'TELEGRAM_BOT_TOKEN is not configured' };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: options?.parseMode }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new Error(data?.description || `Telegram send failed: ${res.status}`);
  return { sent: true, data };
}

export async function setTelegramWebhook(url: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, secret_token: secretToken || undefined, allowed_updates: ['message'] }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new Error(data?.description || `Telegram webhook setup failed: ${res.status}`);
  return data;
}
