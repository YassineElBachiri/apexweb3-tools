import { CurrencyCard } from "./CurrencyCard";

interface MultiFiatGridProps {
    rates: { currency: string; amount: number }[];
}

const FIAT_DETAILS: Record<string, { name: string; flag: string; region: string }> = {
    USD: { name: 'United States Dollar', flag: '🇺🇸', region: 'Americas' },
    CAD: { name: 'Canadian Dollar', flag: '🇨🇦', region: 'Americas' },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', region: 'Americas' },
    BRL: { name: 'Brazilian Real', flag: '🇧🇷', region: 'Americas' },
    EUR: { name: 'Euro', flag: '🇪🇺', region: 'Europe' },
    GBP: { name: 'British Pound', flag: '🇬🇧', region: 'Europe' },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', region: 'Europe' },
    SEK: { name: 'Swedish Krona', flag: '🇸🇪', region: 'Europe' },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', region: 'Asia' },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', region: 'Asia' },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', region: 'Asia' },
    KRW: { name: 'South Korean Won', flag: '🇰🇷', region: 'Asia' },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', region: 'Asia-Pacific' },
    SGD: { name: 'Singapore Dollar', flag: '🇸🇬', region: 'Asia-Pacific' },
};

export function MultiFiatGrid({ rates }: MultiFiatGridProps) {
    const regions = ['Americas', 'Europe', 'Asia'];

    return (
        <div className="space-y-8">
            {regions.map((region) => {
                // Filter rates that belong to this region
                const regionRates = rates.filter(r => FIAT_DETAILS[r.currency]?.region === region || (region === 'Asia' && FIAT_DETAILS[r.currency]?.region === 'Asia-Pacific'));

                if (regionRates.length === 0) return null;

                return (
                    <div key={region}>
                        <h4 className="text-md font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                            {region === 'Americas' ? '🌎' : region === 'Europe' ? '🌍' : '🌏'} {region}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {regionRates.map((rate) => (
                                <CurrencyCard
                                    key={rate.currency}
                                    currencyCode={rate.currency}
                                    currencyName={FIAT_DETAILS[rate.currency]?.name || rate.currency}
                                    amount={rate.amount}
                                    flag={FIAT_DETAILS[rate.currency]?.flag || '🌐'}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
