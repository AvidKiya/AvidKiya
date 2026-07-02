export type Language = 'en' | 'fa';

export const translations = {
  en: {
    // Loading Screen
    loading: 'LOADING RESOURCES',
    finished: 'FINISHED LOADING RESOURCES',
    launching: "All Content Loaded, launching",
    pressStart: 'Click start to begin',
    start: 'START',
    checkingRAM: 'Checking RAM',
    wait: 'WAIT',
    noWebGL: 'No WebGL Detected',
    webGLRequired: 'WebGL is required to run this site.',
    mobileWarning: 'This experience is best viewed on a desktop or laptop computer.',

    // Navigation
    about: 'About',
    projects: 'Projects',
    experience: 'Experience',
    education: 'Education',
    contact: 'Contact',
    skills: 'Skills',
    back: 'Back',

    // Sections
    aboutTitle: 'About Me',
    projectsTitle: 'Projects',
    experienceTitle: 'Experience',
    educationTitle: 'Education',
    contactTitle: 'Contact',
    skillsTitle: 'Skills',

    // Contact
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    locationLabel: 'Location',
    sendEmail: 'Send Email',

    // Projects
    viewProject: 'View Project',
    viewCode: 'View Code',
    technologies: 'Technologies',

    // Admin
    adminPanel: 'Admin Panel',
    adminLogin: 'Admin Login',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    add: 'Add',
    delete: 'Delete',
    personalInfo: 'Personal Information',
    biosSettings: 'BIOS Settings',
    skillsSection: 'Skills',
    projectsSection: 'Projects',
    experienceSection: 'Experience',
    educationSection: 'Education',
    contactInfo: 'Contact Information',
    savedSuccess: 'Saved successfully!',
    wrongPassword: 'Wrong password!',
    confirmDelete: 'Are you sure you want to delete this item?',

    // Language
    language: 'Language',
    switchToFa: 'فارسی',
    switchToEn: 'English',

    // UI
    muteSound: 'Mute',
    unmuteSound: 'Unmute',
    freeCam: 'Free Cam',
    level: 'Level',
    present: 'Present',
  },
  fa: {
    // Loading Screen
    loading: 'در حال بارگذاری منابع',
    finished: 'بارگذاری کامل شد',
    launching: 'همه محتوا بارگذاری شد، در حال راه‌اندازی',
    pressStart: 'برای شروع کلیک کنید',
    start: 'شروع',
    checkingRAM: 'بررسی رم',
    wait: 'صبر کنید',
    noWebGL: 'WebGL شناسایی نشد',
    webGLRequired: 'WebGL برای اجرای این سایت لازم است.',
    mobileWarning: 'این تجربه به بهترین شکل روی کامپیوتر یا لپ‌تاپ قابل مشاهده است.',

    // Navigation
    about: 'درباره من',
    projects: 'پروژه‌ها',
    experience: 'تجربه',
    education: 'تحصیلات',
    contact: 'تماس',
    skills: 'مهارت‌ها',
    back: 'بازگشت',

    // Sections
    aboutTitle: 'درباره من',
    projectsTitle: 'پروژه‌ها',
    experienceTitle: 'سابقه کاری',
    educationTitle: 'تحصیلات',
    contactTitle: 'تماس با من',
    skillsTitle: 'مهارت‌ها',

    // Contact
    emailLabel: 'ایمیل',
    phoneLabel: 'تلفن',
    locationLabel: 'موقعیت',
    sendEmail: 'ارسال ایمیل',

    // Projects
    viewProject: 'مشاهده پروژه',
    viewCode: 'مشاهده کد',
    technologies: 'تکنولوژی‌ها',

    // Admin
    adminPanel: 'پنل مدیریت',
    adminLogin: 'ورود به پنل مدیریت',
    password: 'رمز عبور',
    login: 'ورود',
    logout: 'خروج',
    save: 'ذخیره',
    cancel: 'انصراف',
    edit: 'ویرایش',
    add: 'افزودن',
    delete: 'حذف',
    personalInfo: 'اطلاعات شخصی',
    biosSettings: 'تنظیمات BIOS',
    skillsSection: 'مهارت‌ها',
    projectsSection: 'پروژه‌ها',
    experienceSection: 'سابقه کاری',
    educationSection: 'تحصیلات',
    contactInfo: 'اطلاعات تماس',
    savedSuccess: 'با موفقیت ذخیره شد!',
    wrongPassword: 'رمز عبور اشتباه است!',
    confirmDelete: 'آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟',

    // Language
    language: 'زبان',
    switchToFa: 'فارسی',
    switchToEn: 'English',

    // UI
    muteSound: 'قطع صدا',
    unmuteSound: 'وصل صدا',
    freeCam: 'دوربین آزاد',
    level: 'سطح',
    present: 'اکنون',
  },
};

export function t(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang][key] || translations['en'][key] || key;
}
