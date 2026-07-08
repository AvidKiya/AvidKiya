import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit } from '@/lib/rate-limit';
import { kvGetJson, kvPutJson } from '@/lib/server/kv-storage';
import { makePlannerId, readPlannerList, writePlannerList } from '@/lib/server/planner-store';
import { sendTelegramMessage, setTelegramWebhook } from '@/lib/server/telegram';

export const runtime = 'edge';

interface TelegramMessage {
  message_id: number;
  from: { id: number; first_name: string; username?: string };
  chat: { id: number };
  text?: string;
}

type TelegramLink = { telegramUserId: number; chatId: number; licenseId: string; licenseCode: string; username?: string; firstName?: string; linkedAt: string };
type Task = { id: string; title: string; status: string; priority?: string; due?: string; createdAt: string };
type Goal = { id: string; title: string; level?: string; progress?: number; createdAt: string };
type HealthLog = { id: string; type: 'sleep'|'exercise'|'energy'|'mood'; value: number; date: string; createdAt: string };
type Note = { id: string; title: string; content?: string; tags?: string; createdAt: string };
type Capture = { id: string; text: string; category?: string; createdAt: string };

function tgKey(userId: number) { return `telegram:user:${userId}`; }
function codeKey(code: string) { return `kiya:license-code:${code.toUpperCase()}`; }
function today() { return new Date().toISOString().slice(0, 10); }
async function reply(chatId: number, text: string) { await sendTelegramMessage(chatId, text).catch(() => {}); }

async function getLink(userId: number) { return kvGetJson<TelegramLink | null>(tgKey(userId), null); }
async function requireLink(userId: number, chatId: number) {
  const link = await getLink(userId);
  if (!link) await reply(chatId, 'Please link your KIYA license first:\n/link KIYA-XXXX-XXXX-XXXX');
  return link;
}

function categorizeText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('todo') || lower.includes('task') || lower.includes('باید') || lower.includes('انجام')) return 'task';
  if (lower.includes('meeting') || lower.includes('جلسه') || lower.includes('time') || lower.includes('وقت')) return 'event';
  if (lower.includes('idea') || lower.includes('ایده')) return 'idea';
  return 'note';
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret && request.headers.get('x-telegram-bot-api-secret-token') !== secret) return errorResponse('Unauthorized', 401);

    const update = await request.json();
    if (!update.message) return successResponse(null);
    const message: TelegramMessage = update.message;
    const chatId = message.chat.id;
    const text = (message.text || '').trim();
    const userId = message.from.id;

    const rl = await checkRateLimit(`tg:${userId}`, { preset: 'telegram' });
    if (!rl.allowed) { await reply(chatId, 'Slow down a little. Try again in a few seconds.'); return successResponse(null); }

    if (text.startsWith('/start')) {
      {
        const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '';
        await reply(chatId, `Welcome to KIYA Bot. Link your license:\n/link KIYA-XXXX-XXXX-XXXX\n\nMini App: ${base ? `${base.replace(/\/$/, '')}/telegram/mini` : 'set NEXT_PUBLIC_SITE_URL'}\n\nCommands: /tasks /goals /status /energy /mood /idea /report /help`);
      }
      return successResponse(null);
    }

    if (text.startsWith('/link')) {
      const licenseCode = text.split(' ')[1]?.toUpperCase();
      if (!licenseCode) { await reply(chatId, 'Usage:\n/link KIYA-XXXX-XXXX-XXXX'); return successResponse(null); }
      const licenseId = await kvGetJson<string | null>(codeKey(licenseCode), null);
      if (!licenseId) { await reply(chatId, 'License was not found. Create it in the admin panel first.'); return successResponse(null); }
      const link: TelegramLink = { telegramUserId: userId, chatId, licenseId, licenseCode, username: message.from.username, firstName: message.from.first_name, linkedAt: new Date().toISOString() };
      await kvPutJson(tgKey(userId), link);
      await reply(chatId, 'License linked successfully. You can now use /tasks, /goals, /status, /energy 7, /idea your idea, or just send any text for quick capture.');
      return successResponse(null);
    }


    if (text.startsWith('/mini')) {
      const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '';
      await reply(chatId, base ? `Open KIYA Mini App:
${base.replace(/\/$/, '')}/telegram/mini` : 'Mini App URL is not configured. Set NEXT_PUBLIC_SITE_URL.');
      return successResponse(null);
    }

    if (text.startsWith('/help')) {
      await reply(chatId, 'KIYA Bot commands:\n/start\n/link KIYA-XXXX-XXXX-XXXX\n/mini - open Mini App\n/tasks\n/goals\n/status\n/report\n/energy [1-10]\n/mood [good|ok|bad]\n/idea [text]\nAny text = Quick Capture');
      return successResponse(null);
    }

    const link = await requireLink(userId, chatId);
    if (!link) return successResponse(null);
    const uid = link.licenseId;

    if (text.startsWith('/tasks')) {
      const tasks = await readPlannerList<Task>(uid, 'tasks');
      const open = tasks.filter(t => t.status !== 'done').slice(0, 8);
      await reply(chatId, open.length ? `Tasks:\n${open.map((t, i) => `${i+1}. ${t.title} (${t.status}${t.due ? `, due ${t.due}` : ''})`).join('\n')}` : 'No open tasks yet. Send any task text to capture it.');
      return successResponse(null);
    }

    if (text.startsWith('/goals')) {
      const goals = await readPlannerList<Goal>(uid, 'goals');
      await reply(chatId, goals.length ? `Goals:\n${goals.slice(0,8).map((g,i)=>`${i+1}. ${g.title} — ${g.progress ?? 0}%`).join('\n')}` : 'No goals yet.');
      return successResponse(null);
    }

    if (text.startsWith('/status') || text.startsWith('/report')) {
      const [tasks, goals, habits, health] = await Promise.all([
        readPlannerList<Task>(uid, 'tasks'), readPlannerList<Goal>(uid, 'goals'), readPlannerList<any>(uid, 'habits'), readPlannerList<HealthLog>(uid, 'health')
      ]);
      await reply(chatId, `Status:\nTasks: ${tasks.length} total, ${tasks.filter(t=>t.status==='done').length} done\nGoals: ${goals.length}\nHabits: ${habits.length}\nHealth logs: ${health.length}`);
      return successResponse(null);
    }

    if (text.startsWith('/energy')) {
      const value = Number(text.split(' ')[1]);
      if (!value || value < 1 || value > 10) { await reply(chatId, 'Usage: /energy 7'); return successResponse(null); }
      const rows = await readPlannerList<HealthLog>(uid, 'health');
      rows.push({ id: makePlannerId('health'), type: 'energy', value, date: today(), createdAt: new Date().toISOString() });
      await writePlannerList(uid, 'health', rows);
      await reply(chatId, `Energy logged: ${value}/10`);
      return successResponse(null);
    }

    if (text.startsWith('/mood')) {
      const mood = text.split(' ')[1];
      const map: Record<string, number> = { bad: 3, ok: 6, good: 9 };
      if (!map[mood]) { await reply(chatId, 'Usage: /mood good | ok | bad'); return successResponse(null); }
      const rows = await readPlannerList<HealthLog>(uid, 'health');
      rows.push({ id: makePlannerId('health'), type: 'mood', value: map[mood], date: today(), createdAt: new Date().toISOString() });
      await writePlannerList(uid, 'health', rows);
      await reply(chatId, `Mood logged: ${mood}`);
      return successResponse(null);
    }

    if (text.startsWith('/idea')) {
      const idea = text.replace('/idea', '').trim();
      if (!idea) { await reply(chatId, 'Usage: /idea your idea'); return successResponse(null); }
      const notes = await readPlannerList<Note>(uid, 'notes');
      notes.push({ id: makePlannerId('note'), title: idea.slice(0, 60), content: idea, tags: 'idea,telegram', createdAt: new Date().toISOString() });
      await writePlannerList(uid, 'notes', notes);
      await reply(chatId, `Idea saved: "${idea}"`);
      return successResponse(null);
    }

    if (text) {
      const captures = await readPlannerList<Capture>(uid, 'captures');
      const category = categorizeText(text);
      captures.push({ id: makePlannerId('capture'), text, category, createdAt: new Date().toISOString() });
      await writePlannerList(uid, 'captures', captures);
      await reply(chatId, `Saved as ${category}: "${text}"`);
    }

    return successResponse(null);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Failed to process request', 500);
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  if (url.searchParams.get('setup') === '1') {
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || `${url.protocol}//${url.host}`;
      const result = await setTelegramWebhook(`${base.replace(/\/$/, '')}/api/telegram/webhook`);
      return successResponse(result, 'Telegram webhook configured');
    } catch (error) {
      return errorResponse(error instanceof Error ? error.message : 'Telegram webhook setup failed', 500);
    }
  }
  return successResponse({ status: 'ok', configured: !!process.env.TELEGRAM_BOT_TOKEN });
}
