"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, TrendingDown, Percent, DollarSign } from 'lucide-react';
import { FeeBreakdown } from '@/lib/types/converter';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const EXCHANGES = [
    { name: 'Binance', feePct: 0.1 },
    { name: 'Coinbase', feePct: 0.6 },
    { name: 'Kraken', feePct: 0.26 },
    { name: 'Bybit', feePct: 0.1 },
    { name: 'OKX', feePct: 0.1 }
];

interface FeePanelProps {
    grossAmount: number; // in target coin
    usdValue: number; // The gross value in USD
    targetCoinSymbol: string;
}

export function FeePanel({ grossAmount, usdValue, targetCoinSymbol }: FeePanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedExchange, setSelectedExchange] = useState('Binance');
    const [customFee, setCustomFee] = useState(0);
    const [networkFeeUsd, setNetworkFeeUsd] = useState(0); // Manual override, default 0

    useEffect(() => {
        const stored = localStorage.getItem('apex_fee_panel_open');
        if (stored === 'true') setIsOpen(true);
    }, []);

    const toggleOpen = () => {
        const next = !isOpen;
        setIsOpen(next);
        localStorage.setItem('apex_fee_panel_open', String(next));
    };

    // Calculate active fee
    const activeExchangeObj = EXCHANGES.find(e => e.name === selectedExchange);
    const activeFeePct = selectedExchange === 'Custom' ? customFee : (activeExchangeObj?.feePct || 0);

    // Calculate breakdowns
    const breakdown = useMemo<FeeBreakdown>(() => {
        const exchangeFeeUsd = usdValue * (activeFeePct / 100);
        const totalFeeUsd = exchangeFeeUsd + networkFeeUsd;
        return {
            exchangeName: selectedExchange,
            exchangeFeePct: activeFeePct,
            exchangeFeeUsd,
            networkFeeUsd,
            totalFeeUsd,
            grossAmount,
            netAmount: grossAmount - (grossAmount * (totalFeeUsd / usdValue) || 0)
        };
    }, [grossAmount, usdValue, selectedExchange, activeFeePct, networkFeeUsd]);

    // Find cheapest
    const cheapestExchange = useMemo(() => {
        return EXCHANGES.reduce((prev, curr) => (curr.feePct < prev.feePct ? curr : prev));
    }, []);

    return (
        <div className="mt-4 border border-zinc-800 rounded-xl bg-zinc-950/50 overflow-hidden">
            <button 
                onClick={toggleOpen}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-sm">Fee Reality Check</span>
                </div>
                <div className="flex items-center gap-3">
                    {!isOpen && breakdown.totalFeeUsd > 0 && (
                        <span className="text-xs text-red-400 font-medium">-{breakdown.totalFeeUsd.toFixed(2)} USD</span>
                    )}
                    {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                </div>
            </button>

            {isOpen && (
                <div className="p-4 border-t border-zinc-800 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-zinc-500 font-semibold mb-2 block">Exchange</label>
                            <select 
                                value={selectedExchange}
                                onChange={(e) => setSelectedExchange(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                {EXCHANGES.map(ex => (
                                    <option key={ex.name} value={ex.name}>{ex.name} ({ex.feePct}%)</option>
                                ))}
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                        {selectedExchange === 'Custom' && (
                            <div>
                                <label className="text-xs text-zinc-500 font-semibold mb-2 block flex items-center gap-1"><Percent className="h-3 w-3"/> Custom Fee %</label>
                                <Input 
                                    type="number" 
                                    value={customFee}
                                    onChange={(e) => setCustomFee(Number(e.target.value))}
                                    className="bg-zinc-900 border-zinc-800 h-10"
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-xs text-zinc-500 font-semibold mb-2 block flex items-center gap-1"><DollarSign className="h-3 w-3"/> Network Fee (USD)</label>
                            <Input 
                                type="number" 
                                value={networkFeeUsd || ''}
                                onChange={(e) => setNetworkFeeUsd(Number(e.target.value))}
                                placeholder="Auto (or override)"
                                className="bg-zinc-900 border-zinc-800 h-10"
                            />
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 rounded-lg p-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-zinc-500 mb-1">Gross Output</p>
                            <p className="font-medium text-zinc-300">{breakdown.grossAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {targetCoinSymbol.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-500 font-bold tracking-wider mb-1 uppercase">Actual You Receive</p>
                            <p className="text-xl font-bold text-white flex items-center justify-end gap-2">
                                {breakdown.netAmount > 0 ? breakdown.netAmount.toLocaleString(undefined, { maximumFractionDigits: 6 }) : 0} 
                                <span className="text-sm text-zinc-400 font-normal">{targetCoinSymbol.toUpperCase()}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs pt-1">
                        <span className="text-red-400 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3"/> Total Cost: ${breakdown.totalFeeUsd.toFixed(2)}
                            <span className="text-zinc-500 ml-1">(Exch: ${breakdown.exchangeFeeUsd.toFixed(2)} | Net: ${breakdown.networkFeeUsd.toFixed(2)})</span>
                        </span>
                        
                        {activeFeePct > cheapestExchange.feePct && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-medium tracking-wide">
                                💡 Tip: {cheapestExchange.name} is cheaper ({cheapestExchange.feePct}%)
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
