import 'dotenv/config';

const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const endpoints = ['/api/health', '/robots.txt', '/sitemap.xml'];
let failed = 0;
for (const ep of endpoints) {
  try {
    const res = await fetch(base + ep);
    console.log(`${res.ok ? '✅' : '❌'} ${ep} ${res.status}`);
    if (!res.ok) failed++;
  } catch (e) {
    console.log(`❌ ${ep} ${e.message}`);
    failed++;
  }
}
process.exitCode = failed ? 1 : 0;
