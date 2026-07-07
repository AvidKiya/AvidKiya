import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { defaultCmsState } from '@/lib/cms/default-state';

export const runtime = 'edge';

// In-memory store for demo (in production, use KV)
let cmsState = { ...defaultCmsState };

export async function GET() {
  try {
    return successResponse(cmsState);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Merge with existing state
    cmsState = {
      ...cmsState,
      ...body,
      version: (cmsState.version || 0) + 1,
    };

    return successResponse(cmsState, 'CMS به‌روزرسانی شد');
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section) {
      return errorResponse('بخش الزامی است');
    }

    // Update specific section
    (cmsState as Record<string, unknown>)[section] = data;
    cmsState.version = (cmsState.version || 0) + 1;

    return successResponse(cmsState, `${section} به‌روزرسانی شد`);
  } catch (error) {
    return errorResponse('خطا در پردازش درخواست', 500);
  }
}