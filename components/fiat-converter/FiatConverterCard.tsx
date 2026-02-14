'use client';

import { useState, useEffect } from 'react';
import { MultiFiatGrid } from './MultiFiatGrid';
import { CurrencyInput } from '../converter/CurrencyInput';
import { POPULAR_COINS } from '@/lib/constants';
import { convertCryptoToFiat, getMultiFiatConversion } from '@/lib/fiatConverter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';

export function FiatConverterCard() {
    const [cryptoSymbol, setCryptoSymbol] = useState('bitcoin');
    const [amount, setAmount] = useState(1);
    const [fiatRates, setFiatRates] = useState<{ currency: string; amount: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Initial load and updates
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // We use the ID for the input, but the library might need the ID to fetch price.
                // convertCryptoToFiat uses fetchCoinPrice which expects an ID.
                const rates = await getMultiFiatConversion(cryptoSymbol, amount);
                setFiatRates(rates);
                setLastUpdated(new Date().toLocaleTimeString());
            } catch (error) {
                console.error("Failed to fetch fiat rates", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [cryptoSymbol, amount]);

    const cryptoOptions = POPULAR_COINS.map(c => c.id);

    return (
        <div className="space-y-8">
            <Card className="w-full bg-zinc-950 border-zinc-900 shadow-2xl shadow-primary/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                            Crypto to Fiat Calculator
                        </CardTitle>
                        {lastUpdated && (
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                                <RefreshCcw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                                <span>Updated {lastUpdated}</span>
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        Calculated across 30+ global currencies
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <CurrencyInput
                            label="Cryptocurrency Amount"
                            amount={amount}
                            selectedCurrency={cryptoSymbol}
                            onAmountChange={setAmount}
                            onCurrencyChange={setCryptoSymbol}
                            currencies={cryptoOptions}
                        />
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-zinc-950 px-4 text-sm text-zinc-500 font-mono">GLOBAL VALUE</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <MultiFiatGrid rates={fiatRates} />
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
