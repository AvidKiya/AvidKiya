import { successResponse } from '@/lib/api-types';

export const runtime = 'edge';

export async function GET() {
  return successResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'operational',
      database: 'operational',
      cache: 'operational',
    },
  });
}