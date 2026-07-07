import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://avidkiya.com';
  const routes = [
    '', '/projects', '/planner', '/shop', '/services', '/tools',
    '/about', '/resume', '/contact', '/blog', '/comments',
    '/pricing', '/help', '/status', '/changelog',
    '/terms', '/privacy', '/refund',
  ];
  return routes.map(r => ({
    url: base + r,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: r === '' ? 1 : 0.7,
  }));
}
