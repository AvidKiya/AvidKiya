import { NextResponse } from 'next/server';
export const runtime = 'edge';
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'avidkiya-platform',
    status: 'healthy',
    time: new Date().toISOString(),
    version: '1.0.0-phase1',
    checks: {
      api: 'up',
      cms: 'up',
      db: 'n/a-phase3',
    }
  });
}
