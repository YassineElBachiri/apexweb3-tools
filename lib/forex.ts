
export interface ForexRate {
    rates: Record<string, number>;
    base: string;
    date: string;
}

const FOREX_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export async function getForexRates(): Promise<ForexRate | null> {
    try {
        const response = await fetch(FOREX_API_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!response.ok) {
            throw new Error(`Forex API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch forex rates:', error);
        return null;
    }
}

export async function getForexRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    // API is base USD, so we can convert through USD if needed
    // But since the requirement calls for fetching USD rates mostly, we can just fetch USD base.

    const data = await getForexRates();
    if (!data) return 0;

    const fromRate = from === 'USD' ? 1 : data.rates[from];
    const toRate = to === 'USD' ? 1 : data.rates[to];

    if (!fromRate || !toRate) return 0;

    return toRate / fromRate;
}
