import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { checkRateLimit } from '@/lib/rate-limit';
import { makePlannerId, readPlannerList, requirePlannerUser, writePlannerList } from '@/lib/server/planner-store';
import { generateAiChat, isAiConfigured } from '@/lib/server/ai';
import { kvGetJson } from '@/lib/server/kv-storage';
import { defaultCmsState } from '@/lib/cms/default-state';
import type { CmsState } from '@/lib/cms/types';

export const runtime = 'edge';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; createdAt: string };
type Task = { title: string; status: string; priority?: string; due?: string };
type Goal = { title: string; level?: string; progress?: number };
type Habit = { name: string; frequency?: string };
type Note = { title: string; content?: string };
const COLLECTION = 'aiChat';

function detectCommand(text: string): { command: string; args: string } | null {
  const commands: Record<string, string> = { '/ثبت': 'log', '/وضعیت': 'status', '/روز': 'today', '/هفته': 'week', '/هدف‌ها': 'goals', '/تصمیم': 'decision', '/ایده': 'idea', '/انرژی': 'energy', '/log': 'log', '/status': 'status', '/today': 'today', '/week': 'week', '/goals': 'goals', '/idea': 'idea', '/energy': 'energy' };
  for (const [cmd, action] of Object.entries(commands)) if (text.startsWith(cmd)) return { command: action, args: text.slice(cmd.length).trim() };
  return null;
}

function fallbackResponse(text: string, command: { command: string; args: string } | null): string {
  if (command) {
    switch (command.command) {
      case 'log': return `Saved: "${command.args || text}"`;
      case 'status': return 'Today status: your planner data is stored and ready. Add tasks, habits and goals to get richer insights.';
      case 'today': return 'Today: review your top task, log habits, and capture one note.';
      case 'week': return 'Weekly summary will become more accurate as you add planner data.';
      case 'goals': return 'Open Goals to review active goals and progress.';
      case 'decision': return 'Consider priority, time cost, risk, and long-term impact.';
      case 'idea': return `Idea saved: "${command.args || text}"`;
      case 'energy': return `Energy logged: ${command.args || '7'}/10`;
      default: return 'Command was not recognized.';
    }
  }
  const lower = text.toLowerCase();
  if (lower.includes('hello') || lower.includes('سلام')) return 'Hi! How can I help you plan today?';
  if (lower.includes('help') || lower.includes('کمک')) return 'You can ask me to plan, capture ideas, review goals, or use /today, /week, /goals.';
  return 'Got it. What would you like to do next?';
}

async function plannerContext(userId: string) {
  const [tasks, goals, habits, notes] = await Promise.all([
    readPlannerList<Task>(userId, 'tasks'),
    readPlannerList<Goal>(userId, 'goals'),
    readPlannerList<Habit>(userId, 'habits'),
    readPlannerList<Note>(userId, 'notes'),
  ]);
  return [
    `Tasks: ${tasks.slice(-8).map(t => `${t.title} [${t.status}${t.priority ? `/${t.priority}` : ''}${t.due ? ` due ${t.due}` : ''}]`).join('; ') || 'none'}`,
    `Goals: ${goals.slice(-6).map(g => `${g.title} (${g.progress ?? 0}%)`).join('; ') || 'none'}`,
    `Habits: ${habits.slice(-8).map(h => `${h.name}${h.frequency ? `/${h.frequency}` : ''}`).join('; ') || 'none'}`,
    `Notes: ${notes.slice(-5).map(n => `${n.title}${n.content ? `: ${n.content.slice(0, 80)}` : ''}`).join('; ') || 'none'}`,
  ].join('\n');
}

async function aiResponse(userId: string, history: ChatMessage[], message: string, command: { command: string; args: string } | null) {
  if (!isAiConfigured()) return fallbackResponse(message, command);
  const cms = await kvGetJson<CmsState>('cms:state:v2', defaultCmsState);
  const persona = cms.planner.ai.systemPersona || 'You are KIYA, a concise planning assistant. Help the user plan tasks, habits, goals, notes, health and finances. Use the available context. If data is missing, ask one focused question.';
  const context = await plannerContext(userId);
  const messages = [
    { role: 'system' as const, content: `${persona}\n\nPlanner context:\n${context}\n\nRules: be practical, concise, and do not invent stored data.` },
    ...history.slice(-12).map(m => ({ role: m.role, content: m.content } as const)),
    { role: 'user' as const, content: message },
  ];
  const generated = await generateAiChat(messages, { model: cms.planner.ai.paidLayerProvider || undefined });
  return generated || fallbackResponse(message, command);
}

export async function POST(request: NextRequest) {
  try {
    const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401);
    const isFree = p.plan === 'free';
    const rl = await checkRateLimit(`ai-chat:${p.sub}`, { preset: 'aiChat', ...(isFree ? { windowMs: 86400000, maxRequests: 10 } : {}) });
    if (!rl.allowed) return errorResponse(isFree ? 'Free plan limit reached: 10 AI messages per day. Upgrade for more.' : 'Too many requests. Please wait.', 429);
    const { message } = await request.json();
    if (!message || !message.trim()) return errorResponse('Message is required');
    const rows = await readPlannerList<ChatMessage>(p.sub, COLLECTION);
    const userMessage: ChatMessage = { id: makePlannerId('msg'), role: 'user', content: message.trim(), createdAt: new Date().toISOString() };
    const command = detectCommand(message.trim());
    let content = '';
    try { content = await aiResponse(p.sub, rows, message.trim(), command); } catch { content = fallbackResponse(message.trim(), command); }
    const assistantMessage: ChatMessage = { id: makePlannerId('msg'), role: 'assistant', content, createdAt: new Date().toISOString() };
    await writePlannerList(p.sub, COLLECTION, [...rows, userMessage, assistantMessage].slice(-200));
    return successResponse({ userMessage, assistantMessage, provider: isAiConfigured() ? 'configured' : 'fallback' });
  } catch { return errorResponse('Failed to process request', 500); }
}

export async function GET(request: NextRequest) {
  try { const p = await requirePlannerUser(request); if (!p) return errorResponse('License is required or invalid', 401); return successResponse(await readPlannerList<ChatMessage>(p.sub, COLLECTION)); } catch { return errorResponse('Failed to process request', 500); }
}
