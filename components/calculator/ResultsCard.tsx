"use client";

import { CalculationResult, PnLResult } from '@/lib/types/calculator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ResultsCardProps {
    calculation: CalculationResult;
    pnl: PnLResult;
    currentPrice: number;
}

export function ResultsCard({ calculation, pnl, currentPrice }: ResultsCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1a0b2e] to-[#0a0118] border border-[#C77DFF]/20 rounded-xl p-6 shadow-xl relative overflow-hidden"
        >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C77DFF]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#2a1b4e] pb-4">
                AVERAGE COST ANALYSIS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Column: Investment Stats */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Average Buy Price</span>
                        <span className="text-xl font-bold text-[#C77DFF]">
                            {formatCurrency(calculation.avgPrice)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Quantity</span>
                        <span className="text-white font-mono">
                            {calculation.totalQuantity}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Invested</span>
                        <span className="text-white">
                            {formatCurrency(calculation.totalCost)}
                        </span>
                    </div>
                </div>

                {/* Right Column: Market Stats */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Price</span>
                        <span className="text-white">
                            {formatCurrency(currentPrice)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Value</span>
                        <span className="text-[#00D4FF] font-bold">
                            {formatCurrency(pnl.currentValue)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Profit / Loss</span>
                        <div className={cn(
                            "text-right font-bold flex flex-col items-end",
                            pnl.isProfit ? "text-[#00FF94]" : "text-[#FF3B30]"
                        )}>
                            <span>
                                {pnl.isProfit ? '+' : ''}{formatCurrency(pnl.profitLoss)}
                            </span>
                            <span className="text-sm opacity-80">
                                ({pnl.isProfit ? '+' : ''}{pnl.profitLossPercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Break Even & Risk */}
            <div className="mt-8 pt-6 border-t border-[#2a1b4e] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#13082a] p-4 rounded-lg flex justify-between items-center border border-[#2a1b4e]">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Break-Even Price</span>
                        <span className="text-lg font-bold text-white">{formatCurrency(calculation.breakEven)}</span>
                    </div>
                    <div className="text-xs text-gray-400 max-w-[120px] text-right">
                        Price needed to recover initial investment
                    </div>
                </div>

                <div className="bg-[#13082a] p-4 rounded-lg flex justify-between items-center border border-[#2a1b4e]">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Max Risk</span>
                        <span className="text-lg font-bold text-[#FF3B30]">{formatCurrency(calculation.totalCost)}</span>
                    </div>
                    <div className="text-xs text-gray-400 max-w-[120px] text-right">
                        Potential loss if price drops to $0
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
