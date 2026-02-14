
interface LiveConversionTableProps {
    baseCurrency: string;
    amount: number;
    rates: Record<string, number>;
}

export function LiveConversionTable({ baseCurrency, amount, rates }: LiveConversionTableProps) {
    const currencies = Object.keys(rates);

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-zinc-500">1 {baseCurrency.toUpperCase()} equals:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currencies.map((currency) => (
                    <div
                        key={currency}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-900 hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {/* We can add icons here later if available */}
                            <span className="font-mono font-bold text-zinc-400">{currency.toUpperCase()}</span>
                        </div>
                        <span className="font-mono text-white">
                            {(amount * rates[currency]).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
