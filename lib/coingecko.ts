
import { TokenSearchResult } from "@/types";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Simple in-memory cache
const PRICE_CACHE = new Map<string, { price: number; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function searchTokens(query: string): Promise<TokenSearchResult[]> {
    if (MOCK_MODE) {
        // Mock search results
        return [
            { id: "bitcoin", symbol: "btc", name: "Bitcoin", thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png" },
            { id: "ethereum", symbol: "eth", name: "Ethereum", thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png" },
            { id: "solana", symbol: "sol", name: "Solana", thumb: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png" },
            { id: "usd-coin", symbol: "usdc", name: "USDC", thumb: "https://assets.coingecko.com/coins/images/6319/thumb/usdc.png" },
            { id: "tether", symbol: "usdt", name: "Tether", thumb: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png" },
        ].filter(coin =>
            coin.name.toLowerCase().includes(query.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(query.toLowerCase())
        );
    }

    try {
        const res = await fetch(`${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        return data.coins.slice(0, 10).map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            thumb: coin.thumb,
        }));
    } catch (error) {
        console.error("CoinGecko search error:", error);
        return [];
    }
}

export async function getTokenHistoricalData(tokenId: string, days: number): Promise<[number, number][]> {
    if (MOCK_MODE) {
        // Generate mock history data
        const data: [number, number][] = [];
        const now = Date.now();
        let price = 100 + Math.random() * 50;

        for (let i = days; i >= 0; i--) {
            const time = now - i * 24 * 60 * 60 * 1000;
            price = price * (1 + (Math.random() - 0.5) * 0.1); // Random walk
            data.push([time, price]);
        }
        return data;
    }

    try {
        const res = await fetch(
            `${COINGECKO_API_BASE}/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`
        );
        if (!res.ok) throw new Error("Fetch history failed");
        const data = await res.json();
        return data.prices;
    } catch (error) {
        console.error("CoinGecko history error:", error);
        return [];
    }
}

export async function getTokenData(tokenId: string): Promise<any | null> {
    if (MOCK_MODE) {
        return {
            id: tokenId,
            symbol: tokenId === "bitcoin" ? "btc" : "eth",
            name: tokenId === "bitcoin" ? "Bitcoin" : "Ethereum",
            image: `https://placehold.co/64?text=${tokenId.slice(0, 1).toUpperCase()}`,
            current_price: 50000 + Math.random() * 1000,
            market_cap: 1000000000000,
            market_cap_rank: 1,
            total_volume: 50000000000,
            circulating_supply: 19000000,
            total_supply: 21000000,
            max_supply: 21000000,
            ath: 69000,
            atl: 67,
            price_change_percentage_24h: 2.5
        };
    }

    try {
        const res = await fetch(
            `${COINGECKO_API_BASE}/coins/${tokenId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
        );
        if (!res.ok) throw new Error("Fetch token failed");
        const data = await res.json();

        return {
            id: data.id,
            symbol: data.symbol,
            name: data.name,
            image: data.image.large,
            current_price: data.market_data.current_price.usd,
            market_cap: data.market_data.market_cap.usd,
            market_cap_rank: data.market_cap_rank,
            total_volume: data.market_data.total_volume.usd,
            circulating_supply: data.market_data.circulating_supply,
            total_supply: data.market_data.total_supply,
            max_supply: data.market_data.max_supply,
            ath: data.market_data.ath.usd,
            atl: data.market_data.atl.usd,
            price_change_percentage_24h: data.market_data.price_change_percentage_24h
        };
    } catch (error) {
        console.error("CoinGecko token data error:", error);
        return null;
    }
}

export async function getBulkPrices(tokenIds: string[]): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    const idsToFetch: string[] = [];

    // Check cache first
    const now = Date.now();
    for (const id of tokenIds) {
        const cached = PRICE_CACHE.get(id);
        if (cached && now - cached.timestamp < CACHE_TTL) {
            prices.set(id, cached.price);
        } else {
            idsToFetch.push(id);
        }
    }

    if (idsToFetch.length === 0) return prices;

    if (MOCK_MODE) {
        for (const id of idsToFetch) {
            const mockPrice = Math.random() * 1000 + 100;
            prices.set(id, mockPrice);
            PRICE_CACHE.set(id, { price: mockPrice, timestamp: now });
        }
        return prices;
    }

    try {
        const res = await fetch(
            `${COINGECKO_API_BASE}/simple/price?ids=${idsToFetch.join(",")}&vs_currencies=usd`
        );
        if (!res.ok) throw new Error("Fetch bulk prices failed");
        const data = await res.json();

        for (const id of idsToFetch) {
            if (data[id] && data[id].usd) {
                prices.set(id, data[id].usd);
                PRICE_CACHE.set(id, { price: data[id].usd, timestamp: now });
            }
        }
    } catch (error) {
        console.error("CoinGecko bulk price error:", error);
    }

    return prices;
}

export async function getPriceAtDate(tokenId: string, date: string): Promise<number | null> {
    // date format: dd-mm-yyyy for CoinGecko API
    if (MOCK_MODE) {
        return Math.random() * 1000 + 100;
    }

    try {
        const res = await fetch(
            `${COINGECKO_API_BASE}/coins/${tokenId}/history?date=${date}`
        );
        if (!res.ok) throw new Error("Fetch historical price failed");
        const data = await res.json();
        return data.market_data?.current_price?.usd || null;
    } catch (error) {
        console.error("CoinGecko history error:", error);
        return null;
    }
}
