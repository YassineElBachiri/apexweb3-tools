import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tools.apexweb3.com'
    const currentDate = new Date()

    return [
        // Root
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'weekly', priority: 1 },

        // Blog / Insights
        { url: `${baseUrl}/insights`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },

        // Finance Tools
        { url: `${baseUrl}/finance/calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/finance/converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/finance/fiat-converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/finance/salary-estimator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

        // Discovery Tools
        { url: `${baseUrl}/discovery/spike-detector`, lastModified: currentDate, changeFrequency: 'hourly', priority: 0.9 },
        { url: `${baseUrl}/discovery/scan`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/discovery/tracker`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },

        // Analysis Tools
        { url: `${baseUrl}/analysis/analyzer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/analysis/whales`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/analysis/contract-analyzer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/analysis/risk`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },

        // Careers
        { url: `${baseUrl}/careers`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

        // Landing Pages & Dashboard
        { url: `${baseUrl}/intelligence`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${baseUrl}/dashboard`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    ]
}
