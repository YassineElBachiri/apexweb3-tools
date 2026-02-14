"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Droplet } from "lucide-react";
import { formatUSD } from "@/lib/utils";

interface VolumeMetricsProps {
    volume24h?: number;
    volumeChange24h?: number;
    liquidityScore?: number;
    marketCap: number;
}

export function VolumeMetrics({ volume24h, volumeChange24h, liquidityScore, marketCap }: VolumeMetricsProps) {
    if (!volume24h && !liquidityScore) {
        return null;
    }

    const volumeToMcapRatio = volume24h && marketCap ? (volume24h / marketCap) * 100 : 0;

    // Determine liquidity rating
    let liquidityRating = "Low";
    let liquidityColor = "text-danger";
    if (liquidityScore) {
        if (liquidityScore >= 70) {
            liquidityRating = "High";
            liquidityColor = "text-success";
        } else if (liquidityScore >= 40) {
            liquidityRating = "Medium";
            liquidityColor = "text-warning";
        }
    }

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-background to-background/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-primary" />
                    Volume & Liquidity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 24h Volume */}
                {volume24h !== undefined && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">24h Volume</span>
                            {volumeChange24h !== undefined && (
                                <span className={`text-xs flex items-center gap-1 ${volumeChange24h >= 0 ? 'text-success' : 'text-danger'}`}>
                                    <TrendingUp className={`h-3 w-3 ${volumeChange24h < 0 ? 'rotate-180' : ''}`} />
                                    {volumeChange24h > 0 ? '+' : ''}{volumeChange24h.toFixed(1)}%
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-bold">{formatUSD(volume24h, 0)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {volumeToMcapRatio.toFixed(2)}% of market cap
                        </div>
                    </div>
                )}

                {/* Liquidity Score */}
                {liquidityScore !== undefined && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Liquidity</span>
                            <span className={`text-xs font-bold ${liquidityColor}`}>
                                {liquidityRating}
                            </span>
                        </div>
                        <div className="h-2 bg-background-card rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${liquidityScore >= 70 ? 'bg-success' :
                                        liquidityScore >= 40 ? 'bg-warning' : 'bg-danger'
                                    }`}
                                style={{ width: `${Math.min(100, liquidityScore)}%` }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Score: {liquidityScore.toFixed(0)}/100
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
