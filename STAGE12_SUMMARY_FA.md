# خلاصه مرحله ۱۲ — Import و Knowledge Graph

تاریخ: 2026-07-07

## انجام شد

### Import API

فایل جدید:

```text
src/app/api/planner/import/route.ts
```

قابلیت‌ها:

- Import از CSV
- Import از Markdown / Obsidian
- Import از JSON
- پشتیبانی از typeهای `task`, `note`, `goal`
- ذخیره مستقیم در storage adapter مجموعه‌های:
  - tasks
  - notes
  - goals

### صفحه Import

فایل جدید:

```text
src/app/planner/app/import/page.tsx
```

قابلیت‌ها:

- انتخاب source: Notion / Obsidian / Todoist / Generic
- انتخاب format: CSV / Markdown / JSON
- انتخاب default type
- paste محتوا و import مستقیم

### لینک Import در ناوبری Planner

فایل اصلاح‌شده:

```text
src/app/planner/app/layout.tsx
```

### Knowledge Graph API

فایل جدید:

```text
src/app/api/planner/knowledge/graph/route.ts
```

قابلیت‌ها:

- ساخت node/edge از notes، tags، tasks و goals
- خروجی مناسب visualization

### Knowledge Graph UI

فایل اصلاح‌شده:

```text
src/app/planner/app/knowledge/page.tsx
```

قابلیت‌ها:

- تب Notes / Graph
- نمایش گراف SVG داخلی بدون dependency اضافه
- رفع ناسازگاری tags string/array
- حذف داده demo قدیمی و اتکا به API واقعی

## تست

```bash
npm run typecheck
npm run build
npm run lint
```

نتیجه: موفق، بدون error.
