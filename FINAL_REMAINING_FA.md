# وضعیت باقی‌مانده پروژه بعد از مرحله ۲۰

تاریخ: 2026-07-07

## پیاده‌سازی‌شده‌ها

اکنون حتی نسخه پایه/اسکلت موارد enterprise هم اضافه شده است:

- Native shell با Capacitor در `mobile/`
- Marketplace vendors/payouts API
- Tenant/White-label پایه
- Tax calculation API
- Vector-like RAG/search با hash embedding و cosine
- Web Push subscription/queue/gateway integration
- Deployer API با run logs
- Playwright E2E scaffold

## چیزهایی که فقط سرویس بیرونی/تنظیم production می‌خواهند

- Cloudflare KV واقعی
- پرداخت واقعی ZarinPal یا provider خارجی
- Resend واقعی
- AI provider واقعی
- Telegram Bot token و webhook setup
- OAuth apps
- Push gateway یا VAPID provider
- GitHub deploy token

## چیزهایی که هنوز «نسخه نهایی enterprise» نیستند

این‌ها دیگر فراتر از MVP/اسکلت هستند:

1. Native app واقعی با build، signing، store submission
2. Marketplace چندفروشنده کامل با KYC، dispute، settlement بانکی
3. Vector DB واقعی مانند Qdrant/Pinecone/pgvector به‌جای hash vectors داخلی
4. Web Push VAPID encryption داخلی کامل بدون gateway
5. Multi-tenant enterprise با isolation کامل billing/storage/domain provisioning
6. Tax/legal invoice رسمی متصل به سامانه‌های مالیاتی واقعی
7. Deployer کامل با live log streaming، rollback artifact، approval gates
8. E2E suite کامل برای همه سناریوها

## جمع‌بندی

پروژه اکنون در سطح MVP/Production single-tenant بسیار کامل است و برای بسیاری از قابلیت‌های enterprise نیز اسکلت اجرایی دارد. مرحله بعد عملیاتی بیشتر تنظیم سرویس‌های بیرونی، تست production، و سپس عمیق‌سازی enterprise است.
