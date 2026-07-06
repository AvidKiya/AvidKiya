import { NextRequest } from 'next/server';
export const runtime = 'edge';

export async function POST(req: NextRequest){
  const { message } = await req.json().catch(()=>({message:''}));
  const reply = `🧠 KIYA AI:\n\nدریافت شد: "${String(message).slice(0,120)}"\n\nپاسخ هوشمند:\n- این یک وظیفه متوسط اولویت به نظر می‌رسد\n- پیشنهاد: فردا ساعت ۱۰ صبح\n- مرتبط با هدف: «رشد KIYA»\n\nمی‌خواهی ثبتش کنم؟`;
  // simulate streaming
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller){
      const words = reply.split(' ');
      for(const w of words){
        controller.enqueue(encoder.encode(w+' '));
        await new Promise(r=>setTimeout(r, 35));
      }
      controller.close();
    }
  });
  return new Response(stream, {
    headers: { 'Content-Type':'text/plain; charset=utf-8', 'Cache-Control':'no-cache', 'X-Accel-Buffering':'no' }
  });
}
