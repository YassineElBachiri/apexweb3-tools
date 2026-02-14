'use client';

import { useState, useEffect } from 'react';
import { CurrencyInput } from './CurrencyInput';
import { ExchangeRateDisplay } from './ExchangeRateDisplay';
import { POPULAR_COINS } from '@/lib/constants';
import { convertCrypto } from '@/lib/converter';
import { ArrowUpDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ConverterCard() {
    const [fromCurrency, setFromCurrency] = useState('bitcoin');
    const [toCurrency, setToCurrency] = useState('ethereum');
    const [amount, setAmount] = useState(1);
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const handleConvert = async () => {
        setLoading(true);
        try {
            const result = await convertCrypto(fromCurrency, toCurrency, amount);
            setConvertedAmount(result.toAmount);
            setExchangeRate(result.exchangeRate);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Conversion failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleConvert();
        const interval = setInterval(handleConvert, 60000); // Auto-refresh every minute
        return () => clearInterval(interval);
    }, [fromCurrency, toCurrency, amount]);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        // Amounts will update automatically due to useEffect
    };

    const currencyOptions = POPULAR_COINS.map(c => c.id);

    return (
        <Card className="w-full bg-zinc-950 border-zinc-900 shadow-2xl shadow-primary/5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Universal Converter
                    </CardTitle>
                    {lastUpdated && (
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <RefreshCcw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                            <span>Updated {lastUpdated}</span>
                        </div>
                    )}
                </div>
                <CardDescription>Real-time crypto-to-crypto conversion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <CurrencyInput
                    label="From"
                    amount={amount}
                    selectedCurrency={fromCurrency}
                    onAmountChange={setAmount}
                    onCurrencyChange={setFromCurrency}
                    currencies={currencyOptions}
                />

                <div className="relative flex justify-center">
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

                <CurrencyInput
                    label="To"
                    amount={convertedAmount}
                    selectedCurrency={toCurrency}
                    onAmountChange={() => { }} // Read-only mostly, but could implement reverse calc
                    onCurrencyChange={setToCurrency}
                    currencies={currencyOptions}
                    readOnly={true}
                />

                <ExchangeRateDisplay
                    fromCurrency={POPULAR_COINS.find(c => c.id === fromCurrency)?.symbol || fromCurrency}
                    toCurrency={POPULAR_COINS.find(c => c.id === toCurrency)?.symbol || toCurrency}
                    rate={exchangeRate}
                    loading={loading}
                />
            </CardContent>
        </Card>
    );
}
