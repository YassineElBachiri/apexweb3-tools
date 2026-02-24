"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { SpikeCard } from "@/components/SpikeCard";
import { AlphaStream } from "@/components/spike-detector/AlphaStream";
import { ScoredPair } from "@/lib/actions/spike-detector";
import { getSpikingTokens } from "@/lib/actions/spike-detector";
import { Activity, RefreshCw, Flame } from "lucide-react";

// ── SWR fetcher ───────────────────────────────────────────────────────────────
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ── Heat Map Ticker ───────────────────────────────────────────────────────────
function getTickerGlow(change5m: number): string {
    if (change5m >= 10) return "text-emerald-300 [text-shadow:0_0_10px_rgba(52,211,153,0.9)]";
    if (change5m >= 5) return "text-emerald-400 [text-shadow:0_0_6px_rgba(52,211,153,0.6)]";
    if (change5m >= 0) return "text-emerald-500";
    if (change5m >= -5) return "text-red-400";
    return "text-red-300 [text-shadow:0_0_8px_rgba(248,113,113,0.8)]";
}

interface HeatMapTickerProps {
    pairs: ScoredPair[];
}

function HeatMapTicker({ pairs }: HeatMapTickerProps) {
    // Only show the pairs with non-zero 5m change for interest
    const tickerPairs = useMemo(
        () => pairs.filter((p) => (p.priceChange?.m5 ?? 0) !== 0).slice(0, 30),
        [pairs]
    );

    if (tickerPairs.length === 0) return null;

    // Duplicate the list for seamless looping
    const display = [...tickerPairs, ...tickerPairs];

    return (
        <div
            className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60 py-2 backdrop-blur-sm"
            aria-label="Live Heat Map Ticker"
        >
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-900/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-900/80 to-transparent" />

            <div className="flex animate-ticker items-center gap-5 whitespace-nowrap px-4">
                {display.map((pair, i) => {
                    const change = pair.priceChange?.m5 ?? 0;
                    return (
                        <span
                            key={pair.pairAddress + "-" + i}
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums transition-colors ${getTickerGlow(change)}`}
                        >
                            <span className="font-bold">${pair.baseToken.symbol}</span>
                            <span className="opacity-70">
                                {change >= 0 ? "+" : ""}
                                {change.toFixed(2)}%
                            </span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

// ── Skeleton Loading Card ─────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                <div className="h-4 w-14 animate-pulse rounded bg-slate-800" />
            </div>
            <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-800" />
                ))}
            </div>
            <div className="h-1.5 w-full animate-pulse rounded-full bg-slate-800" />
            <div className="flex gap-2">
                <div className="h-8 flex-1 animate-pulse rounded-lg bg-slate-800" />
                <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-800" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-800" />
            </div>
        </div>
    );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar({ pairs, lastUpdated }: { pairs: ScoredPair[]; lastUpdated: number }) {
    const spiking = pairs.filter((p) => p.isSpiking).length;
    const safe = pairs.filter((p) => p.safetyLabel === "Safe").length;

    return (
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-brand-primary" />
                <span>
                    <strong className="text-white">{pairs.length}</strong> trenches scanned
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                    <strong className="text-emerald-400">{spiking}</strong> spiking now
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="text-emerald-500">🟢</span>
                <span>
                    <strong className="text-white">{safe}</strong> verified safe
                </span>
            </div>
            <div className="ml-auto flex items-center gap-1 text-slate-600">
                <RefreshCw className="h-3 w-3 animate-spin [animation-duration:5s]" />
                <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
            </div>
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export function SpikeDetectorDashboard() {
    const { data, error, isLoading } = useSWR<{ pairs: ScoredPair[]; timestamp: number }>(
        "spiking-tokens",
        getSpikingTokens,
        { refreshInterval: 5000, revalidateOnFocus: true }
    );

    const pairs: ScoredPair[] = data?.pairs ?? [];
    const timestamp = data?.timestamp ?? Date.now();

    const hasPairs = pairs.length > 0;

    return (
        <div className="space-y-4">
            {/* Stats Bar */}
            {hasPairs && <StatsBar pairs={pairs} lastUpdated={timestamp} />}

            {/* Heat Map Ticker */}
            {hasPairs && <HeatMapTicker pairs={pairs} />}

            {/* Main Layout: Grid + Sidebar */}
            <div className="flex flex-col gap-4 xl:flex-row">
                {/* Token Card Grid */}
                <div className="min-w-0 flex-1">
                    {error && (
                        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6 text-center text-sm text-red-400">
                            ⚠ Failed to load data. The DexScreener API may be rate-limited. Retrying automatically…
                        </div>
                    )}

                    {isLoading && !data && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}

                    {hasPairs && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {pairs.map((pair) => (
                                <SpikeCard key={pair.pairAddress} pair={pair} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && pairs.length === 0 && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
                            <p className="text-slate-400">No pairs found. Refreshing every 5 seconds…</p>
                        </div>
                    )}
                </div>

                {/* Alpha Stream Sidebar */}
                <div className="xl:w-[280px] xl:shrink-0">
                    <AlphaStream pairs={pairs} />
                </div>
            </div>
        </div>
    );
}
