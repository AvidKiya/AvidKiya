import { NextRequest, NextResponse } from 'next/server';
import type { Comment } from '@/lib/cms/schema';

// In-memory storage for local development
const comments: Comment[] = [];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  const adminToken = process.env.ADMIN_TOKEN || 'admin';
  const isAdmin = token === adminToken;
  
  // Public gets only approved comments, admin gets all
  const filtered = isAdmin ? comments : comments.filter(c => c.approved);
  
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const comment: Comment = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      position: body.position || '',
      rating: body.rating || 5,
      text: body.text,
      approved: false, // Requires admin approval
      pinned: false,
      createdAt: new Date().toISOString()
    };
    
    comments.push(comment);
    
    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const adminToken = process.env.ADMIN_TOKEN || 'admin';
    if (token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const index = comments.findIndex(c => c.id === body.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    comments[index] = { ...comments[index], ...body };
    
    return NextResponse.json({ success: true, data: comments[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const adminToken = process.env.ADMIN_TOKEN || 'admin';
    if (token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    comments.splice(index, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
