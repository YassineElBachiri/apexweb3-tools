"use client";

import { useEffect, useState } from "react";
import { PortfolioAsset, InvestmentScore } from "@/types";
import { getTokenHistoricalData } from "@/lib/coingecko";
import { formatCurrency } from "@/lib/scoring";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react";

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

    return (
        <div className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-card rounded-xl p-6 glow-card gradient-border animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={asset.token.image || asset.token.logo || "https://placehold.co/64"}
                                alt={asset.token.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div>
                                <h3 className="text-2xl font-bold">{asset.token.name}</h3>
                                <p className="text-gray-400">
                                    {asset.token.symbol.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">
                                ${currentPrice.toFixed(2)}
                            </div>
                            <div
                                className={`text-lg font-semibold ${roi >= 0 ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {roi >= 0 ? (
                                    <TrendingUp className="inline mr-1" size={20} />
                                ) : (
                                    <TrendingDown className="inline mr-1" size={20} />
                                )}
                                {roi >= 0 ? "+" : ""}
                                {roi.toFixed(2)}% ROI
                            </div>
                        </div>
                    </div>

                    {/* Score Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Overall Score</div>
                            <div className="text-2xl font-bold text-primary">
                                {displayScore.totalScore}/100
                            </div>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Verdict</div>
                            <div className="text-lg font-semibold">{displayScore.verdict}</div>
                        </div>
                        {/* Risk Level Badge */}
                        <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Risk Verdict</div>
                            <div className={`text-lg font-semibold ${displayScore.verdict === 'Strong Hold' ? 'text-green-400' :
                                    displayScore.verdict === 'Speculative' ? 'text-yellow-400' :
                                        'text-red-400'
                                }`}>
                                {displayScore.verdict}
                            </div>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Market Cap</div>
                            <div className="text-lg font-semibold">
                                {asset.token.marketCap > 1_000_000_000 ? "Large Cap" : "Mid/Small Cap"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatCurrency(asset.token.market_cap || asset.token.marketCap)}
                            </div>
                        </div>
                    </div>

                    {/* Investment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-background rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Entry Price</div>
                            <div className="text-xl font-semibold">
                                ${asset.entryPrice.toFixed(2)}
                            </div>
                        </div>
                        {asset.investedAmount && (
                            <>
                                <div className="bg-background rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-1">
                                        Invested Amount
                                    </div>
                                    <div className="text-xl font-semibold">
                                        ${asset.investedAmount.toFixed(2)}
                                    </div>
                                </div>
                                <div className="bg-background rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-1">Profit/Loss</div>
                                    <div
                                        className={`text-xl font-semibold ${profitLoss && profitLoss >= 0
                                                ? "text-green-400"
                                                : "text-red-400"
                                            }`}
                                    >
                                        {profitLoss && (profitLoss >= 0 ? "+" : "")}
                                        {profitLoss && `$${profitLoss.toFixed(2)}`}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Price Chart */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-semibold">Price History</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDays(7)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${days === 7
                                            ? "bg-primary text-white"
                                            : "bg-background text-gray-400 hover:text-white"
                                        }`}
                                >
                                    7D
                                </button>
                                <button
                                    onClick={() => setDays(30)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${days === 30
                                            ? "bg-primary text-white"
                                            : "bg-background text-gray-400 hover:text-white"
                                        }`}
                                >
                                    30D
                                </button>
                                <button
                                    onClick={() => setDays(90)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${days === 90
                                            ? "bg-primary text-white"
                                            : "bg-background text-gray-400 hover:text-white"
                                        }`}
                                >
                                    90D
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-64 flex items-center justify-center bg-background rounded-lg">
                                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                            </div>
                        ) : (
                            <div className="bg-background rounded-lg p-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={historicalData}>
                                        <XAxis
                                            dataKey="date"
                                            stroke="#666"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1a0b2e",
                                                border: "1px solid #C77DFF",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#C77DFF"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Tokenomics Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-background rounded-lg p-4">
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Info size={20} className="text-primary" />
                                Tokenomics
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Circulating Supply:</span>
                                    <span className="font-medium">
                                        {(asset.token.circulating_supply || asset.token.circulatingSupply).toLocaleString()}
                                    </span>
                                </div>
                                {(asset.token.total_supply || asset.token.totalSupply) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Supply:</span>
                                        <span className="font-medium">
                                            {(asset.token.total_supply || asset.token.totalSupply).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {asset.token.max_supply > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Max Supply:</span>
                                        <span className="font-medium">
                                            {asset.token.max_supply.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-background rounded-lg p-4">
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                Market Data
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Market Cap Rank:</span>
                                    <span className="font-medium">
                                        #{asset.token.market_cap_rank || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">24h Volume:</span>
                                    <span className="font-medium">
                                        {formatCurrency(asset.token.total_volume || 0)}
                                    </span>
                                </div>
                                {asset.token.ath && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">All-Time High:</span>
                                        <span className="font-medium">
                                            ${asset.token.ath.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="bg-background rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-semibold mb-3">Score Breakdown</h4>
                        <div className="space-y-3">
                            {[
                                { label: "Market Cap Maturity", score: displayScore.marketCapMaturity, max: 25 },
                                { label: "Tokenomics Health", score: displayScore.tokenomicsHealth, max: 25 },
                                { label: "Volatility", score: displayScore.volatilityScore, max: 20 },
                                { label: "Price Performance", score: displayScore.pricePerformance, max: 20 },
                                { label: "Trend/Momentum", score: displayScore.trendMomentum, max: 10 },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">{item.label}</span>
                                        <span className="font-medium">{item.score}/{item.max}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-primary rounded-full h-2 transition-all duration-500"
                                            style={{ width: `${(item.score / item.max) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle
                                className="text-red-400 flex-shrink-0 mt-1"
                                size={20}
                            />
                            <div>
                                <h4 className="font-semibold text-red-400 mb-1">Disclaimer</h4>
                                <p className="text-xs text-gray-400">
                                    This analysis is for educational purposes only and is NOT
                                    financial advice. Always do your own research.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
