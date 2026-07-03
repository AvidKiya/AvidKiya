# Fix applied: RTL horizontal overflow / broken right-aligned layout

مشکلی که در اسکرین‌شات دیده می‌شد از overflow افقی در حالت RTL بود. Chrome وقتی صفحه RTL overflow افقی داشته باشد، viewport را روی سمت راستِ اسکرول افقی باز می‌کند و کل layout به‌هم‌ریخته و چسبیده به راست دیده می‌شود.

اصلاحات انجام‌شده:

- جلوگیری سراسری از horizontal overflow در `app/globals.css`
- امن‌سازی `.page-wrap` با `margin-inline:auto` و `max-width`
- اضافه شدن کلاس `.ascii-safe` برای ASCII art که جهت LTR جداگانه داشته باشد و عرض صفحه را نشکند
- اصلاح Hero grid با `minmax(0,...)` و `min-w-0`
- اصلاح TopNav height و محدود کردن عرض tab bar
- مخفی‌سازی کامل Drawer وقتی بسته است

بعد از push، در Cloudflare Pages یک redeploy بزن و اگر هنوز نسخه قبلی را دیدی، cache مرورگر را hard refresh کن:

Windows/Linux: `Ctrl + Shift + R`

