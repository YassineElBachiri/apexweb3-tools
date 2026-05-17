import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-syne", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/home/Footer";
import { getCategories } from "@/lib/api/wordpress";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.apexweb3.com'),
    title: 'ApexWeb3 — Web3 Analytics, Jobs & AI Intelligence Tools',
    description: 'Free Web3 tools for smart traders and builders. Scan tokens, track whale wallets, detect rug pulls, browse 200+ Web3 & AI jobs, and benchmark salaries. No wallet required.',
    keywords: [
        'web3 tools', 'token analysis', 'whale tracker', 'rug pull detector',
        'web3 jobs', 'blockchain jobs', 'DeFi analytics', 'meme coin scanner',
        'smart contract scanner', 'AI web3 jobs', 'crypto portfolio tracker'
    ],
    openGraph: {
        title: 'ApexWeb3 — Web3 Analytics, Jobs & AI Intelligence',
        description: 'Free professional-grade Web3 tools. Token analysis, whale tracking, rug pull detection, and 200+ live Web3 & AI careers.',
        url: 'https://www.apexweb3.com',
        siteName: 'ApexWeb3',
        images: [{
            url: 'https://www.apexweb3.com/ApexWeb3-logo.png',
            width: 1200,
            height: 630,
            alt: 'ApexWeb3 — Web3 Analytics and Intelligence Platform'
        }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ApexWeb3 — Web3 Analytics, Jobs & AI Intelligence',
        description: 'Free Web3 tools: token analysis, whale tracking, rug pull detection, and 200+ live Web3 jobs.',
        images: ['https://www.apexweb3.com/ApexWeb3-logo.png'],
    },
    alternates: {
        canonical: 'https://www.apexweb3.com',
    },
    icons: {
        icon: [
            { url: '/ApexWeb3-icon.png', type: 'image/png' }
        ],
        apple: [
            { url: '/ApexWeb3-icon.png', type: 'image/png' }
        ],
    },
};

import { Suspense } from 'react';
import { UTMTracker } from '@/components/UTMTracker';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const categories = await getCategories();

    return (
        <html lang="en" className="dark scroll-smooth">
            <body className={`${syne.variable} ${dmMono.variable} font-sans antialiased bg-brand-dark`}>
                <div className="min-h-screen flex flex-col">
                    <Navigation categories={categories} />
                    <main className="flex-1 pt-20">
                        {children}
                    </main>
                    <Footer />
                </div>
                {process.env.NODE_ENV === 'production' && (
                    <GoogleAnalytics gaId="G-G7ZHCJ9Z4F" />
                )}
                <Suspense fallback={null}>
                    <UTMTracker />
                </Suspense>
            </body>
        </html>
    );
}
