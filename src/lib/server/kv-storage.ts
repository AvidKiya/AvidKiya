type JsonValue = unknown;

type FallbackStore = Map<string, string>;

declare global {
  var __AK_FALLBACK_KV__: FallbackStore | undefined;
}

function fallback(): FallbackStore {
  globalThis.__AK_FALLBACK_KV__ ||= new Map<string, string>();
  return globalThis.__AK_FALLBACK_KV__;
}

function cfConfig() {
  const accountId = process.env.CF_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.CF_KV_NAMESPACE_ID || process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const token = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !namespaceId || !token) return null;
  return { accountId, namespaceId, token };
}

function kvUrl(key?: string) {
  const cfg = cfConfig();
  if (!cfg) return null;
  const base = `https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/storage/kv/namespaces/${cfg.namespaceId}`;
  return {
    token: cfg.token,
    value: key ? `${base}/values/${encodeURIComponent(key)}` : `${base}/keys`,
  };
}

export function isCloudflareKvConfigured() {
  return !!cfConfig();
}

export async function kvGetText(key: string): Promise<string | null> {
  const remote = kvUrl(key);
  if (!remote) return fallback().get(key) ?? null;
  const res = await fetch(remote.value, { headers: { Authorization: `Bearer ${remote.token}` } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`KV get failed: ${res.status}`);
  return res.text();
}

export async function kvPutText(key: string, value: string): Promise<void> {
  const remote = kvUrl(key);
  if (!remote) { fallback().set(key, value); return; }
  const res = await fetch(remote.value, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${remote.token}`, 'Content-Type': 'text/plain;charset=utf-8' },
    body: value,
  });
  if (!res.ok) throw new Error(`KV put failed: ${res.status}`);
}

export async function kvDelete(key: string): Promise<void> {
  const remote = kvUrl(key);
  if (!remote) { fallback().delete(key); return; }
  const res = await fetch(remote.value, { method: 'DELETE', headers: { Authorization: `Bearer ${remote.token}` } });
  if (!res.ok && res.status !== 404) throw new Error(`KV delete failed: ${res.status}`);
}

export async function kvGetJson<T>(key: string, fallbackValue: T): Promise<T> {
  const text = await kvGetText(key);
  if (!text) return fallbackValue;
  try { return JSON.parse(text) as T; } catch { return fallbackValue; }
}

export async function kvPutJson(key: string, value: JsonValue): Promise<void> {
  await kvPutText(key, JSON.stringify(value));
}

export async function kvListKeys(prefix: string): Promise<string[]> {
  const remote = kvUrl();
  if (!remote) return Array.from(fallback().keys()).filter(k => k.startsWith(prefix));
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const url = new URL(remote.value);
    url.searchParams.set('prefix', prefix);
    url.searchParams.set('limit', '1000');
    if (cursor) url.searchParams.set('cursor', cursor);
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${remote.token}` } });
    if (!res.ok) throw new Error(`KV list failed: ${res.status}`);
    const json = await res.json() as { success?: boolean; result?: Array<{ name: string }>; result_info?: { cursor?: string } };
    keys.push(...(json.result || []).map(k => k.name));
    cursor = json.result_info?.cursor || undefined;
  } while (cursor);
  return keys;
}

export async function kvListJson<T>(prefix: string): Promise<T[]> {
  const keys = await kvListKeys(prefix);
  const rows = await Promise.all(keys.map(k => kvGetJson<T | null>(k, null)));
  return rows.filter(Boolean) as T[];
}
