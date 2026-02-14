'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";
import { Coins } from "lucide-react";

interface HistoricalRateChartProps {
    fromCurrency: string;
    toCurrency: string;
    data?: any[]; // Allow passing real data later
}

// Mock data for now
const generateMockData = () => {
    const data = [];
    let base = 100;
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        base = base + (Math.random() - 0.5) * 10;
        data.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            rate: base
        });
    }
    return data;
};

export function HistoricalRateChart({ fromCurrency, toCurrency, data = generateMockData() }: HistoricalRateChartProps) {
    return (
        <div className="w-full h-[200px] mt-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium text-zinc-400">
                        {fromCurrency.toUpperCase()}/{toCurrency.toUpperCase()} • Last 7 Days
                    </h4>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#09090b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#00D4FF' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#00D4FF"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRate)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
