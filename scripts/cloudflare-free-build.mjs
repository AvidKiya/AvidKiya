import { rmSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

console.log('Building with @cloudflare/next-on-pages...');
execFileSync('npx', ['@cloudflare/next-on-pages@1'], { stdio: 'inherit', env: process.env });

const workerDir = '.vercel/output/static/_worker.js';
if (existsSync(workerDir)) {
  console.log('Cloudflare Free plan mode: removing _worker.js to avoid the 3 MiB Worker limit.');
  rmSync(workerDir, { recursive: true, force: true });
}

writeFileSync('.vercel/output/static/_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n`, 'utf8');
console.log('Free-plan static build ready at .vercel/output/static');
console.log('Note: API/SSR functions are disabled in this free-plan build. Use npm run pages:build:full on a paid Workers plan.');
