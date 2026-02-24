"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/salary-calculator";

interface ProjectionChartProps {
    data: {
        year: string;
        fiat: number;
        crypto: number;
    }[];
}

export function ProjectionChart({ data }: ProjectionChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-[350px] mt-8 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                5-Year Wealth Projection
            </h3>

            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorFiat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                        dataKey="year"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #ffffff10',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}
                        formatter={(value: any) => [formatCurrency(Number(value)), ''] as [string, string]}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                        name="Fiat Savings (0% Growth)"
                        type="monotone"
                        dataKey="fiat"
                        stroke="#94a3b8"
                        fillOpacity={1}
                        fill="url(#colorFiat)"
                    />
                    <Area
                        name="Crypto Strategy (Proj. CAGR + Yield)"
                        type="monotone"
                        dataKey="crypto"
                        stroke="#a855f7"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCrypto)"
                    />
                </AreaChart>
            </ResponsiveContainer>

            <p className="text-[10px] text-gray-500 mt-4 text-center italic">
                *Projections based on historical 25% CAGR and selected staking yields. Past performance does not guarantee future results.
            </p>
        </div>
    );
}
