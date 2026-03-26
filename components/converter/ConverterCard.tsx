"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CurrencyInput } from './CurrencyInput';
import { ExchangeRateDisplay } from './ExchangeRateDisplay';
import { POPULAR_COINS } from '@/lib/constants';
import { ArrowUpDown, RefreshCcw, LineChart, History, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FeePanel } from './FeePanel';
import { HistoricalConverter } from './HistoricalConverter';
import { BasketConverter } from './BasketConverter';
import { useCoinsList } from '@/hooks/useCoinsList';

export function ConverterCard() {
    const { coins } = useCoinsList();
    const [activeTab, setActiveTab] = useState<'standard' | 'historical' | 'basket'>('standard');

    // Standard Mode State
    const [fromCurrency, setFromCurrency] = useState('bitcoin');
    const [toCurrency, setToCurrency] = useState('ethereum');
    const [amount, setAmount] = useState(1);
    
    // Derived states
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [usdValue, setUsdValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const handleStandardConvert = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/crypto?action=live&ids=${fromCurrency},${toCurrency}`);
            const data = await res.json();
            
            const fromPrice = data[fromCurrency]?.usd || 0;
            const toPrice = data[toCurrency]?.usd || 0;
            
            if (fromPrice > 0 && toPrice > 0) {
                const totalUsd = amount * fromPrice;
                const finalAmount = totalUsd / toPrice;
                const rate = fromPrice / toPrice;
                
                setConvertedAmount(finalAmount);
                setExchangeRate(rate);
                setUsdValue(totalUsd);
                setLastUpdated(new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.error('Conversion failed', error);
        } finally {
            setLoading(false);
        }
    }, [fromCurrency, toCurrency, amount]);

    // Live auto-refresh for Standard mode
    useEffect(() => {
        if (activeTab === 'standard') {
            handleStandardConvert();
            const interval = setInterval(handleStandardConvert, 30000); // Auto-refresh every 30s as requested
            return () => clearInterval(interval);
        }
    }, [handleStandardConvert, activeTab]);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const targetSymbol = coins.find(c => c.id === toCurrency)?.symbol || POPULAR_COINS.find(c => c.id === toCurrency)?.symbol || toCurrency;

    return (
        <Card className="w-full bg-zinc-950 border-zinc-900 shadow-2xl shadow-primary/5">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Universal Converter
                    </CardTitle>
                    {activeTab === 'standard' && lastUpdated && (
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className={loading ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" : ""}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Updated {lastUpdated}
                        </div>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-zinc-900/50 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('standard')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${activeTab === 'standard' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <LineChart className="h-4 w-4" /> Live
                    </button>
                    <button 
                        onClick={() => setActiveTab('historical')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${activeTab === 'historical' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <History className="h-4 w-4" /> Historical
                    </button>
                    <button 
                        onClick={() => setActiveTab('basket')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${activeTab === 'basket' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Layers className="h-4 w-4" /> Basket
                    </button>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-2 transition-opacity duration-150">
                {/* Standard Mode */}
                {activeTab === 'standard' && (
                    <div className="animate-in fade-in duration-300 space-y-6">
                        <CurrencyInput
                            label="From"
                            amount={amount}
                            selectedCurrency={fromCurrency}
                            onAmountChange={setAmount}
                            onCurrencyChange={setFromCurrency}
                        />

                        <div className="relative flex justify-center -my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800"></div>
                            </div>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="relative z-10 h-10 w-10 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-primary transition-colors"
                                onClick={handleSwap}
                            >
                                <ArrowUpDown className="h-4 w-4 text-zinc-400 group-hover:text-primary" />
                            </Button>
                        </div>

                        <div>
                            <CurrencyInput
                                label="To (Gross)"
                                amount={convertedAmount}
                                selectedCurrency={toCurrency}
                                onAmountChange={() => { }} 
                                onCurrencyChange={setToCurrency}
                                readOnly={true}
                            />
                            
                            <div className="mt-2 text-center pb-2">
                                <ExchangeRateDisplay
                                    fromCurrency={coins.find(c => c.id === fromCurrency)?.symbol || POPULAR_COINS.find(c => c.id === fromCurrency)?.symbol || fromCurrency}
                                    toCurrency={coins.find(c => c.id === toCurrency)?.symbol || POPULAR_COINS.find(c => c.id === toCurrency)?.symbol || toCurrency}
                                    rate={exchangeRate}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        {/* Fee Panel Extrapolation */}
                        <FeePanel 
                            grossAmount={convertedAmount} 
                            usdValue={usdValue} 
                            targetCoinSymbol={targetSymbol} 
                        />
                    </div>
                )}

                {/* Historical Mode */}
                {activeTab === 'historical' && (
                    <div className="animate-in fade-in duration-300">
                        <HistoricalConverter />
                    </div>
                )}

                {/* Basket Mode */}
                {activeTab === 'basket' && (
                    <div className="animate-in fade-in duration-300">
                        <BasketConverter />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
