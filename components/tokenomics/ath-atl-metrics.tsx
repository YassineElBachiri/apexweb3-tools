"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatUSD } from "@/lib/utils";

interface AthAtlMetricsProps {
    currentPrice: number;
    allTimeHigh?: number;
    allTimeLow?: number;
    athChangePercentage?: number;
    atlChangePercentage?: number;
    symbol: string;
}

export function AthAtlMetrics({ currentPrice, allTimeHigh, allTimeLow, athChangePercentage, atlChangePercentage, symbol }: AthAtlMetricsProps) {
    if (!allTimeHigh && !allTimeLow) {
        return null;
    }

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-background to-background/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">All-Time Highs & Lows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* ATH */}
                {allTimeHigh !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-success" />
                                All-Time High
                            </span>
                        </div>
                        <div className="text-xl font-bold text-success">
                            {formatUSD(allTimeHigh, currentPrice < 0.01 ? 6 : 2)}
                        </div>
                        {athChangePercentage !== undefined && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-background-card rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-success/30"
                                        style={{ width: `${Math.min(100, Math.abs(athChangePercentage))}%` }}
                                    />
                                </div>
                                <span className="text-xs text-danger font-medium">
                                    {athChangePercentage.toFixed(1)}%
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* ATL */}
                {allTimeLow !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <TrendingDown className="h-4 w-4 text-danger" />
                                All-Time Low
                            </span>
                        </div>
                        <div className="text-xl font-bold text-danger">
                            {formatUSD(allTimeLow, allTimeLow < 0.01 ? 6 : 2)}
                        </div>
                        {atlChangePercentage !== undefined && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-background-card rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-success"
                                        style={{ width: `${Math.min(100, atlChangePercentage / 10)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-success font-medium">
                                    +{atlChangePercentage.toFixed(1)}%
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
