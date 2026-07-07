// Microcopy — تمام متن‌های رابط کاربری در یک فایل متمرکز

export const microcopy = {
  // دکمه‌ها
  buttons: {
    startFree: 'شروع رایگان',
    continue: 'ادامه بده',
    saved: 'ذخیره کردم',
    cancel: 'بیخیال',
    upgrade: 'ارتقا بده',
    retry: 'تلاش مجدد',
    submit: 'ارسال',
    save: 'ذخیره',
    delete: 'حذف',
    edit: 'ویرایش',
    add: 'افزودن',
    close: 'بستن',
    back: 'برگشت',
    next: 'بعدی',
    previous: 'قبلی',
    confirm: 'تأیید',
    logout: 'خروج',
    login: 'ورود',
    signup: 'ثبت‌نام',
    download: 'دانلود',
    copy: 'کپی',
    share: 'اشتراک‌گذاری',
    search: 'جستجو',
    filter: 'فیلتر',
    sort: 'مرتب‌سازی',
    refresh: 'به‌روزرسانی',
    export: 'خروجی',
    import: 'ورودی',
  },

  // پیام‌های خطا
  errors: {
    network: 'اتصال برقرار نشد. اینترنتت رو چک کن.',
    duplicate: 'این قبلاً ثبت شده!',
    licenseExpired: 'لایسنس منقضی شده. تمدید کن →',
    licenseInvalid: 'لایسنس نامعتبر است.',
    unauthorized: 'دسترسی ندارید.',
    notFound: 'موردی یافت نشد.',
    serverError: 'مشکلی پیش اومد. لطفاً دوباره تلاش کن.',
    validation: 'لطفاً فیلدها رو بررسی کن.',
    required: 'این فیلد الزامی است.',
    emailInvalid: 'ایمیل معتبر نیست.',
    passwordShort: 'رمز عبور باید حداقل ۸ کاراکتر باشد.',
    passwordMismatch: 'رمز عبور مطابقت ندارد.',
    rateLimit: 'تعداد درخواست‌ها زیاده. کمی صبر کن.',
    fileTooLarge: 'حجم فایل بیش از حد مجاز است.',
    offline: 'آفلاین هستید. تغییرات بعد از اتصال ذخیره می‌شود.',
  },

  // Empty States
  empty: {
    tasks: 'هنوز وظیفه‌ای نداری. اولین وظیفه‌ات رو ثبت کن!',
    goals: 'هنوز هدفی نداری. یه هدف اضافه کن و شروع کن!',
    habits: 'عادت‌هات رو اینجا ثبت کن. یه streak بساز!',
    notes: 'یادداشت‌هات رو اینجا بنویس. دانشت رو بساز!',
    projects: 'پروژه‌ات رو اضافه کن و پیشرفت رو دنبال کن!',
    events: 'رویدادهات رو توی تقویم ثبت کن!',
    transactions: 'تراکنش‌هات رو ثبت کن تا مالیت رو مدیریت کنی!',
    health: 'سلامتت رو روزانه ثبت کن!',
    chat: 'پیام بده تا AI کمکت کنه!',
    products: 'هنوز محصولی نیست. از پنل مدیر اضافه کن.',
    comments: 'هنوز نظری ثبت نشده. اولین نظر رو بذار!',
    messages: 'پیامی نیست.',
    notifications: 'اعلانی نداری.',
    search: 'نتیجه‌ای یافت نشد.',
    coupons: 'کد تخفیفی نیست.',
    orders: 'سفارشی نیست.',
    subscribers: 'عضوی نیست.',
  },

  // Loading
  loading: {
    default: 'داریم حساب می‌کنیم...',
    wait: 'چند لحظه صبر کن...',
    ai: 'AI داره فکر می‌کنه...',
    saving: 'داریم ذخیره می‌کنیم...',
    uploading: 'داریم آپلود می‌کنیم...',
    syncing: 'داریم همگام‌سازی می‌کنیم...',
    connecting: 'داریم وصل می‌شیم...',
  },

  // Tooltips
  tooltips: {
    quickCapture: 'هر فکری داری اینجا بنویس. AI خودکار دسته‌بندی می‌کنه.',
    licenseCode: 'این کد رو کپی کن و توی ورود بزن.',
    editMode: 'از پنل مدیر می‌تونی لوگو عوض کنی.',
    darkMode: 'حالت تاریک/روشن',
    language: 'تغییر زبان',
    notifications: 'اعلان‌های شما',
    profile: 'پروفایل شما',
    settings: 'تنظیمات',
    export: 'خروجی داده‌ها به فرمت JSON/CSV',
    import: 'ورودی داده‌ها از فایل',
  },

  // تأییدیه‌ها
  confirmations: {
    delete: 'آیا مطمئنی می‌خوای حذف کنی؟',
    logout: 'آیا می‌خوای خارج بشی؟',
    clearData: 'تمام داده‌ها حذف می‌شن. آیا مطمئنی؟',
    cancelSubscription: 'اشتراک لغو بشه؟',
  },

  // Plan upsell
  upsell: {
    freeLimit: 'به حد رایگان رسیدی! با Pro ادامه بده →',
    proUpgrade: 'با Pro همه چیز نامحدود می‌شه →',
    aiUpgrade: 'AI نامحدود می‌خوای؟ Pro+AI بگیر →',
    teamUpgrade: 'تیمت هم می‌تونه استفاده کنه! →',
    knowledgeGraph: 'این قابلیت فقط در Pro فعاله → ارتقا بده',
    finance: 'ماژول مالی فقط در Pro+AI فعاله →',
    healthModule: 'ماژول سلامت فقط در Pro+AI فعاله →',
  },

  // پیام‌های موفقیت
  success: {
    saved: 'ذخیره شد!',
    created: 'ایجاد شد!',
    updated: 'به‌روزرسانی شد!',
    deleted: 'حذف شد!',
    sent: 'ارسال شد!',
    copied: 'کپی شد!',
    subscribed: 'عضویت شما ثبت شد!',
    purchased: 'خرید شما تأیید شد!',
    licenseActivated: 'لایسنس فعال شد!',
  },

  // فرم‌ها
  forms: {
    namePlaceholder: 'نام خودت رو بنویس',
    emailPlaceholder: 'email@example.com',
    subjectPlaceholder: 'موضوع پیام',
    messagePlaceholder: 'پیامت رو بنویس...',
    searchPlaceholder: 'جستجو...',
    passwordPlaceholder: 'رمز عبور',
    licensePlaceholder: 'KIYA-XXXX-XXXX-XXXX',
    capturePlaceholder: 'هر فکری داری بنویس… AI طبقه‌بندی می‌کنه',
  },

  // فاصله زمانی
  time: {
    justNow: 'همین الان',
    minutesAgo: (n: number) => `${n} دقیقه پیش`,
    hoursAgo: (n: number) => `${n} ساعت پیش`,
    daysAgo: (n: number) => `${n} روز پیش`,
    weeksAgo: (n: number) => `${n} هفته پیش`,
  },
} as const;

export type MicrocopyKey = typeof microcopy;