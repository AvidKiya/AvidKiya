// API Response Types — platform-agnostic (works with Node.js / PostgreSQL)

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

import { securityHeaders } from './security';
