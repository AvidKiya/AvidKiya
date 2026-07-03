import { effectiveToken, json } from './_auth';
export const onRequestPost = async ({ request, env }: any) => { const token = await effectiveToken(env); const h=(request.headers.get('authorization')||'').replace('Bearer ',''); return json({ ok: !!token && h === token, diagnostics:{ apiReachable:true, tokenSet:!!token, kvBound:!!env.AVIDKIYA_KV } }, (!!token && h===token)?200:401); };
export const onRequestGet = async ({ env }: any) => json({ ok:true, diagnostics:{ apiReachable:true, tokenSet:!!(await effectiveToken(env)), kvBound:!!env.AVIDKIYA_KV } });
