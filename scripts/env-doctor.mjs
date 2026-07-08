import 'dotenv/config';

const groups = [
  ['Core', ['NEXT_PUBLIC_SITE_URL', 'JWT_SECRET']],
  ['Cloudflare KV', ['CF_ACCOUNT_ID', 'CF_API_TOKEN', 'CF_KV_NAMESPACE_ID']],
  ['Payment', ['ZARINPAL_MERCHANT_ID']],
  ['Email', ['RESEND_API_KEY', 'EMAIL_FROM']],
  ['AI', ['OPENAI_API_KEY']],
  ['Telegram', ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_WEBHOOK_SECRET']],
  ['OAuth Google', ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']],
  ['OAuth GitHub', ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET']],
  ['Monitoring', ['MONITORING_WEBHOOK_URL']],
];

let missingRequired = 0;
console.log('\nAvidKiya Environment Doctor\n');
for (const [name, keys] of groups) {
  console.log(`\n${name}`);
  for (const key of keys) {
    const ok = !!process.env[key];
    const required = ['NEXT_PUBLIC_SITE_URL','JWT_SECRET'].includes(key);
    if (!ok && required) missingRequired++;
    console.log(`  ${ok ? '✅' : required ? '❌' : '⚪'} ${key}${ok ? '' : ' not set'}`);
  }
}
console.log('\nLegend: ✅ set, ⚪ optional/not configured, ❌ recommended core missing');
if (missingRequired) process.exitCode = 1;
