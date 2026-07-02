export interface PortfolioData {
  personal: {
    name: string;
    nameFa: string;
    title: string;
    titleFa: string;
    bio: string;
    bioFa: string;
    email: string;
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
  bios: {
    company: string;
    companyFa: string;
    releaseDate: string;
    biosVersion: string;
    copyright: string;
  };
  skills: Array<{
    name: string;
    nameFa: string;
    level: number;
  }>;
  projects: Array<{
    id: string;
    title: string;
    titleFa: string;
    description: string;
    descriptionFa: string;
    tech: string[];
    link: string;
    github: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    companyFa: string;
    role: string;
    roleFa: string;
    period: string;
    periodFa: string;
    description: string;
    descriptionFa: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    schoolFa: string;
    degree: string;
    degreeFa: string;
    period: string;
    periodFa: string;
  }>;
  contact: {
    email: string;
    phone: string;
    location: string;
    locationFa: string;
  };
}

export const defaultData: PortfolioData = {
  personal: {
    name: "Your Name",
    nameFa: "نام شما",
    title: "Software Engineer",
    titleFa: "مهندس نرم‌افزار",
    bio: "A passionate developer who loves building things.",
    bioFa: "یک توسعه‌دهنده پرشور که عاشق ساختن چیزهای جدید است.",
    email: "your@email.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    website: "https://yourwebsite.com",
  },
  bios: {
    company: "Your Name Inc.",
    companyFa: "شرکت نام شما",
    releaseDate: "01/01/2000",
    biosVersion: "V1.0",
    copyright: "(C)2000-2025",
  },
  skills: [
    { name: "JavaScript", nameFa: "جاوا اسکریپت", level: 90 },
    { name: "TypeScript", nameFa: "تایپ اسکریپت", level: 85 },
    { name: "React", nameFa: "ری‌اکت", level: 90 },
    { name: "Node.js", nameFa: "نود.جی‌اس", level: 80 },
    { name: "Python", nameFa: "پایتون", level: 75 },
    { name: "CSS/SCSS", nameFa: "سی‌اس‌اس", level: 85 },
  ],
  projects: [
    {
      id: "1",
      title: "Project One",
      titleFa: "پروژه اول",
      description: "A great project built with modern technologies.",
      descriptionFa: "یک پروژه عالی با تکنولوژی‌های مدرن.",
      tech: ["React", "Node.js", "MongoDB"],
      link: "https://project1.com",
      github: "https://github.com/yourusername/project1",
    },
    {
      id: "2",
      title: "Project Two",
      titleFa: "پروژه دوم",
      description: "Another amazing project.",
      descriptionFa: "یک پروژه شگفت‌انگیز دیگر.",
      tech: ["TypeScript", "Next.js", "PostgreSQL"],
      link: "https://project2.com",
      github: "https://github.com/yourusername/project2",
    },
  ],
  experience: [
    {
      id: "1",
      company: "Company Name",
      companyFa: "نام شرکت",
      role: "Senior Software Engineer",
      roleFa: "مهندس ارشد نرم‌افزار",
      period: "2022 - Present",
      periodFa: "۱۴۰۱ - اکنون",
      description: "Worked on large-scale web applications.",
      descriptionFa: "روی اپلیکیشن‌های وب در مقیاس بزرگ کار کردم.",
    },
  ],
  education: [
    {
      id: "1",
      school: "University Name",
      schoolFa: "نام دانشگاه",
      degree: "Bachelor of Computer Science",
      degreeFa: "کارشناسی علوم کامپیوتر",
      period: "2016 - 2020",
      periodFa: "۱۳۹۵ - ۱۳۹۹",
    },
  ],
  contact: {
    email: "your@email.com",
    phone: "+98 912 000 0000",
    location: "Tehran, Iran",
    locationFa: "تهران، ایران",
  },
};
