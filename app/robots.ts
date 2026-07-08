import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/kiya/', '/api/', '/planner/admin'] },
    sitemap: 'https://avidkiya.com/sitemap.xml',
  };
}
