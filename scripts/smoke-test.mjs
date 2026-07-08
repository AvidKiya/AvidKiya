import { existsSync } from 'node:fs';
const required = [
  'src/app/api/cms/route.ts','src/app/api/shop/checkout/route.ts','src/app/api/shop/download/route.ts','src/app/api/planner/ai/chat/route.ts','src/app/api/telegram/webhook/route.ts','src/app/api/auth/oauth/[provider]/route.ts','src/app/api/planner/import/route.ts','src/app/api/planner/sync/route.ts','src/app/api/planner/knowledge/search/route.ts','src/app/api/deployer/route.ts','src/app/telegram/mini/page.tsx','src/app/marketplace/page.tsx','extension/manifest.json','cli/kiya.mjs','playwright.config.ts'
];
const missing = required.filter(f=>!existsSync(f));
if(missing.length){ console.error('Missing required files:', missing); process.exit(1); }
console.log('Smoke test passed:', required.length, 'files checked.');
