import { NextRequest, NextResponse } from 'next/server';
import type { Message } from '@/lib/cms/schema';

export const runtime = 'edge';

// In-memory storage for development
const messages: Message[] = [];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  const adminToken = process.env.ADMIN_TOKEN || 'admin';
  if (token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ success: true, data: messages });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const message: Message = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      read: false,
      replied: false,
      createdAt: new Date().toISOString()
    };
    
    messages.push(message);
    
    return NextResponse.json({ success: true, data: message });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
