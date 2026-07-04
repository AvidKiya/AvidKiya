import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    
    const adminToken = process.env.ADMIN_TOKEN || 'admin';
    
    if (token === adminToken) {
      return NextResponse.json({ 
        success: true,
        diagnostics: {
          apiReachable: true,
          tokenSet: !!process.env.ADMIN_TOKEN,
          kvBound: false // KV only available on Cloudflare
        }
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid token' 
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}
