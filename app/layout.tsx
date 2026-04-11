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
    title: "ApexWeb3 Tools - Web3 Analytics & Token Analysis",
    description: "Real-time Web3 analytics for smart traders. Analyze tokens, track portfolios, detect rug pulls, and monitor whale transactions.",
    keywords: ["web3", "crypto", "token analysis", "portfolio tracker", "rug pull detector", "whale watch"],
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/ApexWeb3-icon.png', type: 'image/png' }
        ],
        apple: [
            { url: '/ApexWeb3-icon.png', type: 'image/png' }
        ],
    },
    openGraph: {
        images: ['/ApexWeb3-logo.png']
    }
};

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
            </body>
        </html>
    );
}
