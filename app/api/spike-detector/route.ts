import { NextResponse } from "next/server";
import { getLatestPairs, DexscreenerPair } from "@/lib/dexscreener";

export interface ScoredPair extends DexscreenerPair {
    spikeScore: number;
    pairAgeHours: number;
    liquiditySpike: boolean;
    volumeSpike: boolean;
    isSpiking: boolean;
    safetyLabel: "Safe" | "Warning" | "High Risk";
    safetyEmoji: "🟢" | "🟡" | "🔴";
    marketCapUsd: number;
    volumeVelocity: number; // (vol5m / liquidity) * 100  → percentage
}

// ── The Cleaner: Hard Filters ─────────────────────────────────────────────────
const KEYWORD_BLOCK = ["solana", "wrapped", "ethereum", "usdc"];

function passesHardFilters(pair: DexscreenerPair, marketCapUsd: number): boolean {
    // MCAP ceiling: only micro-caps < $1.5M
    if (marketCapUsd > 1_500_000) return false;

    // Liquidity floor: loosened to $2.5k for very early trenches
    const liq = pair.liquidity?.usd ?? 0;
    if (liq < 2_500) return false;

    // Keyword block on token name
    const nameLower = (pair.baseToken.name ?? "").toLowerCase();
    if (KEYWORD_BLOCK.some((kw) => nameLower.includes(kw))) return false;

    return true;
}

// ── Spike Score ───────────────────────────────────────────────────────────────
function calculateSpikeScore(pair: DexscreenerPair): number {
    let score = 0;

    const vol5m = pair.volume?.m5 || 0;
    const vol1h = pair.volume?.h1 || 0;
    const liq = pair.liquidity?.usd || 0;
    const expected5m = vol1h / 12;

    // Volume acceleration vs hourly average (30 pts)
    if (vol5m > expected5m * 2) score += 10;
    if (vol5m > expected5m * 4) score += 10;
    if (vol5m > expected5m * 8) score += 10;

    // Velocity bonus (20 pts)
    const velocity = liq > 0 ? (vol5m / liq) * 100 : 0;
    if (velocity > 5) score += 10;
    if (velocity > 15) score += 10;

    // Price momentum (20 pts)
    const priceChange5m = pair.priceChange?.m5 || 0;
    const priceChange1h = pair.priceChange?.h1 || 0;
    if (priceChange5m > 2) score += 5;
    if (priceChange5m > 10) score += 5;
    if (priceChange1h > 10) score += 5;
    if (priceChange1h > 20) score += 5;

    // Buy pressure (20 pts)
    const txns5m = pair.txns?.m5 ?? { buys: 0, sells: 0 };
    if (txns5m.buys > 5) score += 5;
    if (txns5m.buys > 20) score += 5;
    if (txns5m.buys > txns5m.sells * 1.5) score += 10;

    // Newness (10 pts)
    const now = Date.now();
    const ageHours = (now - pair.pairCreatedAt) / (1000 * 60 * 60);
    if (ageHours < 24) score += 10;
    else if (ageHours < 48) score += 5;

    return Math.min(score, 100);
}

// ── New Spike Logic ───────────────────────────────────────────────────────────
// 🟢 SPIKING only if:
//   Velocity > 5%  AND  priceChange.m5 > 2%
function detectSpike(pair: DexscreenerPair, velocity: number): boolean {
    const priceChange5m = pair.priceChange?.m5 || 0;
    return velocity > 5 && priceChange5m > 2;
}

// ── RugCheck Security (Solana) ────────────────────────────────────────────────
async function fetchRugCheckScore(
    mintAddress: string
): Promise<{ label: ScoredPair["safetyLabel"]; emoji: ScoredPair["safetyEmoji"]; isRisky: boolean }> {
    try {
        const url = `https://api.rugcheck.xyz/v1/tokens/${mintAddress}/report/summary`;
        const res = await fetch(url, {
            next: { revalidate: 300 },
            signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return { label: "Warning", emoji: "🟡", isRisky: false };
        const data = (await res.json()) as { score?: number; risks?: { level?: string }[] };

        // Check for explicit "Risky" level in risks array
        const hasRiskyFlag = (data.risks ?? []).some(
            (r) => (r.level ?? "").toLowerCase() === "danger" || (r.level ?? "").toLowerCase() === "warn"
        );

        const score = data.score ?? 0;
        if (score >= 700 && !hasRiskyFlag) return { label: "Safe", emoji: "🟢", isRisky: false };
        if (score >= 400) return { label: "Warning", emoji: "🟡", isRisky: hasRiskyFlag };
        return { label: "High Risk", emoji: "🔴", isRisky: true };
    } catch {
        return { label: "Warning", emoji: "🟡", isRisky: false };
    }
}

// ── GoPlus Security (Base / ETH / BSC) ───────────────────────────────────────
const CHAIN_IDS: Record<string, string> = {
    ethereum: "1",
    base: "8453",
    bsc: "56",
    arbitrum: "42161",
    polygon: "137",
};

async function fetchGoPlusSecurity(
    chainId: string,
    contractAddress: string
): Promise<{ label: ScoredPair["safetyLabel"]; emoji: ScoredPair["safetyEmoji"]; isRisky: boolean }> {
    const numericChain = CHAIN_IDS[chainId];
    if (!numericChain) return { label: "Warning", emoji: "🟡", isRisky: false };

    try {
        const apiKey = process.env.GOPLUS_API_KEY ?? "";
        const headers: HeadersInit = apiKey ? { Authorization: apiKey } : {};
        const url = `https://api.gopluslabs.io/api/v1/token_security/${numericChain}?contract_addresses=${contractAddress}`;
        const res = await fetch(url, {
            headers,
            next: { revalidate: 300 },
            signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return { label: "Warning", emoji: "🟡", isRisky: false };
        const data = (await res.json()) as {
            result?: Record<string, { is_honeypot?: string; is_mintable?: string }>;
        };
        const token = data.result?.[contractAddress.toLowerCase()];
        if (!token) return { label: "Warning", emoji: "🟡", isRisky: false };

        const isHoneypot = token.is_honeypot === "1";
        const isMintable = token.is_mintable === "1";

        if (!isHoneypot && !isMintable) return { label: "Safe", emoji: "🟢", isRisky: false };
        if (isHoneypot) return { label: "High Risk", emoji: "🔴", isRisky: true };
        return { label: "Warning", emoji: "🟡", isRisky: false };
    } catch {
        return { label: "Warning", emoji: "🟡", isRisky: false };
    }
}

// ── Security Routing ──────────────────────────────────────────────────────────
async function getSecurityScore(
    pair: DexscreenerPair
): Promise<{ label: ScoredPair["safetyLabel"]; emoji: ScoredPair["safetyEmoji"]; isRisky: boolean }> {
    if (pair.chainId === "solana") {
        return fetchRugCheckScore(pair.baseToken.address);
    }
    if (["ethereum", "base", "bsc", "arbitrum", "polygon"].includes(pair.chainId)) {
        return fetchGoPlusSecurity(pair.chainId, pair.baseToken.address);
    }
    return { label: "Warning", emoji: "🟡", isRisky: false };
}

// ── Route Handler ──────────────────────────────────────────────────────────────
export async function GET() {
    try {
        const rawPairs = await getLatestPairs();
        const now = Date.now();

        // Pre-score + apply hard filters
        const preScored = rawPairs
            .map((pair) => {
                const marketCapUsd = pair.marketCap ?? pair.fdv ?? 0;
                const ageHours = (now - (pair.pairCreatedAt || now)) / (1000 * 60 * 60);
                const vol5m = pair.volume?.m5 || 0;
                const liq = pair.liquidity?.usd || 0;
                const vol1h = pair.volume?.h1 || 0;
                const expected5m = vol1h / 12;

                // New velocity formula: (vol5m / liq) * 100  → percentage
                const volumeVelocity = liq > 0 ? (vol5m / liq) * 100 : 0;

                return {
                    pair,
                    marketCapUsd,
                    ageHours,
                    score: calculateSpikeScore(pair),
                    volumeSpike: vol5m > expected5m * 3,
                    liquiditySpike: liq > 20_000 && ageHours < 24,
                    isSpiking: detectSpike(pair, volumeVelocity),
                    volumeVelocity,
                };
            })
            // ── THE CLEANER: drop big-cap noise ─────────────────────────────
            .filter(({ pair, marketCapUsd }) => passesHardFilters(pair, marketCapUsd));

        // Fetch security scores in parallel
        const securityResults = await Promise.allSettled(
            preScored.map(({ pair }) => getSecurityScore(pair))
        );

        const scoredPairs: ScoredPair[] = preScored.map(
            ({ pair, ageHours, score, volumeSpike, liquiditySpike, isSpiking, volumeVelocity, marketCapUsd }, i) => {
                const secResult = securityResults[i];
                const security =
                    secResult.status === "fulfilled"
                        ? secResult.value
                        : { label: "Warning" as const, emoji: "🟡" as const, isRisky: false };

                // Downgrade spike status if security is "High Risk"
                const finalIsSpiking = isSpiking && !security.isRisky;

                return {
                    ...pair,
                    spikeScore: score,
                    pairAgeHours: ageHours,
                    liquiditySpike,
                    volumeSpike,
                    isSpiking: finalIsSpiking,
                    safetyLabel: security.label,
                    safetyEmoji: security.emoji,
                    marketCapUsd,
                    volumeVelocity,
                };
            }
        );

        // Sort: spiking first, then by spikeScore descending
        const sorted = scoredPairs.sort((a, b) => {
            if (a.isSpiking && !b.isSpiking) return -1;
            if (!a.isSpiking && b.isSpiking) return 1;
            return b.spikeScore - a.spikeScore;
        });

        return NextResponse.json({ pairs: sorted.slice(0, 60), timestamp: now });
    } catch (error) {
        console.error("Spike Detector API Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
