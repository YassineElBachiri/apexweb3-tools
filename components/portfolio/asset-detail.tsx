"use client";

import { useEffect, useState } from "react";
import { PortfolioAsset, InvestmentScore } from "@/types";
import { getTokenHistoricalData } from "@/lib/coingecko";
import { formatCurrency } from "@/lib/scoring";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, Info, Activity, BarChart3, Clock, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetDetailProps {
    asset: PortfolioAsset;
    score?: InvestmentScore;
}

export default function AssetDetail({ asset, score }: AssetDetailProps) {
    const [historicalData, setHistoricalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // Fallback for ID if missing (e.g. from generic mock)
            const tokenId = asset.token.id || asset.token.name.toLowerCase();
            const data = await getTokenHistoricalData(tokenId, days);
            const formatted = data.map(([timestamp, price]) => ({
                date: new Date(timestamp).toLocaleDateString(),
                price: price,
            }));
            setHistoricalData(formatted);
            setLoading(false);
        }
        fetchData();
    }, [asset.token.id, asset.token.name, days]);

    const currentPrice = asset.token.current_price || asset.token.price;
    const roi = ((currentPrice - asset.entryPrice) / asset.entryPrice) * 100;
    const profitLoss = asset.investedAmount
        ? (currentPrice - asset.entryPrice) *
        (asset.investedAmount / asset.entryPrice)
        : null;

    // Mock score if missing
    const displayScore = score || {
        totalScore: 75,
        verdict: "Speculative",
        riskLevel: "Medium",
        marketCapMaturity: 15,
        tokenomicsHealth: 18,
        volatilityScore: 12,
        pricePerformance: 15,
        trendMomentum: 8
    };

    const periodOptions = [
        { label: "7D", value: 7 },
        { label: "30D", value: 30 },
        { label: "90D", value: 90 },
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-background/50 to-background/80">
            {/* Top Grid: Main Info & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Left Column: Asset Identity & Key Metrics */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={asset.token.image || asset.token.logo || "https://placehold.co/64"}
                            alt={asset.token.name}
                            className="w-20 h-20 rounded-full border-4 border-white/5 shadow-lg"
                        />
                        <div>
                            <h3 className="text-3xl font-black tracking-tight">{asset.token.name}</h3>
                            <p className="text-muted-foreground font-mono text-lg">
                                {asset.token.symbol.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="bg-black/20 rounded-xl p-5 border border-white/5 space-y-4">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                            <div className="text-3xl font-bold font-mono tracking-tight text-white">
                                ${currentPrice.toFixed(2)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Return (ROI)</div>
                                <div className={cn("text-lg font-bold flex items-center", roi >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                    {roi >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                    {roi.toFixed(2)}%
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">24h Change</div>
                                <div className={cn("text-lg font-bold", (asset.token.priceChange24h || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                    {(asset.token.priceChange24h || 0) >= 0 ? "+" : ""}{(asset.token.priceChange24h || 0).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scores Mini Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                            <div className="text-sm text-primary/80 font-medium mb-1">Apex Score</div>
                            <div className="text-3xl font-black text-primary">
                                {displayScore.totalScore}
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                            <div className="text-xs text-muted-foreground mb-1">Risk Verdict</div>
                            <div className={cn("font-bold text-lg",
                                displayScore.verdict === 'Strong Hold' ? 'text-emerald-400' :
                                    displayScore.verdict === 'Speculative' ? 'text-amber-400' :
                                        'text-rose-400'
                            )}>
                                {displayScore.verdict}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Chart (Span 2) */}
                <div className="lg:col-span-2 flex flex-col h-full bg-black/20 rounded-xl border border-white/5 p-1 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                        <h4 className="font-medium flex items-center gap-2 text-foreground/80">
                            <BarChart3 className="w-4 h-4" />
                            Price History
                        </h4>
                        <div className="flex bg-black/40 rounded-lg p-1">
                            {periodOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setDays(opt.value)}
                                    className={cn(
                                        "px-3 py-1 rounded-md text-xs font-medium transition-all duration-300",
                                        days === opt.value
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[300px] p-4 relative">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full opacity-50"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historicalData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#525252"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="#525252"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `$${val.toLocaleString()}`}
                                        width={60}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgba(20, 20, 25, 0.9)",
                                            borderColor: "rgba(255,255,255,0.1)",
                                            borderRadius: "8px",
                                            backdropFilter: "blur(4px)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                                        }}
                                        itemStyle={{ color: "#a78bfa" }}
                                        labelStyle={{ color: "#a3a3a3", marginBottom: "4px" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Detailed Stats & Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Investment Stats */}
                <div className="bg-card/30 border border-white/5 rounded-xl p-5 hover:bg-card/40 transition-colors">
                    <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">Your Position</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-muted-foreground">Entry Price</span>
                            <span className="font-mono">${asset.entryPrice.toFixed(2)}</span>
                        </div>
                        {asset.investedAmount && (
                            <>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-muted-foreground">Invested</span>
                                    <span className="font-mono text-white">{formatCurrency(asset.investedAmount)}</span>
                                </div>
                                <div className="pt-3 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-muted-foreground">Profit / Loss</span>
                                        <span className={cn("text-sm font-bold", (profitLoss || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                            {(profitLoss || 0) >= 0 ? "+" : ""}{formatCurrency(Math.abs(profitLoss || 0))}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Tokenomics */}
                <div className="bg-card/30 border border-white/5 rounded-xl p-5 hover:bg-card/40 transition-colors">
                    <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                        <Info className="w-4 h-4" />
                        <span className="text-sm font-medium">Tokenomics</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Circulating</span>
                            <span className="font-mono text-xs">{(asset.token.circulating_supply || asset.token.circulatingSupply || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Supply</span>
                            <span className="font-mono text-xs">{(asset.token.total_supply || asset.token.totalSupply || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Max Supply</span>
                            <span className="font-mono text-xs">
                                {(asset.token.max_supply) ? asset.token.max_supply.toLocaleString() : "∞"}
                            </span>
                        </div>
                        <div className="pt-2">
                            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full rounded-full"
                                    style={{
                                        width: `${Math.min(100, ((asset.token.circulating_supply || 0) / (asset.token.total_supply || asset.token.circulating_supply || 1)) * 100)}%`
                                    }}
                                />
                            </div>
                            <div className="text-[10px] text-center mt-1 text-muted-foreground">Supply Progress</div>
                        </div>
                    </div>
                </div>

                {/* Market Data */}
                <div className="bg-card/30 border border-white/5 rounded-xl p-5 hover:bg-card/40 transition-colors">
                    <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-medium">Market Data</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Rank</span>
                            <span className="badge badge-outline text-xs border-white/20 px-2 py-0.5 rounded">#{asset.token.market_cap_rank || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Market Cap</span>
                            <span className="font-mono text-sm">{formatCurrency(asset.token.market_cap || asset.token.marketCap)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">24h Vol</span>
                            <span className="font-mono text-sm text-muted-foreground">{formatCurrency(asset.token.total_volume || 0)}</span>
                        </div>
                        {asset.token.ath && (
                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                <span className="text-xs text-muted-foreground">ATH</span>
                                <span className="font-mono text-xs">${asset.token.ath.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Algorithmic Score Breakdown */}
                <div className="bg-card/30 border border-white/5 rounded-xl p-5 hover:bg-card/40 transition-colors">
                    <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Analysis Breakdown</span>
                    </div>
                    <div className="space-y-2.5">
                        {[
                            { label: "Maturity", score: displayScore.marketCapMaturity, max: 25 },
                            { label: "Tokenomics", score: displayScore.tokenomicsHealth, max: 25 },
                            { label: "Momentum", score: displayScore.trendMomentum, max: 10 },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider text-muted-foreground">
                                    <span>{item.label}</span>
                                    <span>{item.score}/{item.max}</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500",
                                            (item.score / item.max) > 0.7 ? "bg-emerald-500" :
                                                (item.score / item.max) > 0.4 ? "bg-blue-500" : "bg-rose-500"
                                        )}
                                        style={{ width: `${(item.score / item.max) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                <AlertCircle className="w-5 h-5 text-red-500/50 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-500/50 leading-relaxed">
                    This automated analysis uses on-chain data and market metrics to generate a risk assessment.
                    It is for educational purposes only and does not constitute financial advice.
                    Crypto assets are highly volatile.
                </p>
            </div>
        </div>
    );
}
