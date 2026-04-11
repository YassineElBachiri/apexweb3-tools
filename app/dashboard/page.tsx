"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, Wallet, TrendingUp, Eye, ArrowRightLeft, DollarSign, Calculator, Activity } from "lucide-react";
import Link from "next/link";
import AffiliateBanner from "@/components/affiliates/AffiliateBanner";

export default function DashboardPage() {
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();

    const handleAnalyze = () => {
        const val = inputValue.trim();
        if (!val) return;
        // Native routing matching the contract-analyzer's designated eth address scanner
        router.push(`/analysis/security-scanner/eth/${val}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAnalyze();
        }
    };

    return (
        <div className="w-full bg-brand-dark text-white transition-colors duration-200 min-h-screen">
            <div className="container mx-auto px-[2rem] py-12 max-w-6xl">
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-[12px] bg-[#1D9E75] neon-glow text-white font-bold text-xl">
                            A3
                        </div>
                        <span className="font-bold text-xl tracking-wide opacity-90 gradient-text">ApexWeb3</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Web3 Analytics Dashboard</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Enter any wallet address or token contract to analyze</p>
                </div>

                {/* Search Bar */}
                <div className="mb-[1.5rem]">
                    <div className="relative flex items-center w-full max-w-3xl mx-auto">
                        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full pl-12 pr-32 py-4 rounded-[12px] border-[0.5px] border-white/10 glass shadow-none focus:outline-none focus:border-primary focus:neon-glow transition-all font-mono"
                            placeholder="0x... wallet or contract address"
                        />
                        <button 
                            onClick={handleAnalyze}
                            className="absolute right-2 px-6 py-2 rounded-[8px] bg-[#1D9E75] hover:bg-[#178562] text-white font-semibold transition-colors">
                            Analyze
                        </button>
                    </div>
                </div>

                <div className="space-y-[1.5rem] mt-16">
                    {/* Intelligence Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold">Intelligence</h2>
                            <div className="h-[0.5px] flex-1 bg-white/10"></div>
                        </div>
                        <div className="grid gap-[12px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                            {/* Card 1 */}
                            <Link href="/portfolio" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-primary/50 hover:bg-primary/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-primary/20 flex items-center justify-center mb-4 neon-glow">
                                    <Wallet className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Portfolio Tracker</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Track any wallet&apos;s token holdings and total value without connecting.
                                </p>
                                <div className="text-[11px] text-slate-500 mt-auto font-mono">
                                    → enter address
                                </div>
                            </Link>

                            {/* Card 2 */}
                            <Link href="/analysis/analyzer" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-secondary/50 hover:bg-secondary/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-secondary/20 flex items-center justify-center mb-4 neon-glow-purple">
                                    <TrendingUp className="w-5 h-5 text-secondary" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Tokenomics Analyzer</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Calculate sustainability scores, inflation risk ratios, and FDV analysis.
                                </p>
                                <div className="text-[11px] text-slate-500 mt-auto font-mono">
                                    → enter contract
                                </div>
                            </Link>

                            {/* Card 3 */}
                            <Link href="/analysis/whales" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-[#1D9E75]/50 hover:bg-[#1D9E75]/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-[#1D9E75]/20 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 20px rgba(29, 158, 117, 0.4)' }}>
                                    <Eye className="w-5 h-5 text-[#1D9E75]" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Whale Watch</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Monitor large transactions and smart money movements in real-time.
                                </p>
                                <div className="mt-auto">
                                    <span className="inline-block px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                                        Live feed
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Security & Risk Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold">Security & Risk</h2>
                            <div className="h-[0.5px] flex-1 bg-white/10"></div>
                        </div>
                        <div className="grid gap-[12px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                            {/* Card 1 */}
                            <Link href="/analysis/contract-analyzer" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-red-500/50 hover:bg-red-500/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-red-500/20 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>
                                    <Shield className="w-5 h-5 text-red-500" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Degen Shield</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Detect honeypots, rug pulls, and suspicious contract patterns instantly.
                                </p>
                                <div className="mt-auto">
                                    <span className="inline-block px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                        Security scan
                                    </span>
                                </div>
                            </Link>

                            {/* Card 2 */}
                            <Link href="/discovery/spike-detector" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-orange-500/50 hover:bg-orange-500/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-orange-500/20 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)' }}>
                                    <Activity className="w-5 h-5 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Meme Coin Scanner</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Analyze social sentiment, liquidity locks, and creator wallet history.
                                </p>
                                <div className="text-[11px] text-slate-500 mt-auto font-mono">
                                    → enter contract
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Utilities Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold">Utilities</h2>
                            <div className="h-[0.5px] flex-1 bg-white/10"></div>
                        </div>
                        <div className="grid gap-[12px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                            {/* Card 1 */}
                            <Link href="/finance/converter" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-indigo-500/20 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>
                                    <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Crypto Converter</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Convert between Bitcoin, Ethereum, and 100+ cryptocurrencies.
                                </p>
                                <div className="mt-auto self-start">
                                    <span className="inline-block px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-wider font-mono">
                                        Launch Utility ↗
                                    </span>
                                </div>
                            </Link>

                            {/* Card 2 */}
                            <Link href="/finance/fiat-converter" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-emerald-500/20 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Fiat Exchange</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Calculate crypto value in 30+ global fiat currencies.
                                </p>
                                <div className="mt-auto self-start">
                                    <span className="inline-block px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-wider font-mono">
                                        Launch Utility ↗
                                    </span>
                                </div>
                            </Link>

                            {/* Card 3 */}
                            <Link href="/finance/calculator" className="group flex flex-col p-4 rounded-[12px] border-[0.5px] border-white/10 glass hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-smooth min-h-[160px]">
                                <div className="w-10 h-10 rounded-[8px] bg-cyan-500/20 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}>
                                    <Calculator className="w-5 h-5 text-cyan-500" />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1">Avg Cost Calculator</h3>
                                <p className="text-[12px] text-slate-400 line-clamp-2 mb-4">
                                    Plan your exit strategy and calculate average entry/exit costs.
                                </p>
                                <div className="mt-auto self-start">
                                    <span className="inline-block px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-wider font-mono">
                                        Launch Utility ↗
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Featured Partners / Affiliation */}
                <div className="mt-16">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold">Featured Partners</h2>
                        <div className="h-[0.5px] flex-1 bg-white/10"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[12px]">
                        {/* We use pageId deals to get all general affiliates onto the dashboard */}
                        <AffiliateBanner pageId="deals" variant="card" limit={4} />
                    </div>
                </div>

                {/* Quick Start Block */}
                <div className="mt-16 p-6 md:p-8 rounded-[12px] glass border-[0.5px] border-white/10 shadow-none">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                        Quick Start
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            "Copy any Ethereum wallet address or token contract address",
                            "Paste it into the search bar at the top of the dashboard",
                            "Click 'Analyze' to scan the address or contract",
                            "Review insights and make informed trading decisions"
                        ].map((step, idx) => (
                            <div key={idx} className="flex flex-col gap-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1D9E75] text-white text-xs font-bold shadow-none">
                                    {idx + 1}
                                </div>
                                <p className="text-[13px] text-slate-300 leading-relaxed">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
