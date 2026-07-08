type ChatMsg = { role: 'system' | 'user' | 'assistant'; content: string };

export function isAiConfigured() {
  return !!(process.env.OPENAI_API_KEY || process.env.AI_API_KEY || process.env.WORKERS_AI_API_TOKEN);
}

export async function generateAiChat(messages: ChatMsg[], options?: { model?: string; temperature?: number }) {
  const openAiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (openAiKey) {
    const base = (process.env.OPENAI_BASE_URL || process.env.AI_API_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = options?.model || process.env.OPENAI_MODEL || process.env.AI_MODEL || 'gpt-4o-mini';
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${openAiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: options?.temperature ?? 0.3 }),
    });
    const data = await res.json().catch(() => null) as any;
    if (!res.ok) throw new Error(data?.error?.message || data?.message || `AI provider failed: ${res.status}`);
    return String(data?.choices?.[0]?.message?.content || '').trim();
  }

  const cfAccount = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfToken = process.env.WORKERS_AI_API_TOKEN || process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (cfAccount && cfToken && process.env.WORKERS_AI_MODEL) {
    const model = process.env.WORKERS_AI_MODEL;
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAccount}/ai/run/${model}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json().catch(() => null) as any;
    if (!res.ok || !data?.success) throw new Error(data?.errors?.[0]?.message || `Workers AI failed: ${res.status}`);
    return String(data?.result?.response || data?.result?.content || '').trim();
  }

  return '';
}
