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
    description: 'Telegram Secretary — KIYA',
    webhook: '/api/telegram/webhook',
    commands: ['/start','/link','/tasks','/status','/report','/energy','/mood','/idea','/search','/help'],
    mini_app: 'https://avidkiya.pages.dev/planner/app'
  });
}
