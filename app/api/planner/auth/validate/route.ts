import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';

function isValidLicense(code: string){
  if(!code) return false;
  const c = code.toUpperCase();
  if(c === 'ADMIN' || c === 'DEMO') return true;
  return /^KIYA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c);
}

export async function POST(req: NextRequest){
  try {
    const { license } = await req.json();
    const valid = isValidLicense(license);
    if(!valid) return NextResponse.json({ ok:false, error:{code:'INVALID_LICENSE', message:'کد لایسنس معتبر نیست'} }, {status:401});
    // mock JWT
    const payload = {
      sub: 'user_'+license.slice(-4),
      plan: license.includes('PRO') ? 'pro' : 'free',
      exp: Math.floor(Date.now()/1000) + 60*60*24*14,
      iat: Math.floor(Date.now()/1000),
      is_admin: license.toLowerCase()==='admin',
    };
    // NOT real JWT — demo only
    const token = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return NextResponse.json({ ok:true, data:{ token, license, plan: payload.plan, expires_at: new Date(payload.exp*1000).toISOString() }});
  } catch(e:any){
    return NextResponse.json({ ok:false, error:{code:'VALIDATE_FAIL', message:e.message} }, {status:500});
  }
}
