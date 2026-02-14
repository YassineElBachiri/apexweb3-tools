"use client";

import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { CalculationResult } from '@/lib/types/calculator';

interface PositionChartProps {
    calculation: CalculationResult;
    currentPrice: number;
}

export function PositionChart({ calculation, currentPrice }: PositionChartProps) {
    // Mock data for visualization - in a real app this would be historical price data
    // For now, we'll create a simple visualization relative to the avg price

    const generateChartData = () => {
        const avg = calculation.avgPrice;
        if (avg === 0) return [];

        const points = [];
        const range = Math.max(Math.abs(currentPrice - avg), avg * 0.2);
        // Create 3 points: lower bound, avg, upper bound/current
        const min = Math.min(avg, currentPrice) - range;
        const max = Math.max(avg, currentPrice) + range;

        points.push({ name: 'Low', price: min });
        points.push({ name: 'Avg', price: avg });
        points.push({ name: 'Current', price: currentPrice });

        // Add some fluctuation
        return [
            { name: 'Start', price: avg * 0.9 },
            { name: 'Buy 1', price: avg * 0.95 },
            { name: 'Buy 2', price: avg * 1.05 },
            { name: 'Avg', price: avg },
            { name: 'Current', price: currentPrice },
        ];
    };

    // We actually want to show the purchase history if available, but for now let's just show
    // where the current price is relative to the average price.
    // A better chart would be "Price History" with "My Buys" plotted on it. 
    // Since we don't have historical data API yet, let's make a simple visualizer.

    // Let's create a visual representation of "Distance to Break Even"
    const data = [
        { name: 'Entry', value: calculation.avgPrice },
        { name: 'Current', value: currentPrice },
    ];

    // Fix for Recharts hydration issue
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    if (!isMounted) return <div className="w-full h-[300px] bg-[#13082a] border border-[#2a1b4e] rounded-xl mt-6 animate-pulse" />;

    return (
        <div className="w-full h-[300px] bg-[#13082a] border border-[#2a1b4e] rounded-xl p-4 mt-6">
            <h3 className="text-gray-400 text-sm mb-4">Price Position Visualizer</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C77DFF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C77DFF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#525252" />
                    <YAxis stroke="#525252" domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1a0b2e', borderColor: '#2a1b4e', color: '#fff' }}
                    />
                    <ReferenceLine y={calculation.avgPrice} stroke="#00D4FF" label="Avg Price" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="value" stroke="#C77DFF" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
