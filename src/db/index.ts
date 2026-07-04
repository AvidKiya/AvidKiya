import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getKV(key: string): Promise<string | null> {
  const { env } = getRequestContext();
  return env.AVIDKIYA_KV.get(key);
}

export async function setKV(key: string, value: string): Promise<void> {
  const { env } = getRequestContext();
  await env.AVIDKIYA_KV.put(key, value);
}
