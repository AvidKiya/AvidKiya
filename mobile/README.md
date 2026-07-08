# AvidKiya Mobile Shell

این پوشه اسکلت Native wrapper با Capacitor است.

## استفاده

```bash
cd mobile
npm install
MOBILE_SERVER_URL=https://your-domain.com npm run sync
npm run android
npm run ios
```

## نکته

این wrapper وب‌اپ production را داخل native shell باز می‌کند. برای انتشار واقعی باید:

- bundle id/app id را تغییر دهید
- icon/splash screen بسازید
- Android/iOS project را با Capacitor generate کنید
- sign/release در Play Store و App Store انجام دهید

PWA و Telegram Mini App در پروژه اصلی آماده‌اند؛ این بخش برای Native shell است.
