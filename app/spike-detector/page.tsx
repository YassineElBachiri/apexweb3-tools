import { Metadata } from "next";
import { SpikeDetectorDashboard } from "@/components/spike-detector/Dashboard";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Early Liquidity & Meme Coin Spike Detector | Multi-Chain Crypto Scanner",
    description: "Detect early liquidity injections and volume spikes across Ethereum, Solana, Base, BNB, Arbitrum and more. Find early momentum before the crowd.",
    keywords: ["crypto scanner", "liquidity spike", "volume monitor", "gem finder", "new pairs", "dexscreener alternative"],
};

export default function SpikeDetectorPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Early Liquidity & Volume Spike Detector",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
        },
        description: "Real-time scanner for detecting high-momentum meme coins across multiple blockchains."
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20">
            <JsonLd data={structuredData} />

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-12">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-brand-primary blur-[120px]" />
                </div>

                <div className="container mx-auto relative z-10 px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-4 border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Live Meme Coin Scanner
                        </Badge>
                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                            Early Liquidity & <br className="hidden sm:inline" />
                            <span className="bg-gradient-to-r from-brand-primary to-purple-500 bg-clip-text text-transparent">
                                Meme Coin Detector
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400">
                            Scan for rapid liquidity injections and viral volume spikes on Solana, Base, and Ethereum.
                            Find the next 100x meme coin before it trends on Dexscreener.
                        </p>
                    </div>
                </div>
            </div>

            {/* Dashboard Section */}
            <div className="container mx-auto px-4 py-8 md:px-6">
                <SpikeDetectorDashboard />
            </div>

            {/* Info / Disclaimer Section */}
            <div className="container mx-auto px-4 py-8 md:px-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-400">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-slate-300">
                        <Info className="h-4 w-4" />
                        How It Works
                    </div>
                    <ul className="mb-4 list-disc space-y-1 pl-5">
                        <li><strong className="text-slate-300">Volume Spikes:</strong> Detects when 5-minute volume exceeds the hourly average by 300%+.</li>
                        <li><strong className="text-slate-300">Liquidity Injections:</strong> Flags tokens with rapid liquidity growth relative to their age.</li>
                        <li><strong className="text-slate-300">Scoring System:</strong> Our algorithm assigns a 0-100 score based on momentum, buy pressure, and freshness.</li>
                    </ul>

                    <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-500">
                        <strong className="text-red-400">Disclaimer:</strong> This tool aggregates public blockchain data and does not constitute financial advice.
                        New tokens are extremely high risk. 99% of new pairs may be scams, rug pulls, or honeypots.
                        Always verify contract security and lock status before trading.
                    </div>
                </div>
            </div>
        </div>
    );
}
