"use client";

import { PortfolioAsset } from "@/types";
import { formatCurrency } from "@/lib/scoring";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortfolioSummaryProps {
    assets: PortfolioAsset[];
}

export function PortfolioSummary({ assets }: PortfolioSummaryProps) {
    if (assets.length === 0) return null;

    // Calculations
    const totalValue = assets.reduce((sum, asset) => {
        const price = asset.token.current_price || asset.token.price || 0;

        let quantity = asset.quantity || 0;

        // Backward compatibility: If no quantity but investedAmount exists
        if (!quantity && asset.investedAmount && asset.entryPrice) {
            quantity = asset.investedAmount / asset.entryPrice;
        }

        return sum + (price * quantity);
    }, 0);

    const totalInvested = assets.reduce((sum, asset) => {
        const qty = asset.quantity || (asset.investedAmount && asset.entryPrice ? asset.investedAmount / asset.entryPrice : 0);
        return sum + (asset.entryPrice * qty);
    }, 0);
    const totalPnL = totalValue - totalInvested;
    const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    // Find Best Performer
    let bestAsset = null;
    let maxRoi = -Infinity;

    assets.forEach(asset => {
        const currentPrice = asset.token.current_price || asset.token.price || 0;
        const entryPrice = asset.entryPrice || 1; // Avoid division by zero
        const roi = ((currentPrice - entryPrice) / entryPrice) * 100;

        if (roi > maxRoi) {
            maxRoi = roi;
            bestAsset = asset;
        }
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Balance Card */}
            <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Balance
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Invested: {formatCurrency(totalInvested)}
                    </p>
                </CardContent>
            </Card>

            {/* P&L Card */}
            <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total P&L
                    </CardTitle>
                    {totalPnL >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {totalPnL >= 0 ? "+" : ""}{formatCurrency(totalPnL)}
                    </div>
                    <p className={`text-xs mt-1 ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {totalPnL >= 0 ? "+" : ""}{pnlPercentage.toFixed(2)}% All Time
                    </p>
                </CardContent>
            </Card>

            {/* Best Performer Card */}
            <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Top Performer
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    {bestAsset ? (
                        <>
                            <div className="text-xl font-bold truncate">{(bestAsset as PortfolioAsset).token.name}</div>
                            <p className="text-xs text-green-400 mt-1">
                                +{maxRoi.toFixed(2)}% ROI
                            </p>
                        </>
                    ) : (
                        <div className="text-sm text-muted-foreground">No assets yet</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
