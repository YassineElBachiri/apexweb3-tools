import Link from "next/link";
import { ArrowRight, TrendingUp, Eye, Flame, Check, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Web3 Intelligence Tools — Market Signals & Tokenomics Analysis | ApexWeb3",
    description: "Track whale wallets, detect early meme coin liquidity events, and run deep tokenomics analysis. Professional-grade Web3 intelligence tools — free, no login required.",
    keywords: ["whale wallet tracker", "meme coin scanner", "tokenomics analyzer", "web3 intelligence", "crypto market signals"],
};

const tools = [
    {
        icon: TrendingUp,
        title: "Tokenomics Analyzer",
        href: "/analysis/analyzer",
        description: "Deep-dive token analysis with a 0–100 investment score, supply metrics, vesting schedules, and risk verdicts.",
        features: ["0-100 Investment Score", "Supply & Inflation Analysis", "Vesting Schedule Check", "Risk Verdict"],
        badge: "Most Popular",
        color: "text-brand-purple",
        bg: "bg-brand-purple/10",
        border: "border-brand-purple/20",
    },
    {
        icon: Eye,
        title: "Whale Watch",
        href: "/analysis/whales",
        description: "Monitor large wallet movements ($100K+) in real-time. Track smart money before the market reacts.",
        features: ["Live Transaction Feed", "$100K+ Movements", "Wallet Labels", "Multi-chain Coverage"],
        color: "text-brand-blue",
        bg: "bg-brand-blue/10",
        border: "border-brand-blue/20",
    },
    {
        icon: Flame,
        title: "Meme Coin Scanner",
        href: "/discovery/spike-detector",
        description: "Detect early liquidity events and volume spikes on meme coins across Solana and Base — before the crowd.",
        features: ["Early Liquidity Alerts", "Solana & Base Coverage", "Volume Spike Detection", "Live Updates"],
        badge: "Live",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
    },
];

const faqs = [
    {
        q: "How do I track whale wallet movements?",
        a: "Our Whale Watch tool shows all wallet transactions above $100,000 in real-time across major chains. No wallet connection needed — just open the tool and monitor live feeds instantly.",
    },
    {
        q: "What does the Tokenomics Analyzer score mean?",
        a: "The 0–100 investment score evaluates token supply distribution, inflation rate, vesting schedules, holder concentration, and market data. A higher score indicates lower structural risk.",
    },
    {
        q: "Which chains does the Meme Coin Scanner cover?",
        a: "The Meme Coin Scanner currently focuses on Solana and Base — the two highest-volume meme coin ecosystems — detecting early liquidity events and volume spikes in real-time via Dexscreener data.",
    },
    {
        q: "Are these intelligence tools free to use?",
        a: "Yes. All three Intelligence tools are completely free with no account required. Data is fetched live from public on-chain sources and market APIs.",
    },
];

export default function IntelligencePage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">

                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-6">
                        🔵 Intelligence Pillar
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Web3 Intelligence Tools
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed mb-6">
                        Market signals, smart money tracking, and deep token analysis — everything you need to act before the market moves.
                    </p>
                    <p className="text-gray-500">
                        3 professional tools · Live market data · No wallet required
                    </p>
                </div>

                {/* Tool Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-24">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="group flex flex-col gap-5 p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl border ${tool.bg} ${tool.border}`}>
                                        <Icon className={`w-6 h-6 ${tool.color}`} />
                                    </div>
                                    {tool.badge && (
                                        <span className="text-[10px] font-bold bg-brand-pink/80 text-white px-2 py-0.5 rounded-full">
                                            {tool.badge}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold mb-2 group-hover:${tool.color} transition-colors`}>
                                        {tool.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                        {tool.description}
                                    </p>
                                    <ul className="space-y-1.5">
                                        {tool.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                                <Check className={`w-3.5 h-3.5 ${tool.color} flex-shrink-0`} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={`mt-auto flex items-center text-sm font-semibold ${tool.color}`}>
                                    Open Tool <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Internal Link — Risk Pillar */}
                <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-brand-pink flex-shrink-0" />
                        <div>
                            <div className="font-bold text-white">Protect before you invest</div>
                            <div className="text-sm text-gray-400">
                                After analyzing a token, scan its smart contract for risks.
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/analysis/risk"
                        className="flex items-center gap-1 text-sm font-bold text-brand-pink hover:opacity-80 transition-opacity whitespace-nowrap"
                    >
                        Go to Risk Tools <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* FAQ */}
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/3 border border-white/5">
                                <h3 className="font-bold text-white mb-3">{faq.q}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
