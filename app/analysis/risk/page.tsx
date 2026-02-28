import Link from "next/link";
import { ArrowRight, Shield, Wallet, Check, TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Web3 Risk & Portfolio Tools — Security Scanner & Portfolio Tracker | ApexWeb3",
    description: "Scan smart contracts for honeypots and rug pulls. Track your crypto portfolio risk and P&L in real-time. No wallet connection required.",
    keywords: ["crypto security scanner", "honeypot detector", "rug pull checker", "portfolio tracker", "web3 risk tools"],
};

const tools = [
    {
        icon: Shield,
        title: "Security Scanner",
        href: "/discovery/scan",
        description: "Audit any smart contract for honeypots, rug pull risks, owner privileges, and liquidity lock status before you invest a single dollar.",
        features: ["Honeypot Detection", "Liquidity Lock Check", "Owner Privilege Scan", "Mint Function Detection"],
        badge: "New",
        color: "text-brand-pink",
        bg: "bg-brand-pink/10",
        border: "border-brand-pink/20",
        nextTool: { label: "Now track the token in your Portfolio →", href: "/portfolio" },
    },
    {
        icon: Wallet,
        title: "Portfolio Tracker",
        href: "/portfolio",
        description: "Monitor all your crypto holdings with real-time prices, 24h change, and full P&L breakdown — stored locally, never uploaded.",
        features: ["Multi-Asset Support", "Real-Time Prices", "P&L Dashboard", "Local Storage Privacy"],
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        nextTool: { label: "Run a Security Scan before adding new tokens →", href: "/discovery/scan" },
    },
];

const faqs = [
    {
        q: "How does the honeypot detector work?",
        a: "The Security Scanner simulates a buy and sell transaction against the contract to detect if selling is blocked. It also checks for owner-only functions, abnormal tax rates, and liquidity lock status.",
    },
    {
        q: "Does the Portfolio Tracker require wallet connection?",
        a: "No. Your portfolio is stored locally in your browser — zero wallet connection, zero sign-up. Your holdings never leave your device.",
    },
    {
        q: "Which blockchains does the Security Scanner support?",
        a: "The Security Scanner currently supports Ethereum (ERC-20 tokens) and BSC (BEP-20 tokens). Simply paste the contract address and select the chain.",
    },
    {
        q: "Can I track both crypto and fiat value in my portfolio?",
        a: "Yes. The Portfolio Tracker displays asset values in USD and updates prices in real-time. All major cryptocurrencies are supported.",
    },
];

export default function RiskPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">

                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-widest mb-6">
                        🔴 Risk Pillar
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Web3 Risk & Portfolio Tools
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed mb-6">
                        Protect your capital before you deploy it. Scan contracts for red flags, then manage your exposure with real-time portfolio tracking.
                    </p>
                    <p className="text-gray-500">
                        2 professional tools · No wallet required · Privacy-first
                    </p>
                </div>

                {/* Tool Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-24 max-w-3xl mx-auto">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <div key={tool.href} className="flex flex-col gap-5 p-6 rounded-2xl bg-white/3 border border-white/5">
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
                                    <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{tool.description}</p>
                                    <ul className="space-y-1.5 mb-6">
                                        {tool.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                                <Check className={`w-3.5 h-3.5 ${tool.color} flex-shrink-0`} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-auto space-y-3">
                                    <Link
                                        href={tool.href}
                                        className={`flex items-center text-sm font-bold ${tool.color} hover:opacity-80 transition-opacity`}
                                    >
                                        Open Tool <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={tool.nextTool.href}
                                        className="flex items-center text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {tool.nextTool.label}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Internal Link — Intelligence */}
                <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl mx-auto">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-brand-blue flex-shrink-0" />
                        <div>
                            <div className="font-bold text-white">Research before you protect</div>
                            <div className="text-sm text-gray-400">Run tokenomics analysis and whale tracking before scanning security.</div>
                        </div>
                    </div>
                    <Link href="/intelligence" className="flex items-center gap-1 text-sm font-bold text-brand-blue hover:opacity-80 transition-opacity whitespace-nowrap">
                        Go to Intelligence <ArrowRight className="w-4 h-4" />
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
