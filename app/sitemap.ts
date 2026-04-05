import { MetadataRoute } from 'next'
import { getLatestPosts, getCategories } from '@/lib/api/wordpress'
import { SEO_CRYPTOS, SEO_COUNTRIES, SEO_PAIRS } from '@/lib/seo-params';
import { getRecentScans } from '@/lib/scan-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.apexweb3.com'
    const currentDate = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        // Root
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'weekly', priority: 1 },

        // Blog
        { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },

        // Finance Tools
        { url: `${baseUrl}/finance/calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/finance/converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/finance/fiat-converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/finance/salary-estimator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

        // Discovery Tools
        { url: `${baseUrl}/discovery/spike-detector`, lastModified: currentDate, changeFrequency: 'hourly', priority: 0.9 },

        // Security Scanner (landing + old URL for backward compat)
        { url: `${baseUrl}/analysis/contract-analyzer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

        // Analysis Tools
        { url: `${baseUrl}/analysis/analyzer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/analysis/whales`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/analysis/risk`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },

        // Careers
        { url: `${baseUrl}/careers`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

        // Landing Pages & Dashboard
        { url: `${baseUrl}/intelligence`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${baseUrl}/dashboard`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    ];

    // Collect all dynamic routes
    const dynamicRoutes: MetadataRoute.Sitemap[] = [];

    try {
        // Blog posts + categories
        const [posts, categories] = await Promise.all([
            getLatestPosts(100),
            getCategories(),
        ]);

        dynamicRoutes.push(
            posts.map(post => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })),
            categories.map(cat => ({
                url: `${baseUrl}/blog/category/${cat.slug}`,
                lastModified: currentDate,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            })),
        );
    } catch (error) {
        console.error('Error fetching blog routes for sitemap:', error);
    }

    // Fiat converter programmatic routes
    dynamicRoutes.push(
        SEO_CRYPTOS.flatMap(crypto =>
            SEO_COUNTRIES.map(country => ({
                url: `${baseUrl}/finance/fiat-converter/${crypto}/${country}`,
                lastModified: currentDate,
                changeFrequency: 'hourly' as const,
                priority: 0.9,
            }))
        ),
    );

    // Converter pairs
    dynamicRoutes.push(
        SEO_PAIRS.map(pair => ({
            url: `${baseUrl}/finance/converter/${pair.from}/${pair.to}`,
            lastModified: currentDate,
            changeFrequency: 'hourly' as const,
            priority: 0.8,
        })),
    );

    // ── Token security pages (programmatic SEO) ──────────────────────────────
    // Pull the in-memory recent scans so every scanned token gets a sitemap entry.
    // In production with a DB, replace getRecentScans() with a DB query.
    try {
        const recentScans = getRecentScans(200);
        dynamicRoutes.push(
            recentScans.map(scan => ({
                url: `${baseUrl}/token/${scan.chain}/${scan.address}`,
                lastModified: new Date(scan.scannedAt),
                changeFrequency: 'hourly' as const,
                priority: 0.85,
            })),
        );
    } catch {/* non-critical */}

    return [...staticRoutes, ...dynamicRoutes.flat()];
}
