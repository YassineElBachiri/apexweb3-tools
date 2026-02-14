
interface CurrencyCardProps {
    currencyCode: string;
    currencyName: string;
    amount: number;
    flag: string;
    change24h?: number;
}

export function CurrencyCard({
    currencyCode,
    currencyName,
    amount,
    flag,
    change24h
}: CurrencyCardProps) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="text-2xl">{flag}</div>
                <div>
                    <p className="font-bold text-white">{currencyCode}</p>
                    <p className="text-xs text-zinc-500">{currencyName}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-mono font-medium text-white">{formattedAmount}</p>
                {/* 
                <p className={`text-xs ${change24h && change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change24h && change24h >= 0 ? '+' : ''}{change24h}%
                </p> 
                */}
            </div>
        </div>
    );
}
