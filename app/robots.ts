import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers to index everything except widget pages
        userAgent: '*',
        allow: '/',
        disallow: ['/widget/', '/api/'],
      },
    ],
    sitemap: 'https://www.apexweb3.com/sitemap.xml',
  };
}
