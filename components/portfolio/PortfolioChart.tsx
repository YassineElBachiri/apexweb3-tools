"use client";

import { PortfolioAsset } from "@/types";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/scoring";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PortfolioChartProps {
    assets: PortfolioAsset[];
}

const COLORS = [
    '#3b82f6', // bright blue
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#f59e0b', // amber
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f43f5e', // rose
    '#6366f1', // indigo
];

export function PortfolioChart({ assets }: PortfolioChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (assets.length === 0) return null;

    // Prepare data
    const totalValue = assets.reduce((sum, asset) => {
        const price = asset.token.current_price || asset.token.price || 0;
        const quantity = (asset.quantity) || (asset.investedAmount && asset.entryPrice ? asset.investedAmount / asset.entryPrice : 0);
        return sum + (price * quantity);
    }, 0);

    const data = assets.map(asset => {
        const price = asset.token.current_price || asset.token.price || 0;
        const quantity = (asset.quantity) || (asset.investedAmount && asset.entryPrice ? asset.investedAmount / asset.entryPrice : 0);
        const value = price * quantity;
        const allocation = totalValue > 0 ? (value / totalValue) * 100 : 0;

        return {
            name: asset.token.symbol.toUpperCase(),
            fullName: asset.token.name,
            value: value,
            allocation: allocation
        };
    }).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

    // If no valid value data, show empty state or hide
    if (data.length === 0) return null;

    const onPieEnter = (_: unknown, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            {/* Chart Area */}
            <div className="h-[300px] w-full md:w-1/2 min-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className={cn(
                                        "transition-all duration-300 outline-none",
                                        activeIndex === index ? "opacity-100 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "opacity-80"
                                    )}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => [`${formatCurrency(Number(value))}`, "Value"]}
                            contentStyle={{
                                backgroundColor: "rgba(20, 20, 25, 0.9)",
                                borderColor: "rgba(255,255,255,0.1)",
                                color: "#fff",
                                borderRadius: "8px",
                                backdropFilter: "blur(4px)"
                            }}
                            itemStyle={{ color: "#fff" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend / Details Area */}
            <div className="w-full md:w-1/2 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {data.map((entry, index) => (
                    <div
                        key={entry.name}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                            activeIndex === index
                                ? "bg-white/10 border-white/20 scale-[1.02]"
                                : "bg-black/20 border-white/5 hover:bg-white/5"
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-10 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div>
                                <div className="font-bold text-base flex items-center gap-2">
                                    {entry.name}
                                    <span className="text-xs font-normal text-muted-foreground hidden sm:inline-block">
                                        ({entry.fullName})
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {entry.allocation.toFixed(1)}% Allocation
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono font-medium text-lg">
                                {formatCurrency(entry.value)}
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-24 h-1.5 bg-black/40 rounded-full mt-1.5 ml-auto overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${entry.allocation}%`,
                                        backgroundColor: COLORS[index % COLORS.length]
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
