"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceChartProps {
    priceHistory?: Array<{ timestamp: number; price: number }>;
    currentPrice: number;
    priceChange7d?: number;
    priceChange30d?: number;
    symbol: string;
}

export function PriceChart({ priceHistory, currentPrice, priceChange7d, priceChange30d, symbol }: PriceChartProps) {
    if (!priceHistory || priceHistory.length === 0) {
        return null;
    }

    // Find min/max for scaling
    const prices = priceHistory.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // SVG dimensions
    const width = 300;
    const height = 80;
    const padding = 5;

    // Generate SVG path
    const points = priceHistory.map((point, index) => {
        const x = (index / (priceHistory.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
        return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    // Determine if price is up or down
    const isPositive = priceChange7d !== undefined ? priceChange7d >= 0 : false;
    const color = isPositive ? '#10b981' : '#ef4444'; // green or red

    return (
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-background to-background/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>7-Day Price Trend</span>
                    {priceChange7d !== undefined && (
                        <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {priceChange7d > 0 ? '+' : ''}{priceChange7d.toFixed(2)}%
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="relative">
                    <svg
                        width="100%"
                        height={height}
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="none"
                        className="w-full"
                    >
                        {/* Gradient fill */}
                        <defs>
                            <linearGradient id="priceGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={color} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Area under the line */}
                        <path
                            d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
                            fill="url(#priceGradient)"
                        />

                        {/* Line */}
                        <path
                            d={pathData}
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                    {priceChange30d !== undefined && (
                        <div>
                            <div className=" text-muted-foreground">30d Change</div>
                            <div className={`font-bold ${priceChange30d >= 0 ? 'text-success' : 'text-danger'}`}>
                                {priceChange30d > 0 ? '+' : ''}{priceChange30d.toFixed(2)}%
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="text-muted-foreground">Current</div>
                        <div className="font-bold">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
