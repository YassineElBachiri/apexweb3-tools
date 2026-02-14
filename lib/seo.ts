import { Metadata } from "next";

interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
    const baseUrl = "https://tools.apexweb3.com";

    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        ...(config.canonical && {
            alternates: {
                canonical: `${baseUrl}${config.canonical}`
            }
        }),
        openGraph: {
            title: config.title,
            description: config.description,
            url: config.canonical ? `${baseUrl}${config.canonical}` : baseUrl,
            siteName: "ApexWeb3 Tools",
            type: "website",
            ...(config.ogImage && {
                images: [{
                    url: config.ogImage,
                    width: 1200,
                    height: 630,
                    alt: config.title
                }]
            })
        },
        twitter: {
            card: "summary_large_image",
            title: config.title,
            description: config.description,
            ...(config.ogImage && { images: [config.ogImage] })
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            }
        }
    };
}

// Generate WebApplication schema for the platform
export function generateWebApplicationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ApexWeb3 Tools",
        "description": "Professional cryptocurrency analysis tools for traders and investors. Track portfolios, analyze tokenomics, detect scams, and more.",
        "url": "https://tools.apexweb3.com",
        "applicationCategory": "FinanceApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "permissions": "No special permissions required"
    };
}

// Generate Organization schema
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ApexWeb3",
        "url": "https://apexweb3.com",
        "logo": "https://tools.apexweb3.com/logo.png",
        "sameAs": [
            // Add social media links when available
        ],
        "subOrganization": {
            "@type": "WebApplication",
            "name": "ApexWeb3 Tools",
            "url": "https://tools.apexweb3.com"
        }
    };
}
