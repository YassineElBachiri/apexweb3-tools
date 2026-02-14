"use client";

import { PortfolioAsset, InvestmentScore, TokenHolding } from "@/types";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency, calculateVolatilityLevel } from "@/lib/scoring";

interface PortfolioTableProps {
    assets?: PortfolioAsset[];
    holdings?: TokenHolding[];
    scores?: Map<string, InvestmentScore>;
    onRemoveAsset?: (assetId: string) => void;
    onSelectAsset?: (assetId: string) => void;
    selectedAssetId?: string | null;
}

export function PortfolioTable({
    assets = [],
    holdings = [],
    scores = new Map(),
    onRemoveAsset = () => { },
    onSelectAsset = () => { },
    selectedAssetId = null,
}: PortfolioTableProps) {
    // Determine mode
    const isPersonal = assets.length > 0;
    const isPublic = holdings.length > 0;

    if (!isPersonal && !isPublic) {
        return null;
    }

    const getRiskBadgeColor = (riskLevel: string) => {
        switch (riskLevel) {
            case "Low": return "bg-green-500/20 text-green-400 border-green-500/50";
            case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
            case "High": return "bg-red-500/20 text-red-400 border-red-500/50";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
        }
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case "Strong Hold": return "text-green-400";
            case "Speculative": return "text-yellow-400";
            case "High Risk": return "text-orange-400";
            case "Overvalued": return "text-red-400";
            default: return "text-gray-400";
        }
    };

    // Helper to unify data access
    const tableData = isPersonal ? assets : holdings;

    return (
        <section className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700 bg-card/30">
                                <th className="text-left py-4 px-4 font-medium text-muted-foreground w-[300px]">Token</th>
                                {isPersonal && <th className="text-right py-4 px-4 font-medium text-muted-foreground">Entry Price</th>}
                                {isPublic && <th className="text-right py-4 px-4 font-medium text-muted-foreground">Balance</th>}
                                <th className="text-right py-4 px-4 font-medium text-muted-foreground">Current Price</th>
                                {isPersonal && <th className="text-right py-4 px-4 font-medium text-muted-foreground">ROI</th>}
                                {isPublic && <th className="text-right py-4 px-4 font-medium text-muted-foreground">Value</th>}
                                <th className="text-center py-4 px-4 font-medium text-muted-foreground">Risk Verdict</th>
                                {isPersonal && <th className="text-center py-4 px-4 font-medium text-muted-foreground">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item: any) => {
                                // Normalize fields
                                const isTokenObject = typeof item.token === 'object';
                                const id = isPersonal ? item.id : (isTokenObject ? item.token.symbol : item.token);
                                const tokenName = isTokenObject ? item.token.name : item.name;
                                const tokenSymbol = isTokenObject ? item.token.symbol : item.token;
                                const tokenImage = isTokenObject ? (item.token.image || item.token.logo) : item.logo;

                                const currentPrice = isPersonal
                                    ? (item.token?.current_price || item.token?.price || 0)
                                    : (item.price || 0);

                                const score = scores.get(id); // Only relevant for personal

                                // Personal Fields
                                const entryPrice = isPersonal ? item.entryPrice : 0;
                                const roi = (isPersonal && entryPrice > 0) ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;

                                // Public Fields
                                const balance = isPublic ? item.balance : 0;
                                const valueUsd = isPublic ? (item.value || item.valueUsd || 0) : 0;

                                const isExpanded = selectedAssetId === id;
                                const riskLevel = score?.verdict === 'Strong Hold' ? 'Low' :
                                    score?.verdict === 'Speculative' ? 'Medium' : 'High';

                                return (
                                    <tr
                                        key={id}
                                        className={`border-b border-gray-800 hover:bg-cardHover transition-colors cursor-pointer ${isExpanded ? "bg-cardHover" : ""}`}
                                        onClick={() => isPersonal && onSelectAsset(id)}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={tokenImage || "https://placehold.co/32"}
                                                    alt={tokenName || "Token"}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <div className="font-semibold">{tokenName || "Unknown"}</div>
                                                    <div className="text-sm text-gray-400">{(tokenSymbol || id).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {isPersonal && <td className="py-4 px-4 text-right">${entryPrice.toFixed(2)}</td>}

                                        {isPublic && (
                                            <td className="py-4 px-4 text-right">
                                                {balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                            </td>
                                        )}

                                        <td className="py-4 px-4 text-right">${formatCurrency(currentPrice)}</td>

                                        {isPersonal && (
                                            <td className={`py-4 px-4 text-right font-semibold ${roi >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
                                            </td>
                                        )}

                                        {isPublic && (
                                            <td className="py-4 px-4 text-right font-semibold">
                                                ${formatCurrency(valueUsd)}
                                            </td>
                                        )}

                                        <td className="py-4 px-4 text-center">
                                            {isPersonal && score ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getRiskBadgeColor(riskLevel)}`}>{riskLevel}</span>
                                                    <span className={`text-xs font-medium ${getVerdictColor(score.verdict)}`}>{score.verdict}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500">-</span>
                                            )}
                                        </td>

                                        {isPersonal && (
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveAsset(id);
                                                    }}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                    {tableData.map((item: any) => {
                        const isTokenObject = typeof item.token === 'object';
                        const id = isPersonal ? item.id : (isTokenObject ? item.token.symbol : item.token);
                        const tokenName = isTokenObject ? item.token.name : item.name;
                        const tokenSymbol = isTokenObject ? item.token.symbol : item.token;
                        const tokenImage = isTokenObject ? (item.token.image || item.token.logo) : item.logo;

                        const currentPrice = isPersonal
                            ? (item.token?.current_price || item.token?.price || 0)
                            : (item.price || 0);

                        // Public Fields
                        const valueUsd = isPublic ? (item.value || item.valueUsd || 0) : 0;

                        const score = scores.get(id);
                        const isExpanded = selectedAssetId === id;
                        const roi = (isPersonal && item.entryPrice > 0) ? ((currentPrice - item.entryPrice) / item.entryPrice) * 100 : 0;

                        return (
                            <div
                                key={id}
                                className={`p-4 rounded-lg border bg-card ${isExpanded ? "border-primary" : "border-border"} transition-all`}
                                onClick={() => isPersonal && onSelectAsset(id)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={tokenImage || "https://placehold.co/32"} alt={tokenName || "Token"} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-semibold">{tokenName || "Unknown"}</div>
                                            <div className="text-xs text-muted-foreground">{(tokenSymbol || id).toUpperCase()}</div>
                                        </div>
                                    </div>
                                    {isPersonal && (
                                        <button onClick={(e) => { e.stopPropagation(); onRemoveAsset(id); }} className="text-red-400">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">Price</div>
                                    <div className="text-right">${formatCurrency(currentPrice)}</div>

                                    {isPersonal && (
                                        <>
                                            <div className="text-muted-foreground">Entry</div>
                                            <div className="text-right">${item.entryPrice.toFixed(2)}</div>
                                            <div className="text-muted-foreground">ROI</div>
                                            <div className={`text-right font-semibold ${roi >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
                                            </div>
                                        </>
                                    )}

                                    {isPublic && (
                                        <>
                                            <div className="text-muted-foreground">Balance</div>
                                            <div className="text-right">{item.balance}</div>
                                            <div className="text-muted-foreground">Value</div>
                                            <div className="text-right font-bold">${formatCurrency(valueUsd)}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
