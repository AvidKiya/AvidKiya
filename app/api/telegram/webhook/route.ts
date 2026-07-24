import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramUpdate } from '@/lib/telegram/bot';

export const runtime = 'edge';

export async function POST(req: NextRequest){
  try {
    const update = await req.json();
    // @ts-ignore
    const env = process.env as any;
    const res = await handleTelegramUpdate(update, { BOT_TOKEN: env.TELEGRAM_BOT_TOKEN });
    return NextResponse.json(res);
  } catch(e:any){
    return NextResponse.json({ ok:false, error: e.message }, {status:500});
  }
}

export async function GET(){
  return NextResponse.json({ 
    ok: true, 
    bot: '@AvidKiyaBot',
    description: 'Telegram Assistant — AvidKiya Portfolio',
    webhook: '/api/telegram/webhook',
    commands: ['/start','/status','/services','/projects','/idea','/search','/help'],
    website: 'https://avidkiya.com'
  });
}
