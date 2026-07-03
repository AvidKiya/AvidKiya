/**
 * Client library for talking to the Cloudflare Pages Functions
 * that back the CMS.
 *
 * When running `npm run dev` locally these calls fail gracefully and the
 * app falls back to localStorage. In production (Cloudflare Pages) the
 * Functions in /functions/api/ handle everything.
 */

import type { CmsState } from "./schema";

const API_BASE = "/api";

function tokenHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchRemoteState(): Promise<CmsState | null> {
  try {
    const res = await fetch(`${API_BASE}/cms`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.state ?? null) as CmsState | null;
  } catch {
    return null;
  }
}

export async function pushRemoteState(
  state: CmsState,
  token: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/cms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...tokenHeaders(token),
      },
      body: JSON.stringify(state),
    });
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, error: `${res.status}: ${t}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error ?? `HTTP ${res.status}` };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function fetchRemoteMessages(token: string) {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: tokenHeaders(token),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.messages as any[];
  } catch {
    return null;
  }
}

export async function deleteRemoteMessage(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/messages?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: tokenHeaders(token),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateRemoteMessage(
  id: string,
  patch: { read?: boolean; reply?: string },
  token: string
) {
  try {
    const res = await fetch(`${API_BASE}/messages?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...tokenHeaders(token) },
      body: JSON.stringify(patch),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ─── Comments API ─── */

export async function submitComment(payload: {
  name: string;
  message: string;
  email?: string;
  website?: string;
  role?: string;
  rating?: number;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function fetchComments(token?: string) {
  try {
    const res = await fetch(`${API_BASE}/comments`, {
      headers: token ? tokenHeaders(token) : {},
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.comments as any[];
  } catch {
    return null;
  }
}

export async function updateComment(
  id: string,
  patch: { approved?: boolean; pinned?: boolean; reply?: string },
  token: string
) {
  try {
    const res = await fetch(`${API_BASE}/comments?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...tokenHeaders(token) },
      body: JSON.stringify(patch),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteComment(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE}/comments?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: tokenHeaders(token),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ─── Change password ─── */

export async function changePassword(
  current: string,
  next: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${current}`,
      },
      body: JSON.stringify({ current, next }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error ?? `HTTP ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export function isApiAvailable(): Promise<boolean> {
  return fetch(`${API_BASE}/cms`, { method: "OPTIONS" })
    .then(() => true)
    .catch(() => false);
}

export interface VerifyResult {
  ok: boolean;
  reason?: string;
  kvBound?: boolean;
  tokenConfigured?: boolean;
  /** true if the /api/verify endpoint itself is reachable */
  apiReachable: boolean;
}

/** Ping /api/verify with a candidate token. */
export async function verifyToken(token: string): Promise<VerifyResult> {
  try {
    const res = await fetch(`${API_BASE}/verify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    return {
      ok: !!data.ok,
      reason: data.reason,
      kvBound: data.kvBound,
      tokenConfigured: data.tokenConfigured,
      apiReachable: true,
    };
  } catch {
    return { ok: false, apiReachable: false, reason: "API unreachable" };
  }
}

/** Ping the API without any auth — used to detect if we're deployed. */
export async function pingApi(): Promise<{
  apiReachable: boolean;
  kvBound?: boolean;
  tokenConfigured?: boolean;
}> {
  try {
    const res = await fetch(`${API_BASE}/verify`);
    if (!res.ok) return { apiReachable: false };
    const data = await res.json();
    return {
      apiReachable: true,
      kvBound: !!data.kvBound,
      tokenConfigured: !!data.tokenConfigured,
    };
  } catch {
    return { apiReachable: false };
  }
}
