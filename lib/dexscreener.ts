// ── Types ──────────────────────────────────────────────────────────────────────
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
    marketCap?: number;
    pairCreatedAt: number;
}

export interface DexscreenerResponse {
    schemaVersion: string;
    pairs: DexscreenerPair[];
}

// ── Discovery URLs ─────────────────────────────────────────────────────────────
const PROFILE_ENDPOINT = "https://api.dexscreener.com/token-profiles/latest/v1";
const BOOSTS_ENDPOINT = "https://api.dexscreener.com/token-boosts/latest/v1";
const PAIRS_ENDPOINT = "https://api.dexscreener.com/latest/dex/tokens";
const SEARCH_ENDPOINT = "https://api.dexscreener.com/latest/dex/search";

const FETCH_OPTS = {
    next: { revalidate: 30 },
};

interface TokenProfileEntry {
    chainId: string;
    tokenAddress: string;
}

// ── Multi-Fetch Aggregator ─────────────────────────────────────────────────────

async function fetchDiscoveryTokens(): Promise<TokenProfileEntry[]> {
    try {
        const [profileRes, boostsRes] = await Promise.allSettled([
            fetch(PROFILE_ENDPOINT, FETCH_OPTS).then((r) => r.json()),
            fetch(BOOSTS_ENDPOINT, FETCH_OPTS).then((r) => r.json()),
        ]);

        const combined: TokenProfileEntry[] = [];

        for (const result of [profileRes, boostsRes]) {
            if (result.status !== "fulfilled") continue;
            const data = result.value;

            // DexScreener might return a raw array or { profiles: [] } or { boosts: [] }
            const entries = Array.isArray(data) ? data : (data?.profiles || data?.boosts || []);

            if (Array.isArray(entries)) {
                for (const item of entries) {
                    if (item.chainId && item.tokenAddress) {
                        combined.push({ chainId: item.chainId, tokenAddress: item.tokenAddress });
                    }
                }
            }
        }

        // De-duplicate by tokenAddress
        const seen = new Set<string>();
        const deduped: TokenProfileEntry[] = [];
        for (const entry of combined) {
            const key = entry.tokenAddress.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                deduped.push(entry);
            }
        }

        return deduped.slice(0, 40);
    } catch (err) {
        console.error("[dexscreener] Exception in fetchDiscoveryTokens:", err);
        return [];
    }
}

async function fetchPairsForTokens(tokens: TokenProfileEntry[]): Promise<DexscreenerPair[]> {
    if (tokens.length === 0) return [];

    const CHUNK = 20;
    const chunks: TokenProfileEntry[][] = [];
    for (let i = 0; i < tokens.length; i += CHUNK) {
        chunks.push(tokens.slice(i, i + CHUNK));
    }

    const results = await Promise.allSettled(
        chunks.map((chunk) => {
            const addresses = chunk.map((t) => t.tokenAddress).join(",");
            return fetch(`${PAIRS_ENDPOINT}/${addresses}`, FETCH_OPTS)
                .then((r) => r.json())
                .then((data) => (Array.isArray(data?.pairs) ? (data.pairs as DexscreenerPair[]) : []));
        })
    );

    const pairs: DexscreenerPair[] = [];
    for (const result of results) {
        if (result.status === "fulfilled") {
            pairs.push(...result.value);
        }
    }
    return pairs;
}

// ── Fallback Strategy: Search for recent active tokens ───────────────────────
async function fetchFallbackPairs(): Promise<DexscreenerPair[]> {
    const queries = ["sol", "pump", "new"];
    try {
        const results = await Promise.allSettled(
            queries.map(q =>
                fetch(`${SEARCH_ENDPOINT}?q=${q}`, FETCH_OPTS)
                    .then(r => r.json())
                    .catch(() => ({ pairs: [] }))
            )
        );

        const pairs: DexscreenerPair[] = [];
        for (const result of results) {
            if (result.status === "fulfilled" && Array.isArray(result.value?.pairs)) {
                pairs.push(...result.value.pairs);
            }
        }
        return pairs;
    } catch (err) {
        console.error("[dexscreener] Error in fetchFallbackPairs:", err);
        return [];
    }
}

// ── Main Export ────────────────────────────────────────────────────────────────
export const getLatestPairs = async (): Promise<DexscreenerPair[]> => {
    try {
        let allPairs: DexscreenerPair[] = [];

        // 1. Try Discovery
        const tokens = await fetchDiscoveryTokens();
        if (tokens.length > 0) {
            allPairs = await fetchPairsForTokens(tokens);
        }

        // 2. If discovery yields too little, use Fallback Search
        if (allPairs.length < 5) {
            const fallbacks = await fetchFallbackPairs();
            allPairs = [...allPairs, ...fallbacks];
        }

        // Deduplicate and prioritize liquidity
        const tokenMap = new Map<string, DexscreenerPair>();
        for (const pair of allPairs) {
            // Use base token address as key
            const key = `${pair.chainId}:${pair.baseToken.address}`.toLowerCase();
            const existing = tokenMap.get(key);
            const currentLiq = pair.liquidity?.usd ?? 0;
            const existingLiq = existing?.liquidity?.usd ?? 0;
            if (!existing || currentLiq > existingLiq) {
                tokenMap.set(key, pair);
            }
        }

        return Array.from(tokenMap.values());
    } catch (error) {
        console.error("[dexscreener] Global error in getLatestPairs:", error);
        return [];
    }
};

export const fetchDexscreenerPairs = getLatestPairs;
