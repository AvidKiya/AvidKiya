/**
 * Central site configuration.
 * The admin panel will eventually overwrite these values in KV;
 * for now they are the single source of truth.
 */
export const siteConfig = {
  identity: {
    handle: "avidkiya",
    fullNameEn: "Avid Kiya",
    fullNameFa: "اوید کیا",
    titleEn: "Systems Architect & Backend Lead",
    titleFa: "معمار سیستم و توسعه‌دهنده ارشد بک‌اند",
    locationEn: "Iran / Remote",
    locationFa: "ایران / دورکار",
    email: "avidkiya@gmail.com",
    yearsExperience: 8,
  },
  socials: {
    github: "https://github.com/avidkiya",
    telegram: "https://t.me/avidkiya",
    x: "https://x.com/avidkiya",
    instagram: "https://instagram.com/avidkiya",
    linkedin: "https://linkedin.com/in/avidkiya",
    email: "mailto:avidkiya@gmail.com",
  },
  stats: {
    requestsPerSec: "10k+",
    uptime: "99.9%",
    nodes: "08+",
    yearsExperience: "05+",
  },
  brandColorHex: "#21f1a8",
  githubUsername: "avidkiya",
} as const;

export type SiteConfig = typeof siteConfig;
