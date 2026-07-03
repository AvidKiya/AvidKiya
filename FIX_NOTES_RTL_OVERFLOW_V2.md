# V2 hard fix for RTL layout issue

این بار مشکل به شکل ریشه‌ای حل شد:

- `html` همیشه `dir="ltr"` شده تا Chrome در صفحات RTL صفحه را از سمت راست horizontal scroll باز نکند.
- RTL فقط روی `#app-root dir="rtl"` اعمال می‌شود؛ بنابراین UI فارسی هنوز RTL است ولی viewport دیگر نمی‌شکند.
- AppContext دیگر `document.documentElement.dir` را RTL نمی‌کند.
- فونت انگلیسی به جای `html[dir=ltr]` با `body.lang-en` فعال می‌شود.
- guard قوی برای `overflow-x` اضافه شد.
- `public/_headers` اضافه شد تا Cloudflare نسخه خراب cache‌شده را نگه ندارد.

بعد از push حتماً در Cloudflare Pages یک Deployment جدید بساز. اگر باز هم قدیمی بود:

1. Cloudflare Pages → Deployments → Redeploy آخرین commit
2. Browser hard refresh: Ctrl + Shift + R
3. اگر custom cache داری، Purge cache
