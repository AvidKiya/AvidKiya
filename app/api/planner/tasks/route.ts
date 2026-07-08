import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
let memTasks:any[] = [
  {id:'1', title:'گزارش مالی ماهانه', status:'todo', priority:'high', due:'tomorrow'},
  {id:'2', title:'تماس با سارا — پروژه KIYA', status:'inprogress', priority:'medium'},
  {id:'3', title:'ورزش ۳۰ دقیقه', status:'done', priority:'medium'},
];

export async function GET(){
  return NextResponse.json({ ok:true, data: memTasks, meta:{total: memTasks.length} });
}
export async function POST(req: NextRequest){
  const body = await req.json();
  const t = { id: String(Date.now()), ...body, status:'todo', created_at: new Date().toISOString() };
  memTasks.unshift(t);
  return NextResponse.json({ ok:true, data:t }, {status:201});
}
