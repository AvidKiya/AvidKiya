import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://avidkiya.com';
  const routes = [
    '', '/projects', '/projects/devhub-os', '/projects/automation-studio',
    '/projects/shop-tools-suite', '/projects/edge-architecture',
    '/projects/kiya-planner-standalone', '/projects/kianet-standalone',
    '/shop', '/services', '/tools', '/about', '/resume', '/contact', '/blog', '/comments',
    '/pricing', '/help', '/status', '/changelog', '/terms', '/privacy', '/refund',
  ];
  return routes.map(r => ({
    url: base + r,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: r === '' ? 1 : r.startsWith('/projects/') ? 0.64 : 0.72,
  }));
}
