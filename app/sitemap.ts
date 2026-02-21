import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tools.apexweb3.com'
    const currentDate = new Date()

    return [
        // Root
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'weekly', priority: 1 },

        // Pillar Landing Pages
        { url: `${baseUrl}/intelligence`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${baseUrl}/risk`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${baseUrl}/utilities`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${baseUrl}/careers`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },

        // Intelligence Tools
        { url: `${baseUrl}/analyzer`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/whales`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/spike-detector`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

        // Risk Tools
        { url: `${baseUrl}/scan`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/portfolio`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

        // Utilities
        { url: `${baseUrl}/calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/fiat-converter`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },

        // Careers Tools
        { url: `${baseUrl}/jobs`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/salary-estimator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },

        // Dashboard
        { url: `${baseUrl}/dashboard`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    ]
}
