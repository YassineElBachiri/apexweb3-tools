"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Twitter, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { CurrencyInput } from './CurrencyInput';
import { POPULAR_COINS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCoinsList } from '@/hooks/useCoinsList';

export function HistoricalConverter() {
    const { coins } = useCoinsList();
    const [fromCurrency, setFromCurrency] = useState('bitcoin');
    const [toCurrency, setToCurrency] = useState('ethereum');
    const [amount, setAmount] = useState(1);
    
    // Initial date default: 30 days ago
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 30);
    const [selectedDate, setSelectedDate] = useState<string>(defaultDate.toISOString().split('T')[0]);
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Format YYYY-MM-DD back to DD-MM-YYYY for CoinGecko API
    const formatForAPI = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const fetchHistoricalDetails = async () => {
        setLoading(true);
        try {
            // Fetch live prices first for the "today" comparison
            const liveRes = await fetch(`/api/crypto?action=live&ids=${fromCurrency},${toCurrency}`);
            const liveData = await liveRes.json();
            const currentPriceFrom = liveData[fromCurrency]?.usd || 0;
            const currentPriceTo = liveData[toCurrency]?.usd || 0;

            // Fetch historical price for From
            const apiDate = formatForAPI(selectedDate);
            const histFromRes = await fetch(`/api/crypto?action=historical&ids=${fromCurrency}&date=${apiDate}`);
            const histFromData = await histFromRes.json();
            const histPriceFrom = histFromData.price || 0;

            // Fetch historical price for To
            const histToRes = await fetch(`/api/crypto?action=historical&ids=${toCurrency}&date=${apiDate}`);
            const histToData = await histToRes.json();
            const histPriceTo = histToData.price || 0;

            if (histPriceFrom > 0 && histPriceTo > 0 && currentPriceTo > 0) {
                const usdValueThen = amount * histPriceFrom;
                const coinsReceivedThen = usdValueThen / histPriceTo;
                const valueOfThoseCoinsToday = coinsReceivedThen * currentPriceTo;
                
                const deltaUsd = valueOfThoseCoinsToday - usdValueThen;
                const deltaPct = (deltaUsd / usdValueThen) * 100;

                setResult({
                    coinsReceivedThen,
                    usdValueThen,
                    valueOfThoseCoinsToday,
                    deltaUsd,
                    deltaPct,
                    histPriceFrom,
                    histPriceTo
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on inputs change
    useEffect(() => {
        const timeout = setTimeout(fetchHistoricalDetails, 500); 
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromCurrency, toCurrency, amount, selectedDate]);

    const fromSymbol = coins.find(c => c.id === fromCurrency)?.symbol.toUpperCase() || POPULAR_COINS.find(c => c.id === fromCurrency)?.symbol.toUpperCase() || fromCurrency;
    const toSymbol = coins.find(c => c.id === toCurrency)?.symbol.toUpperCase() || POPULAR_COINS.find(c => c.id === toCurrency)?.symbol.toUpperCase() || toCurrency;

    const handleShare = () => {
        if (!result) return;
        const text = `If I had converted ${amount} ${fromSymbol} to ${toSymbol} on ${selectedDate}, I'd have ${result.coinsReceivedThen.toFixed(4)} ${toSymbol} worth $${result.valueOfThoseCoinsToday.toFixed(0)} today — ${result.deltaPct >= 0 ? 'up' : 'down'} ${Math.abs(result.deltaPct).toFixed(1)}% 📊 via @ApexWeb3`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <CurrencyInput
                        label="If I had converted..."
                        amount={amount}
                        selectedCurrency={fromCurrency}
                        onAmountChange={setAmount}
                        onCurrencyChange={setFromCurrency}
                        currencies={POPULAR_COINS.map(c => c.id)}
                    />
                </div>
                <div>
                    <label className="text-xs text-zinc-500 font-semibold mb-2 block flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> Historical Date
                    </label>
                    <Input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        min="2015-01-01"
                        className="h-[68px] bg-zinc-900 border-zinc-800 text-lg w-full px-4 rounded-xl focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="flex flex-col items-center">
                <span className="text-zinc-500 font-medium text-xs tracking-wider uppercase bg-zinc-950 px-2 py-1 rounded relative z-10 bottom-[-10px]">INTO</span>
                <div className="w-full h-px bg-zinc-800" />
            </div>

            <CurrencyInput
                label="I would have received..."
                amount={result ? result.coinsReceivedThen : 0}
                selectedCurrency={toCurrency}
                onAmountChange={() => {}}
                onCurrencyChange={setToCurrency}
                currencies={POPULAR_COINS.map(c => c.id)}
                readOnly={true}
            />

            {loading && !result && (
                <div className="h-32 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary opacity-50" />
                </div>
            )}

            {result && !loading && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mt-6 shadow-inset relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                    
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Value on {selectedDate}</p>
                            <p className="text-xl font-medium text-zinc-300">${result.usdValueThen.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">That amount today</p>
                            <p className="text-3xl font-bold text-white">${result.valueOfThoseCoinsToday.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                            
                            <div className={`flex items-center gap-1 font-bold text-sm mt-1 ${result.deltaPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {result.deltaPct >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {Math.abs(result.deltaPct).toFixed(2)}% (${Math.abs(result.deltaUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })})
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={handleShare}
                        className="w-full mt-6 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white flex items-center justify-center gap-2 font-semibold"
                    >
                        <Twitter className="h-4 w-4" />
                        Share this result
                    </Button>
                </div>
            )}
        </div>
    );
}
