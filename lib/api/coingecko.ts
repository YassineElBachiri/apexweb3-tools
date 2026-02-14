const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCoinPrice(coinId: string): Promise<number | null> {
    if (!coinId) return null;

    try {
        const response = await fetch(
            `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            if (response.status === 429) {
                console.warn('CoinGecko API rate limit exceeded.');
                return null;
            }
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        return data[coinId]?.usd || null;
    } catch (error) {
        console.warn('Failed to fetch coin price:', error);
        return null;
    }
}

export async function fetchTopCoins(): Promise<any[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`
        );
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
}
