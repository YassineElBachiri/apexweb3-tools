"use client";

import { RiskCard } from "@/components/tokenomics/risk-card";
import { PriceChart } from "@/components/tokenomics/price-chart";
import { formatUSD, formatNumber } from "@/lib/utils";
import {
    TrendingUp, TrendingDown, DollarSign, Coins, PieChart,
    Share2, Copy, Twitter, ExternalLink, Droplet,
    Users, Award, Flame, BarChart3
} from "lucide-react";
import { useState } from "react";
import type { TokenomicsAnalysis } from "@/types";

interface TokenomicsViewProps {
    data: TokenomicsAnalysis;
    address: string;
    hideAddress?: boolean;
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
    icon, label, value, sub, subColor = "text-muted-foreground", accent = "cyan"
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
    subColor?: string;
    accent?: "cyan" | "purple" | "blue" | "emerald" | "amber";
}) {
    const accentMap = {
        cyan: "border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/10",
        purple: "border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10",
        blue: "border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10",
        emerald: "border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10",
        amber: "border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/10",
    };
    const iconBgMap = {
        cyan: "text-cyan-400 bg-cyan-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        amber: "text-amber-400 bg-amber-500/10",
    };

    return (
        <div className={`relative p-5 rounded-2xl bg-slate-900/60 border backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-200 hover:shadow-lg ${accentMap[accent]}`}>
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl mb-3 ${iconBgMap[accent]}`}>
                {icon}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-black text-white leading-tight">{value}</p>
            {sub && <p className={`text-xs mt-1.5 ${subColor}`}>{sub}</p>}
        </div>
    );
}

// ─── Progress row ───────────────────────────────────────────────────────────────
function ProgressRow({ label, pct, color, value }: { label: string; pct: number; color: string; value: string }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5 text-sm">
                <span className="font-medium text-slate-300">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{value}</span>
                    <span className="text-xs text-slate-500">{pct.toFixed(1)}%</span>
                </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export function TokenomicsView({ data, address, hideAddress = false }: TokenomicsViewProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `$${data.token.symbol} Tokenomics on ApexWeb3 — Score: ${data.investmentScore?.totalScore || 0}/100\n${shareUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const circPct = (data.token.circulatingSupply / data.token.totalSupply) * 100;
    const lockedPct = (data.supplyDistribution.locked / data.token.totalSupply) * 100;
    const unvestedPct = (data.supplyDistribution.unvested / data.token.totalSupply) * 100;

    const volumeToMcap = data.volume24h && data.token.marketCap
        ? (data.volume24h / data.token.marketCap) * 100 : 0;

    const liquidityScore = data.liquidityScore ?? 0;
    const liqLabel = liquidityScore >= 70 ? "High" : liquidityScore >= 40 ? "Medium" : "Low";
    const liqColor = liquidityScore >= 70 ? "text-emerald-400" : liquidityScore >= 40 ? "text-amber-400" : "text-rose-400";
    const liqBar = liquidityScore >= 70 ? "bg-emerald-500" : liquidityScore >= 40 ? "bg-amber-500" : "bg-rose-500";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Token Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    {data.token.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={data.token.logo}
                            alt={data.token.name}
                            className="w-14 h-14 rounded-2xl ring-2 ring-white/10 shadow-lg flex-shrink-0"
                            onError={(e) => {
                                const t = e.target as HTMLImageElement;
                                t.onerror = null;
                                t.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2306b6d4'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3E${data.token.symbol?.charAt(0) || '?'}%3C/text%3E%3C/svg%3E`;
                            }}
                        />
                    )}
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-2xl md:text-3xl font-black text-white">{data.token.name}</h2>
                            <span className="text-sm font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                                {data.token.symbol}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">Comprehensive tokenomics · powered by real-time data</p>
                        {!hideAddress && (
                            <p className="text-xs text-slate-600 font-mono mt-1 truncate max-w-xs">{address}</p>
                        )}
                        {/* Quick actions */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <a
                                href={`/finance/converter?token=${data.token.symbol}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all"
                            >
                                <DollarSign className="w-3.5 h-3.5" /> Swap Token
                            </a>
                            <a
                                href={`/analysis/contract-analyzer?address=${address}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all"
                            >
                                <BarChart3 className="w-3.5 h-3.5" /> Security Scan
                            </a>
                        </div>
                    </div>
                </div>

                {/* Share dropdown */}
                <div className="relative group flex-shrink-0">
                    <button className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all">
                        <Share2 className="w-4 h-4" /> Share Result
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl shadow-xl z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 overflow-hidden">
                        <button onClick={handleCopy} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy Link"}
                        </button>
                        <div className="mx-3 h-px bg-slate-800" />
                        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Twitter className="w-3.5 h-3.5" /> Share on X
                        </button>
                        <div className="mx-3 h-px bg-slate-800" />
                        <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> Telegram
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Key Stats Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    icon={<DollarSign className="w-4 h-4" />}
                    label="Price"
                    accent="cyan"
                    value={formatUSD(data.token.price, data.token.price < 0.01 ? 6 : 2)}
                    sub={data.token.priceChange24h !== undefined ? `${data.token.priceChange24h > 0 ? "↗ +" : "↘ "}${data.token.priceChange24h.toFixed(2)}% (24h)` : undefined}
                    subColor={data.token.priceChange24h !== undefined && data.token.priceChange24h >= 0 ? "text-emerald-400" : "text-rose-400"}
                />
                <StatCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Market Cap"
                    accent="blue"
                    value={formatUSD(data.token.marketCap, 0)}
                    sub={`FDV ${data.fdvToMarketCapRatio.toFixed(2)}× market cap`}
                />
                <StatCard
                    icon={<PieChart className="w-4 h-4" />}
                    label="FDV"
                    accent="purple"
                    value={formatUSD(data.token.fdv, 0)}
                    sub={`${data.fdvToMarketCapRatio.toFixed(2)}× Market Cap`}
                />
                <StatCard
                    icon={<Coins className="w-4 h-4" />}
                    label="Circulating"
                    accent="emerald"
                    value={formatNumber(data.token.circulatingSupply, 0)}
                    sub={`${circPct.toFixed(1)}% of total supply`}
                />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <PriceChart
                    priceHistory={data.priceHistory}
                    currentPrice={data.token.price}
                    priceChange7d={data.priceChange7d}
                    priceChange30d={data.priceChange30d}
                    symbol={data.token.symbol}
                />

                {/* Volume & Liquidity */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm space-y-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                        <Droplet className="w-4 h-4 text-cyan-400" />
                        Volume &amp; Liquidity
                    </div>
                    {data.volume24h !== undefined && (
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-500">24h Volume</span>
                                {data.volumeChange24h !== undefined && (
                                    <span className={`text-xs font-bold flex items-center gap-1 ${data.volumeChange24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                        {data.volumeChange24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {data.volumeChange24h > 0 ? "+" : ""}{data.volumeChange24h.toFixed(1)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-black text-white">{formatUSD(data.volume24h, 0)}</p>
                            <p className="text-xs text-slate-500 mt-1">{volumeToMcap.toFixed(2)}% of market cap</p>
                        </div>
                    )}
                    {liquidityScore > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-slate-500">Liquidity</span>
                                <span className={`text-xs font-black ${liqColor}`}>{liqLabel}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-700 ${liqBar}`} style={{ width: `${Math.min(100, liquidityScore)}%` }} />
                            </div>
                            <p className="text-xs text-slate-600 mt-1">Score: {liquidityScore.toFixed(0)}/100</p>
                        </div>
                    )}
                </div>

                {/* ATH / ATL */}
                {(data.allTimeHigh || data.allTimeLow) && (
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm space-y-5">
                        <div className="text-sm font-semibold text-slate-300">All-Time Highs &amp; Lows</div>
                        {data.allTimeHigh && (
                            <div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> All-Time High
                                </div>
                                <p className="text-xl font-black text-emerald-400">{formatUSD(data.allTimeHigh, data.token.price < 0.01 ? 6 : 2)}</p>
                                {data.athChangePercentage !== undefined && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500/30 rounded-full" style={{ width: `${Math.min(100, Math.abs(data.athChangePercentage))}%` }} />
                                        </div>
                                        <span className="text-xs text-rose-400 font-semibold">{data.athChangePercentage.toFixed(1)}%</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {data.allTimeLow && (
                            <div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> All-Time Low
                                </div>
                                <p className="text-xl font-black text-rose-400">{formatUSD(data.allTimeLow, data.allTimeLow < 0.01 ? 6 : 2)}</p>
                                {data.atlChangePercentage !== undefined && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, data.atlChangePercentage / 10)}%` }} />
                                        </div>
                                        <span className="text-xs text-emerald-400 font-semibold">+{data.atlChangePercentage.toFixed(1)}%</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Risk + Supply ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <RiskCard
                        tokenSymbol={data.token.symbol}
                        tokenName={data.token.name}
                        inflationRisk={data.inflationRisk}
                        sustainabilityScore={data.sustainabilityScore}
                        riskLevel={data.riskLevel}
                    />
                </div>

                {/* Supply Distribution */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                        <PieChart className="w-4 h-4 text-purple-400" />
                        Supply Distribution
                    </div>
                    <ProgressRow
                        label="Circulating"
                        pct={circPct}
                        color="bg-gradient-to-r from-emerald-500 to-emerald-400"
                        value={formatNumber(data.token.circulatingSupply, 0)}
                    />
                    <ProgressRow
                        label="Locked"
                        pct={lockedPct}
                        color="bg-gradient-to-r from-amber-500 to-amber-400"
                        value={formatNumber(data.supplyDistribution.locked, 0)}
                    />
                    <ProgressRow
                        label="Unvested"
                        pct={unvestedPct}
                        color="bg-gradient-to-r from-rose-500 to-rose-400"
                        value={formatNumber(data.supplyDistribution.unvested, 0)}
                    />
                </div>
            </div>

            {/* ── Advanced Metrics ── */}
            {(data.holderCount || (data.burnRate && data.burnRate > 0) || data.stakingAPY) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.holderCount && (
                        <StatCard
                            icon={<Users className="w-4 h-4" />}
                            label="Holders"
                            accent="blue"
                            value={formatNumber(data.holderCount, 0)}
                            sub={data.topHoldersConcentration ? `Top 10: ${data.topHoldersConcentration.toFixed(1)}%` : undefined}
                        />
                    )}
                    {data.burnRate && data.burnRate > 0 && (
                        <StatCard
                            icon={<Flame className="w-4 h-4" />}
                            label="Burn Rate"
                            accent="amber"
                            value={`${data.burnRate.toFixed(2)}%`}
                            sub="Annual deflation"
                        />
                    )}
                    {data.stakingAPY && (
                        <StatCard
                            icon={<Award className="w-4 h-4" />}
                            label="Staking APY"
                            accent="emerald"
                            value={`${data.stakingAPY.toFixed(1)}%`}
                            sub="Annual yield"
                        />
                    )}
                </div>
            )}
        </div>
    );
}
