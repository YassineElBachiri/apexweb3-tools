import { MetadataRoute } from 'next'
import { getLatestPosts, getCategories } from '@/lib/api/wordpress'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://apexweb3.com'
    const currentDate = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        // Root
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'weekly', priority: 1 },

        // Blog / Insights
        { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
        { url: `${baseUrl}/insights`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 }, // Keeping for backwards compatibility if still used

        // Finance Tools
        { url: `${baseUrl}/finance/calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/finance/converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/finance/fiat-converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/finance/salary-estimator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

        // Discovery Tools
        { url: `${baseUrl}/discovery/spike-detector`, lastModified: currentDate, changeFrequency: 'hourly', priority: 0.9 },
        { url: `${baseUrl}/analysis/contract-analyzer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/discovery/tracker`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },

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

    try {
        // Fetch up to 100 recent posts for the sitemap
        const posts = await getLatestPosts(100);
        const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'weekly',
            priority: 0.8
        }));

        const categories = await getCategories();
        const categoryRoutes: MetadataRoute.Sitemap = categories.map(cat => ({
            url: `${baseUrl}/blog/category/${cat.slug}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7
        }));

        return [...staticRoutes, ...categoryRoutes, ...postRoutes];
    } catch (error) {
        console.error('Error generating dynamic sitemap properties:', error);
        return staticRoutes;
    }
}
