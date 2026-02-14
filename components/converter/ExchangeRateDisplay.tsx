import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";

interface ExchangeRateDisplayProps {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    loading?: boolean;
}

export function ExchangeRateDisplay({
    fromCurrency,
    toCurrency,
    rate,
    loading
}: ExchangeRateDisplayProps) {
    return (
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="text-xs text-zinc-500 uppercase font-medium">Exchange Rate</p>
                    <p className="text-sm font-medium text-zinc-200">
                        1 {fromCurrency.toUpperCase()} = <span className="text-primary font-bold">{loading ? '...' : rate.toFixed(6)}</span> {toCurrency.toUpperCase()}
                    </p>
                </div>
            </div>
            {/* Placeholder for 24h change, can be added later if we fetch it */}
            {/* <div className="flex items-center gap-1 text-xs text-green-400">
                 <TrendingUp className="h-3 w-3" />
                 <span>+2.4%</span>
             </div> */}
        </div>
    );
}
