// Cloudflare Bindings types

export interface Bindings {
  DB: D1Database;
  KV: KVNamespace;
  ADMIN_TOKEN: string;
  JWT_SECRET: string;
  TELEGRAM_BOT_TOKEN?: string;
  RESEND_API_KEY?: string;
}

export interface ApiContext {
  request: Request;
  env: Bindings;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...securityHeaders,
    },
  });
}

export function errorResponse(error: string, status = 400): Response {
  return jsonResponse({ success: false, error }, status);
}

export function successResponse<T>(data: T, message?: string): Response {
  return jsonResponse({ success: true, data, message });
}

// Import security headers
import { securityHeaders } from './security';