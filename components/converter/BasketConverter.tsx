"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Save, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { POPULAR_COINS } from '@/lib/constants';
import { BasketItem } from '@/lib/types/converter';
import { FeePanel } from './FeePanel';
import { CoinSelect } from './CoinSelect';
import { useCoinsList } from '@/hooks/useCoinsList';

export function BasketConverter() {
    const { coins } = useCoinsList();
    
    const defaultBasket: BasketItem[] = [
        { id: '1', coinId: 'bitcoin', amount: 0.5 }
    ];

    const [basket, setBasket] = useState<BasketItem[]>([]);
    const [targetCoin, setTargetCoin] = useState('tether');
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('apex_converter_basket');
        if (saved) {
            try {
                setBasket(JSON.parse(saved));
            } catch (e) {
                setBasket(defaultBasket);
            }
        } else {
            setBasket(defaultBasket);
        }
    }, []);

    // Save functionality
    const saveBasket = () => {
        localStorage.setItem('apex_converter_basket', JSON.stringify(basket));
        // Simple visual feedback could go here
    };

    const addRow = () => {
        if (basket.length >= 8) return;
        setBasket([...basket, { id: Math.random().toString(), coinId: 'ethereum', amount: 1 }]);
    };

    const removeRow = (id: string) => {
        setBasket(basket.filter(b => b.id !== id));
    };

    const updateRow = (id: string, field: keyof BasketItem, value: any) => {
        setBasket(basket.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    // Fetch prices for all basket items + target coin
    useEffect(() => {
        const fetchPrices = async () => {
            const ids = new Set(basket.map(b => b.coinId));
            ids.add(targetCoin);
            const idString = Array.from(ids).join(',');
            
            if (!idString) return;

            try {
                const res = await fetch(`/api/crypto?action=live&ids=${idString}`);
                const data = await res.json();
                
                const newPrices: Record<string, number> = {};
                for (const id in data) {
                    newPrices[id] = data[id].usd;
                }
                setPrices(newPrices);
            } catch (error) {
                console.error("Failed to fetch prices for basket");
            }
        };

        const timeout = setTimeout(fetchPrices, 400); // debounce API
        return () => clearTimeout(timeout);
    }, [basket, targetCoin]);

    // Live Math
    const { totalUsd, targetCoinPrice, targetGrossAmount } = useMemo(() => {
        let total = 0;
        basket.forEach(item => {
            const price = prices[item.coinId] || 0;
            total += (item.amount * price);
        });

        const targetPrice = prices[targetCoin] || 1; // avoid division by zero
        const targetOutput = total / targetPrice;

        return {
            totalUsd: total,
            targetCoinPrice: targetPrice,
            targetGrossAmount: targetOutput
        };
    }, [basket, prices, targetCoin]);

    const targetSymbol = POPULAR_COINS.find(c => c.id === targetCoin)?.symbol || targetCoin;

    return (
        <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-inner space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-zinc-300">Your Crypto Basket</h3>
                    <Button variant="ghost" size="sm" onClick={saveBasket} className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10">
                        <Save className="h-3 w-3 mr-1" /> Save Portfolio
                    </Button>
                </div>
                
                <div className="space-y-3">
                    {basket.map((item, idx) => {
                        const usdVal = (item.amount * (prices[item.coinId] || 0));
                        return (
                            <div key={item.id} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        value={item.amount || ''}
                                        onChange={(e) => updateRow(item.id, 'amount', Number(e.target.value))}
                                        className="h-10 bg-zinc-900 border-zinc-800 font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex-[2] min-w-[120px]">
                                    <CoinSelect
                                        value={item.coinId}
                                        onChange={(newId) => updateRow(item.id, 'coinId', newId)}
                                    />
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-xs text-zinc-500 font-mono">${usdVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeRow(item.id)}
                                    className="h-10 w-10 text-zinc-600 hover:text-red-400 hover:bg-red-400/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addRow}
                        disabled={basket.length >= 8}
                        className="text-xs border-zinc-800 text-zinc-400 hover:text-white"
                    >
                        <Plus className="h-3 w-3 mr-1" /> Add Asset
                    </Button>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Total Basket Value</p>
                        <p className="text-xl font-bold text-white">${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-zinc-900 border border-zinc-700 p-2 rounded-full">
                    <ArrowDown className="h-5 w-5 text-zinc-400" />
                </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-zinc-300">Convert Basket To</h3>
                    <div className="w-48">
                        <CoinSelect
                            value={targetCoin}
                            onChange={(e) => setTargetCoin(e)}
                            className="w-full text-primary border-primary/50"
                        />
                    </div>
                </div>

                <div className="text-center py-4">
                    <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-2">Total Received</p>
                    <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-2">
                        {targetGrossAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </p>
                    <p className="text-lg font-medium text-primary">{coins.find(c => c.id === targetCoin)?.symbol.toUpperCase() || targetSymbol.toUpperCase()}</p>
                </div>

                {/* Secondary Individual Breakdown */}
                {basket.length > 0 && targetGrossAmount > 0 && (
                    <div className="mt-6 border-t border-zinc-800/50 pt-4 space-y-2">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">Individual Breakdown</p>
                        {basket.map(item => {
                            const sourcePrice = prices[item.coinId] || 0;
                            const individualTargetOutput = (item.amount * sourcePrice) / targetCoinPrice;
                            if (individualTargetOutput <= 0) return null;
                            const sSymbol = coins.find(c => c.id === item.coinId)?.symbol.toUpperCase() || POPULAR_COINS.find(c => c.id === item.coinId)?.symbol.toUpperCase() || item.coinId;

                            return (
                                <div key={`breakdown-${item.id}`} className="flex justify-between text-xs text-zinc-400">
                                    <span>Your {item.amount} {sSymbol}</span>
                                    <span>= {individualTargetOutput.toLocaleString(undefined, { maximumFractionDigits: 4 })} {coins.find(c => c.id === targetCoin)?.symbol.toUpperCase() || targetSymbol.toUpperCase()}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <FeePanel 
                grossAmount={targetGrossAmount} 
                usdValue={totalUsd} 
                targetCoinSymbol={targetSymbol}
            />
        </div>
    );
}
