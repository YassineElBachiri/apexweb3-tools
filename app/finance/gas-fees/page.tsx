import { GasDashboard } from "@/components/gas/GasDashboard";
import { CostEstimator } from "@/components/gas/CostEstimator";
import { Metadata } from "next";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GasFAQ } from "@/components/gas/GasFAQ";
import { RelatedTools } from "@/components/gas/RelatedTools";

export const metadata: Metadata = {
    title: "Ethereum Gas Fee Calculator (Real-Time & Accurate) | ApexWeb3",
    description: "Track live gas prices for Ethereum, Polygon, Arbitrum, Optimism, and Base. Calculate transaction costs for transfers, swaps, and NFT mints in USD.",
    openGraph: {
        title: "Crypto Gas Fee Calculator | ApexWeb3 Tools",
        description: "Save money on gas fees. Real-time tracking and cost estimation for EVM chains.",
    }
};

export default function GasCalculatorPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <Badge variant="outline" className="mb-2 bg-orange-500/10 text-orange-400 border-orange-500/20 px-3 py-1">
                        <Zap className="w-3 h-3 mr-1 inline-block" /> Live Tracker
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 pb-2">
                        Multi-Chain Gas Calculator
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                        Monitor real-time gas fees across Ethereum L1, L2s, Solana, and Sui.
                        Calculate exact transaction costs in USD before you send.
                    </p>
                </div>

                {/* Main Tool Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Dashboard takes up left side */}
                        <div className="bg-card/40 border border-white/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
                            <GasDashboard initialChainId={1} />
                        </div>

                        {/* Sponsored Block */}
                        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-blue-200">Scale without limits?</h3>
                                <p className="text-sm text-muted-foreground">Get reliable RPC nodes for your dApp.</p>
                            </div>
                            <div className="flex gap-3">
                                <a href="https://www.alchemy.com/?r=affiliate" target="_blank" rel="sponsored" className="px-5 py-2 text-sm bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                    Alchemy
                                </a>
                                <a href="https://infura.io" target="_blank" rel="sponsored" className="px-5 py-2 text-sm bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
                                    Infura
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Cost Estimator takes up right side sidebar */}
                        <div className="sticky top-24">
                            <div className="bg-card/40 border border-white/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
                                <CostEstimator chainId={1} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content & SEO */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                            <h2>Understanding Gas Fees</h2>
                            <p>
                                Gas fees are the fuel that powers blockchain networks. On Ethereum, they are measured in <strong>Gwei</strong>.
                                Prices fluctuate based on network congestion—more activity means higher fees.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-8">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <h4 className="font-bold text-green-400 mb-2">Cheap Times</h4>
                                    <p className="text-sm text-muted-foreground">Weekends & UTC Nights (01:00 - 05:00 UTC)</p>
                                </div>
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <h4 className="font-bold text-red-400 mb-2">Peak Times</h4>
                                    <p className="text-sm text-muted-foreground">NFT Mints & US/EU Work Hours</p>
                                </div>
                            </div>
                            <h3>How to save on gas?</h3>
                            <ul>
                                <li>Wait for off-peak hours.</li>
                                <li>Use Layer 2 networks like <strong>Arbitrum</strong> or <strong>Optimism</strong>.</li>
                                <li>Set custom max base fees in your wallet (advanced users).</li>
                            </ul>
                        </article>

                        <GasFAQ />
                    </div>
                    <div className="lg:col-span-4">
                        {/* Sidebar content / Supported Chains list could go here */}
                    </div>
                </div>

                <RelatedTools />

                {/* FAQ Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [{
                                "@type": "Question",
                                "name": "What is Gwei?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Gwei is a denomination of Ether (ETH) used to measure gas prices. 1 Gwei = 0.000000001 ETH."
                                }
                            }, {
                                "@type": "Question",
                                "name": "Why are Ethereum gas fees so high?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Fees are high due to limited block space and high demand. When many users compete to get their transactions included in a block, they bid up the gas price."
                                }
                            }]
                        })
                    }}
                />
            </div>
        </div>
    );
}
