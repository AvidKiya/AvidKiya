import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { defaultCmsState } from '@/lib/cms/default-state';

export async function GET() {
  try {
    const products = defaultCmsState.shop.products.filter((p) => p.enabled);
    return successResponse(products);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}