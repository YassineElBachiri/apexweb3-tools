import { Metadata } from "next";
import { SpikeDetectorDashboard } from "@/components/spike-detector/Dashboard";
import { getSpikingTokens } from "@/lib/actions/spike-detector";
import { SEOContent } from "@/components/spike-detector/SEOContent";
import { Badge } from "@/components/ui/badge";
import { Zap, Info, Shield } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata(): Promise<Metadata> {
    const data = await getSpikingTokens();
    const spikeCount = "pairs" in data ? data.pairs.filter(p => p.isSpiking).length : 0;
    const title = spikeCount > 0
        ? `${spikeCount} Spikes Detected - Trench Hunter | ApexWeb3`
        : "Trench Hunter — Micro-Cap Spike Detector | ApexWeb3";

    return {
        title,
        description: "Hunt micro-cap trench tokens (MCAP < $1.5M) with real-time Volume Velocity scoring. Filters big-cap noise, checks RugCheck safety, and surfaces only the freshest momentum plays.",
        keywords: ["trench tokens", "micro-cap scanner", "rugcheck", "solana trench", "memecoin spike detector", "volume velocity dashboard", "live crypto feed", "dexscreener alternative", "gem finder"],
    };
}

export default async function SpikeDetectorPage() {
    const initialData = await getSpikingTokens();

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Volume Velocity Dashboard",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
            "Real-time memecoin Volume Velocity scanner with security scoring from RugCheck and GoPlus. Identifies spikes before they trend.",
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20">
            <JsonLd data={structuredData} />

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-12">
                {/* Background glow blobs */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
                    <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-brand-primary blur-[130px]" />
                    <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-purple-600 blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge
                            variant="outline"
                            className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        >
                            <Zap className="mr-1 h-3 w-3 fill-current" />
                            Live Feed — Updates Every 5s
                        </Badge>

                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                            Trench{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-brand-primary to-purple-400 bg-clip-text text-transparent">
                                Hunter
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400">
                            Hunt{" "}
                            <span className="font-semibold text-slate-200">
                                micro-cap tokens (MCAP &lt; $1.5M)
                            </span>{" "}
                            before they moon. Real-time velocity scanning with RugCheck safety checks.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <StatPill icon="🟢" label="RugCheck (Solana)" />
                            <StatPill icon="🔵" label="GoPlus (ETH/Base)" />
                            <StatPill icon="⚡" label="5s Auto-Refresh" />
                            <StatPill icon="🎯" label="Velocity > 5% + Price > 2%" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard */}
            <div className="container mx-auto px-4 py-8 md:px-6">
                <SpikeDetectorDashboard initialData={"pairs" in initialData ? initialData : undefined} />
            </div>

            {/* SEO Content & FAQ */}
            <SEOContent />

            {/* How It Works & Disclaimer */}
            <div className="container mx-auto px-4 py-8 md:px-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-400">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-slate-300">
                        <Info className="h-4 w-4 text-brand-primary" />
                        Platform Methodology
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs">
                        <HowItWorksItem
                            emoji="⚡"
                            title="Trench Spike Logic"
                            body="A token is flagged 🟢 SPIKING only when Volume Velocity (Vol5m / Liq × 100) > 5% AND 5m price change > 2%."
                        />
                        <HowItWorksItem
                            emoji="🌡️"
                            title="Heat Map Ticker"
                            body="The scrolling strip uses a green-to-red glow based on 5m price change. Deep green = strong momentum."
                        />
                        <HowItWorksItem
                            emoji="🛡️"
                            title="Safety & Downgrade"
                            body="Solana tokens checked via RugCheck. If marked High Risk, the SPIKING badge is removed regardless of velocity."
                        />
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <div className="flex items-start gap-2 rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-xs leading-relaxed">
                            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <div>
                                <p className="font-bold text-red-400 mb-1 tracking-wide uppercase">Legal Risk Disclaimer (E-E-A-T Compliance)</p>
                                <p className="text-slate-400">
                                    Trading digital assets, especially micro-cap &quot;memecoins,&quot; involves extreme volatility and permanent capital loss risk.
                                    ApexWeb3 Trench Hunter is an analytical tool aggregating on-chain data for informational purposes only.
                                    It does **NOT** constitute financial, investment, or legal advice.
                                    Smart contract vulnerabilities (rug pulls, honeypots) are prevalent; security scores are historical and do not guarantee future safety.
                                    Always perform your own due diligence (DYOR) before interacting with any smart contract.
                                    © 2026 ApexWeb3 Intelligence. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatPill({ icon, label }: { icon: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            <span>{icon}</span>
            {label}
        </span>
    );
}

function HowItWorksItem({
    emoji,
    title,
    body,
}: {
    emoji: string;
    title: string;
    body: string;
}) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-slate-200">
                <span>{emoji}</span>
                {title}
            </p>
            <p className="text-xs leading-relaxed text-slate-500">{body}</p>
        </div>
    );
}
