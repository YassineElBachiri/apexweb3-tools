import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/home/Footer";
import { getCategories } from "@/lib/api/wordpress";

export const metadata: Metadata = {
    title: "ApexWeb3 Tools - Web3 Analytics & Token Analysis",
    description: "Real-time Web3 analytics for smart traders. Analyze tokens, track portfolios, detect rug pulls, and monitor whale transactions.",
    keywords: ["web3", "crypto", "token analysis", "portfolio tracker", "rug pull detector", "whale watch"],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const categories = await getCategories();

    return (
        <html lang="en" className="dark scroll-smooth">
            <body className="font-sans antialiased bg-brand-dark">
                <div className="min-h-screen flex flex-col">
                    <Navigation categories={categories} />
                    <main className="flex-1 pt-20">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
