"use client";

import { ApexRiskProfile, TokenMarketData } from "@/lib/security-service";
import { formatUSD, formatNumber } from "@/lib/utils";
import {
    AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck,
    Share2, Copy, ArrowRight, Activity, TrendingUp, TrendingDown,
    DollarSign, Droplets, BarChart3, Search, Globe, Calendar,
    Lock, Zap, Info, ChevronRight, Twitter, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RiskDashboardProps {
    profile: ApexRiskProfile;
    marketData?: TokenMarketData | null;
}

// ─── Stat Box ──────────────────────────────────────────────────────────────────
function SmallStat({ label, value, sub, accent = "blue", icon }: { label: string; value: string; sub?: string; accent?: string; icon?: React.ReactNode }) {
    const accents: Record<string, string> = {
        blue: "border-blue-500/20 hover:border-blue-500/40 text-blue-400",
        emerald: "border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400",
        rose: "border-rose-500/20 hover:border-rose-500/40 text-rose-400",
        amber: "border-amber-500/20 hover:border-amber-500/40 text-amber-400",
    };
    return (
        <div className={`p-4 rounded-2xl bg-slate-900/60 border backdrop-blur-sm transition-all duration-200 ${accents[accent]}`}>
            <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">
                {icon} {label}
            </div>
            <p className="text-lg font-black text-white">{value}</p>
            {sub && <p className="text-[10px] font-bold mt-1 opacity-70">{sub}</p>}
        </div>
    );
}

export function RiskDashboard({ profile, marketData }: RiskDashboardProps) {
    const [copied, setCopied] = useState(false);
    const isSafe = profile.status === 'SAFE';
    const isCritical = profile.status === 'CRITICAL';
    const isWarning = profile.status === 'WARNING';

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swapAmount = 100;
    const calculateSimulatedResult = () => {
        if (profile.isHoneypot) return 0;
        let amount = swapAmount;
        if (profile.buyTax) amount *= (1 - (profile.buyTax / 100));
        if (profile.sellTax) amount *= (1 - (profile.sellTax / 100));
        return parseFloat(amount.toFixed(2));
    };

    const simulatedReturn = calculateSimulatedResult();
    const swapFails = profile.isHoneypot || simulatedReturn === 0;
    const statusColor = isSafe ? 'emerald' : isCritical ? 'rose' : 'amber';
    const statusGlow = isSafe ? 'shadow-emerald-500/20' : isCritical ? 'shadow-rose-500/20 animate-pulse' : 'shadow-amber-500/10';

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `🔍 Security Scan for ${marketData?.tokenSymbol || profile.address.slice(0, 8)} on ApexWeb3\nVerdict: ${isSafe ? 'Likely Safe' : isCritical ? 'High Risk' : 'Caution'}\nScore: ${profile.score}/100\n${shareUrl}`;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* ── THE VERDICT BANNER ── */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border backdrop-blur-xl transition-all duration-500 ${isSafe ? 'bg-emerald-500/5 border-emerald-500/30' : isCritical ? 'bg-rose-500/5 border-rose-500/30' : 'bg-amber-500/5 border-amber-500/30'} ${statusGlow}`}>
                <div className={`absolute -top-24 -right-24 w-80 h-80 blur-[120px] rounded-full opacity-20 ${isSafe ? 'bg-emerald-400' : isCritical ? 'bg-rose-400' : 'bg-amber-400'}`} />
                <div className={`absolute -bottom-24 -left-24 w-60 h-60 blur-[100px] rounded-full opacity-10 ${isSafe ? 'bg-emerald-400' : isCritical ? 'bg-rose-400' : 'bg-amber-400'}`} />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className={`p-5 rounded-2xl border flex items-center justify-center ${isSafe ? 'bg-emerald-500/10 border-emerald-500/30' : isCritical ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                            {isSafe ? <ShieldCheck className="w-10 h-10 text-emerald-400" /> : isCritical ? <ShieldAlert className="w-10 h-10 text-rose-400" /> : <AlertTriangle className="w-10 h-10 text-amber-400" />}
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Security Verdict</p>
                            <h2 className={`text-4xl font-black tracking-tight leading-none ${isSafe ? 'text-emerald-400' : isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                                {isSafe ? 'Likely Safe' : isCritical ? 'High Risk' : 'Caution Required'}
                            </h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs font-bold text-slate-400">
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700`}>{profile.network.toUpperCase()}</span>
                                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 select-all cursor-copy active:scale-95 transition-transform" onClick={() => {navigator.clipboard.writeText(profile.address); setCopied(true); setTimeout(()=>setCopied(false), 2000)}}>{copied ? 'Copied!' : profile.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center lg:items-end">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 lg:text-right">Risk Score</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-7xl font-black text-white leading-none tabular-nums drop-shadow-2xl">{profile.score}</span>
                            <span className="text-xl font-bold text-slate-600">/100</span>
                        </div>
                        
                        {/* Share dropdown */}
                        <div className="relative group mt-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-700 hover:border-cyan-500/40 hover:text-cyan-400 transition-all">
                                <Share2 className="w-3.5 h-3.5" /> Share Result
                            </button>
                            <div className="absolute right-0 lg:right-0 top-full mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 overflow-hidden">
                                <button onClick={handleShare} className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <Copy className="w-4 h-4" /> {copied ? "Copied!" : "Copy Link"}
                                </button>
                                <div className="mx-3 h-px bg-slate-800" />
                                <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")} className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <Twitter className="w-4 h-4 text-cyan-400" /> Share on X
                                </button>
                                <div className="mx-3 h-px bg-slate-800" />
                                <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank")} className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <ExternalLink className="w-4 h-4 text-blue-400" /> Telegram
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MARKET STATS GRID ── */}
            {marketData && (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <SmallStat label="Price" value={formatUSD(marketData.priceUsd, marketData.priceUsd < 0.01 ? 6 : 2)} sub={`${marketData.priceChange24h >= 0 ? '↗' : '↘'} ${marketData.priceChange24h.toFixed(2)}%`} accent={marketData.priceChange24h >= 0 ? "emerald" : "rose"} icon={<DollarSign className="w-3 h-3" />} />
                    <SmallStat label="Liquidity" value={formatUSD(marketData.liquidity, 0)} sub={`Pool: ${marketData.dexName?.toUpperCase() || 'DEX'}`} accent="blue" icon={<Droplets className="w-3 h-3" />} />
                    <SmallStat label="24h Volume" value={formatUSD(marketData.volume24h, 0)} sub="Total Trading" accent="blue" icon={<BarChart3 className="w-3 h-3" />} />
                    <SmallStat label="Market Cap" value={formatUSD(marketData.marketCap || 0, 0)} accent="blue" icon={<Globe className="w-3 h-3" />} />
                    <SmallStat label="Pair Age" value={marketData.pairCreatedAt || 'New'} sub="Since Deployment" accent="amber" icon={<Calendar className="w-3 h-3" />} />
                    <SmallStat label="Network" value={profile.network.toUpperCase()} sub="Smart Contract" accent="purple" icon={<Shield className="w-3 h-3" />} />
                 </div>
            )}

            {/* ── MAIN AUDIT PANELS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Simulated Swap */}
                <div className="lg:col-span-1 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                        <Zap className="w-4 h-4 text-cyan-400" /> Simulated Execution
                    </div>
                    
                    <div className="relative pl-6 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                        <div className="relative">
                            <span className="absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-900 ring-4 ring-slate-900 flex items-center justify-center text-[8px] font-black text-slate-400">1</span>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-bold text-slate-200 text-xs">Buy Order (${swapAmount})</span>
                                <span className={`text-xs font-black ${profile.buyTax && profile.buyTax > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>{profile.buyTax ? `-${profile.buyTax}%` : '0% Tax'}</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className="relative">
                            <span className="absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-900 ring-4 ring-slate-900 flex items-center justify-center text-[8px] font-black text-slate-400">2</span>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-bold text-slate-200 text-xs">Sell Order</span>
                                <span className={`text-xs font-black ${profile.sellTax && profile.sellTax > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>{profile.sellTax ? `-${profile.sellTax}%` : '0% Tax'}</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${swapFails ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: swapFails ? '10%' : '100%' }} />
                            </div>
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border text-center ${swapFails ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                        <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total Return on ${swapAmount}</p>
                        <p className={`text-4xl font-black mb-1 ${swapFails ? 'text-rose-400' : 'text-emerald-400'}`}>${simulatedReturn}</p>
                        <p className="text-xs text-slate-500 font-bold">{swapFails ? '❌ Execution Failed (Honeypot)' : '✅ Order Successfully Executed'}</p>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                        <div className="flex justify-between text-xs">
                           <span className="text-slate-500 font-bold">Price Impact</span>
                           <span className={`font-black ${marketData && (swapAmount / marketData.liquidity * 100) > 5 ? 'text-rose-400' : 'text-emerald-500'}`}>
                                {marketData ? `${((swapAmount / marketData.liquidity) * 100).toFixed(2)}%` : '—'}
                           </span>
                        </div>
                        <div className="flex justify-between text-xs">
                           <span className="text-slate-500 font-bold">Locked Liquidity</span>
                           <span className="text-slate-200 font-black">Unknown</span>
                        </div>
                    </div>
                </div>

                {/* Audit Flags */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                             <ShieldSearch className="w-4 h-4 text-purple-400" /> Automated Audit
                        </div>
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-500 uppercase">{profile.flags.length} Audit Points</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {profile.flags.map((f, i) => (
                            <div key={i} className={`group p-4 rounded-2xl border transition-all duration-200 ${f.passed ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30' : 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'}`}>
                                <div className="flex gap-4">
                                    <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${f.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {f.passed ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-black text-white mb-1 group-hover:translate-x-1 transition-transform">{f.name}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-8 pb-10">
                <Link href="/analysis/contract-analyzer" className="w-full md:w-auto px-8 py-4 bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl text-sm font-black text-white transition-all text-center">
                    New Scan
                </Link>
                {isSafe && marketData && (
                    <Link href={`/analysis/analyzer?q=${profile.address}`} className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-sm font-black text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all text-center">
                        Analyze Tokenomics <ArrowRight className="ml-2 w-4 h-4 inline" />
                    </Link>
                )}
            </div>

        </div>
    );
}

function ShieldSearch(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <circle cx="12" cy="12" r="3" />
            <path d="m16 16 2 2" />
        </svg>
    );
}
