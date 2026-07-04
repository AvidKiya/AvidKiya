import { NextRequest, NextResponse } from 'next/server';
import { defaultCmsState } from '@/lib/cms/schema';

// In-memory storage for local development
let cmsData = { ...defaultCmsState };

export async function GET() {
  return NextResponse.json({ success: true, data: cmsData });
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Check admin token
    const adminToken = process.env.ADMIN_TOKEN || 'admin';
    if (token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    cmsData = { ...cmsData, ...body };
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
