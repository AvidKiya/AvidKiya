import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';

export const runtime = 'edge';

type TaxProfile = { country: string; region?: string; label: string; rate: number; inclusive?: boolean };
const profiles: TaxProfile[] = [
  { country: 'IR', label: 'Iran VAT', rate: 0.09 },
  { country: 'DE', label: 'Germany VAT', rate: 0.19 },
  { country: 'EU', label: 'EU fallback VAT', rate: 0.20 },
  { country: 'US', label: 'US sales tax fallback', rate: 0.0 },
  { country: 'GLOBAL', label: 'No tax', rate: 0.0 },
];

function profileFor(country?: string) {
  const c = (country || 'GLOBAL').toUpperCase();
  return profiles.find(p => p.country === c) || profiles.find(p => p.country === 'GLOBAL')!;
}

export async function POST(request: NextRequest) {
  try {
    const { subtotal = 0, country = 'IR', inclusive = false } = await request.json();
    const amount = Number(subtotal || 0);
    const profile = { ...profileFor(country), inclusive };
    const tax = profile.inclusive ? Math.round(amount - amount / (1 + profile.rate)) : Math.round(amount * profile.rate);
    const total = profile.inclusive ? amount : amount + tax;
    return successResponse({ subtotal: amount, tax, total, currency: 'TMN', profile });
  } catch { return errorResponse('Tax calculation failed', 500); }
}

export async function GET() { return successResponse({ profiles }); }
