import { unstable_cache } from "next/cache";

export interface DexscreenerPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
        address: string;
        name: string;
        symbol: string;
    };
    quoteToken: {
        address: string;
        name: string;
        symbol: string;
    };
    priceNative: string;
    priceUsd: string;
    txns: {
        m5: { buys: number; sells: number };
        h1: { buys: number; sells: number };
        h6: { buys: number; sells: number };
        h24: { buys: number; sells: number };
    };
    volume: {
        h24: number;
        h6: number;
        h1: number;
        m5: number;
    };
    priceChange: {
        m5: number;
        h1: number;
        h6: number;
        h24: number;
    };
    liquidity: {
        usd: number;
        base: number;
        quote: number;
    };
    fdv: number;
    pairCreatedAt: number;
}

export interface DexscreenerResponse {
    schemaVersion: string;
    pairs: DexscreenerPair[];
}

// Dexscreener doesn't have a public "latest pairs" endpoint that returns a firehose of everything.
// However, we can use their search or specific chain endpoints. 
// For this tool, to simulate "newly launched", we will query for trending/latest 
// or allow specific chain queries which return top pairs, then we filter by age client-side/server-side.
// NOTE: Real "sniping" tools use the paid API or WebSocket. This is a public tool demonstration.

const CACHE_TTL = 60; // 60 seconds

export const fetchDexscreenerPairs = async (chainId?: string): Promise<DexscreenerPair[]> => {
    // If no chainId is provided, we might want to fetch a few popular chains to aggregate.
    // For now, let's default to a search or a specific set of chains if not provided.

    // We can't easily "get all new pairs" from the free API without a search term or token addresses.
    // STRATEGY: We will fetch pairs for a few major tokens (WETH/SOL) to get *active* pairs,
    // and also allow the user to search. 
    // BETTER STRATEGY FOR "DISCOVERY": 
    // Use the `token-profiles/latest/v1` endpoint (if available) to get new token addresses, then fetch pairs.
    // But that endpoint is not always documented as stable public API.

    // Fallback: We'll fetch "Solana" and "Ethereum" top pairs via a search query or a hardcoded list of highly active router addresses? 
    // Actually, `https://api.dexscreener.com/latest/dex/search?q=WETH` returns many pairs.
    // Let's implement a multi-chain fetch strategy.

    const queries = [
        "https://api.dexscreener.com/latest/dex/search?q=SOL",  // Solana (Meme hub)
        "https://api.dexscreener.com/latest/dex/search?q=PEPE", // Memes
        "https://api.dexscreener.com/latest/dex/search?q=DOGE", // Memes
        "https://api.dexscreener.com/latest/dex/search?q=WIF",  // Solana Memes
        "https://api.dexscreener.com/latest/dex/search?q=BONK", // Solana Memes
        "https://api.dexscreener.com/latest/dex/search?q=BRETT", // Base Memes
        "https://api.dexscreener.com/latest/dex/search?q=DEGEN", // Base Memes
    ];

    try {
        const results = await Promise.all(
            queries.map(url =>
                fetch(url, { next: { revalidate: CACHE_TTL } })
                    .then(res => res.json())
                    .catch(err => ({ pairs: [] }))
            )
        );

        // Flatten pairs
        const allPairs = results.flatMap((r: any) => r.pairs || []) as DexscreenerPair[];

        // Remove duplicates based on pairAddress
        const uniquePairs = Array.from(new Map(allPairs.map(p => [p.pairAddress, p])).values());

        return uniquePairs;
    } catch (error) {
        console.error("Error fetching Dexscreener pairs:", error);
        return [];
    }
};

// Wrapper for caching if needed more explicitly, though fetch 'next' config handles it.
export const getLatestPairs = async () => {
    return fetchDexscreenerPairs();
};
