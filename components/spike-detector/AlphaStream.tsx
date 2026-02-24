"use client";

import { useMemo } from "react";
import { ScoredPair } from "@/lib/actions/spike-detector";
import { Zap, Clock } from "lucide-react";

interface AlphaStreamProps {
    pairs: ScoredPair[];
}

function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
}

export function AlphaStream({ pairs }: AlphaStreamProps) {
    // Pick the 5 most recently detected spiking pairs
    const spikes = useMemo(() => {
        return pairs
            .filter((p) => p.isSpiking)
            .slice(0, 5);
    }, [pairs]);

    return (
        <aside
            className="flex flex-col rounded-xl border border-slate-700/60 bg-slate-900/50 p-4 backdrop-blur-sm"
            aria-label="Alpha Stream"
        >
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-brand-primary/20">
                    <Zap className="h-3 w-3 fill-brand-primary text-brand-primary" />
                </span>
                <h2 className="text-sm font-bold text-white">Alpha Stream</h2>
                <span className="ml-auto rounded-full bg-brand-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-primary">
                    LIVE
                </span>
            </div>

            {/* Spike List */}
            <div className="flex flex-col gap-2 flex-1">
                {spikes.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                        <div className="mb-2 text-2xl">🔭</div>
                        <p className="text-xs text-slate-500">Scanning for spikes…</p>
                        <p className="mt-1 text-[10px] text-slate-600">Refreshes every 5s</p>
                    </div>
                ) : (
                    spikes.map((pair) => (
                        <AlphaStreamEntry key={pair.pairAddress} pair={pair} />
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center gap-1 border-t border-slate-800 pt-3 text-[10px] text-slate-600">
                <Clock className="h-2.5 w-2.5" />
                <span>Showing last 5 spikes detected</span>
            </div>
        </aside>
    );
}

function AlphaStreamEntry({ pair }: { pair: ScoredPair }) {
    const change5m = pair.priceChange?.m5 || 0;
    const isPositive = change5m >= 0;

    const handleSnapTo = (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById(`token-${pair.pairAddress}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            // Subtle highlight effect
            el.classList.add("ring-2", "ring-emerald-500", "ring-offset-2", "ring-offset-slate-900");
            setTimeout(() => {
                el.classList.remove("ring-2", "ring-emerald-500", "ring-offset-2", "ring-offset-slate-900");
            }, 2000);
        }
    };

    return (
        <button
            onClick={handleSnapTo}
            className="group flex w-full items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-800/40 px-2.5 py-2 text-left transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/5"
        >
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                    <span className="truncate text-xs font-bold text-white">
                        ${pair.baseToken.symbol}
                    </span>
                    <span className="text-[9px] uppercase text-slate-600">
                        {pair.chainId.slice(0, 3)}
                    </span>
                    {pair.isAI && <span className="text-[9px]">🤖</span>}
                    {pair.isPump && <span className="text-[9px]">💊</span>}
                </div>
                <span className="text-[10px] text-slate-500">
                    {timeAgo(pair.pairCreatedAt)}
                </span>
            </div>

            <span
                className={`shrink-0 text-xs font-bold tabular-nums ${isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
            >
                {isPositive ? "+" : ""}
                {change5m.toFixed(1)}%
            </span>
        </button>
    );
}
