import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { PillarGrid } from "@/components/home/PillarGrid";
import { LatestBlogPosts } from "@/components/home/LatestBlogPosts";
import { AiWeb3Highlight } from "@/components/home/AiWeb3Highlight";
import { JobsTeaser } from "@/components/home/JobsTeaser";

// Below-the-fold sections loaded lazily to reduce initial JS bundle & TBT
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks").then(m => m.HowItWorks), { ssr: true });
const FeaturesShowcase = dynamic(() => import("@/components/home/FeaturesShowcase").then(m => m.FeaturesShowcase), { ssr: true });
const StatsSection = dynamic(() => import("@/components/home/StatsSection").then(m => m.StatsSection), { ssr: true });
const CTASection = dynamic(() => import("@/components/home/CTASection").then(m => m.CTASection), { ssr: true });

export default function Home() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': 'https://www.apexweb3.com/#website',
                url: 'https://www.apexweb3.com',
                name: 'ApexWeb3',
                description: 'Web3 analytics, intelligence tools, and career platform for crypto traders and builders.',
                potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://www.apexweb3.com/jobs?q={search_term_string}',
                    'query-input': 'required name=search_term_string'
                }
            },
            {
                '@type': 'SoftwareApplication',
                name: 'ApexWeb3',
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD'
                },
                featureList: [
                    'Token Analysis',
                    'Whale Wallet Tracker',
                    'Smart Contract Security Scanner',
                    'Meme Coin Scanner',
                    'Web3 Jobs Board',
                    'Salary Estimator',
                    'Portfolio Tracker'
                ],
                url: 'https://www.apexweb3.com',
                screenshot: 'https://www.apexweb3.com/ApexWeb3-logo.png'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-purple/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero />
            <PillarGrid />
            <AiWeb3Highlight />
            <FeaturesShowcase />
            <HowItWorks />
            <StatsSection />
            <JobsTeaser />
            <LatestBlogPosts />
            <CTASection />
        </div>
    );
}
