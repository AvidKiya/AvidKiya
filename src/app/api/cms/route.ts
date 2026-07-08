import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-types';
import { defaultCmsState } from '@/lib/cms/default-state';
import { kvGetJson, kvPutJson } from '@/lib/server/kv-storage';
import type { CmsState } from '@/lib/cms/types';

export const runtime = 'edge';

const CMS_KEY = 'cms:state:v2';

async function readCms(): Promise<CmsState> {
  return kvGetJson<CmsState>(CMS_KEY, defaultCmsState);
}

async function writeCms(next: CmsState): Promise<CmsState> {
  const normalized = { ...next, version: defaultCmsState.version };
  await kvPutJson(CMS_KEY, normalized);
  return normalized;
}

export async function GET() {
  try {
    return successResponse(await readCms());
  } catch (error) {
    return errorResponse('Failed to process request', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Partial<CmsState>;
    const current = await readCms();
    const next = await writeCms({ ...current, ...body, version: defaultCmsState.version } as CmsState);
    return successResponse(next, 'CMS updated');
  } catch (error) {
    return errorResponse('Failed to process request', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;
    if (!section) return errorResponse('Section is required');
    const current = await readCms();
    const next = { ...current, [section]: data, version: defaultCmsState.version } as CmsState;
    await writeCms(next);
    return successResponse(next, `${section} updated`);
  } catch (error) {
    return errorResponse('Failed to process request', 500);
  }
}
