import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.apexweb3.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    // WordPress internal paths (prevent indexing of CMS origin)
                    '/wp-admin/',
                    '/wp-content/',
                    '/wp-includes/',
                    '/wp-json/',
                    // WordPress taxonomy duplicates at root level
                    '/tag/',
                    '/author/',
                    // Search and feed URLs
                    '/?s=',
                    '/feed/',
                    '/trackback/',
                    // Query parameter patterns that cause duplicates
                    '/*?utm_*',
                    '/*?ref=*',
                    '/*?fbclid=*',
                    '/*?gclid=*',
                    '/*?_ga=*',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
