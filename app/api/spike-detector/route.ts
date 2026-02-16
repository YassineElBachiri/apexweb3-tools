import { NextResponse } from "next/server";
import { getLatestPairs, DexscreenerPair } from "@/lib/dexscreener";

export interface ScoredPair extends DexscreenerPair {
    spikeScore: number;
    pairAgeHours: number;
    liquiditySpike: boolean;
    volumeSpike: boolean;
}

function calculateSpikeScore(pair: DexscreenerPair): number {
    let score = 0;

    // 1. Volume Acceleration (30 pts)
    // Compare 5m volume to 1h volume (normalized)
    const vol5m = pair.volume.m5 || 0;
    const vol1h = pair.volume.h1 || 0;
    // Expected 5m volume is 1/12th of 1h volume. If it's significantly higher, that's a spike.
    const expected5m = vol1h / 12;

    if (vol5m > expected5m * 2) score += 10;
    if (vol5m > expected5m * 4) score += 10;
    if (vol5m > expected5m * 8) score += 10;

    // 2. Liquidity (20 pts)
    // We prefer liquidity > $10k but < $500k for "early" gems usually, but for "spikes" we just want healthy liq.
    const liq = pair.liquidity?.usd || 0;
    if (liq > 10000) score += 5;
    if (liq > 50000) score += 5;
    if (liq > 100000) score += 5;
    if (liq > 500000) score += 5;

    // 3. Price Momentum (20 pts)
    const priceChange5m = pair.priceChange?.m5 || 0;
    const priceChange1h = pair.priceChange?.h1 || 0;

    if (priceChange5m > 5) score += 5;
    if (priceChange5m > 10) score += 5;
    if (priceChange1h > 10) score += 5;
    if (priceChange1h > 20) score += 5;

    // 4. Transaction Activity (20 pts)
    // High buy count is good
    const txns5m = pair.txns.m5;
    if (txns5m.buys > 10) score += 5;
    if (txns5m.buys > 30) score += 5;
    if (txns5m.buys > txns5m.sells * 1.5) score += 10; // Buy pressure

    // 5. Newness / Age (10 pts)
    const now = Date.now();
    const ageHours = (now - pair.pairCreatedAt) / (1000 * 60 * 60);
    if (ageHours < 24) score += 10;
    else if (ageHours < 48) score += 5;

    return Math.min(score, 100);
}

export async function GET(request: Request) {
    try {
        const rawPairs = await getLatestPairs();
        const now = Date.now();

        const scoredPairs: ScoredPair[] = rawPairs.map((pair) => {
            const ageHours = (now - pair.pairCreatedAt) / (1000 * 60 * 60);
            const score = calculateSpikeScore(pair);

            // Simple spike detection flags
            const vol5m = pair.volume.m5 || 0;
            const vol1h = pair.volume.h1 || 0;
            const expected5m = vol1h / 12;
            const volumeSpike = vol5m > expected5m * 3; // 3x average

            // Liquidity spike is harder to detect without historical data in the pair object provided by free API,
            // so we infer it from recent high volume relative to liquidity or just large liquidity for young pairs.
            // For this MVP, we'll mark it true if liquidity > $20k and age < 24h (Liquidity Injection)
            const liquiditySpike = (pair.liquidity?.usd || 0) > 20000 && ageHours < 24;

            return {
                ...pair,
                spikeScore: score,
                pairAgeHours: ageHours,
                liquiditySpike,
                volumeSpike
            };
        });

        // Sort by Spike Score descending
        const sorted = scoredPairs.sort((a, b) => b.spikeScore - a.spikeScore);

        return NextResponse.json({
            pairs: sorted.slice(0, 50), // Return top 50
            timestamp: now
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
