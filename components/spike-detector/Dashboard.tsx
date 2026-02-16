"use client";

import { useState, useEffect, useCallback } from "react";
import { FilterPanel, FilterState } from "./Filters";
import { ResultsTable } from "./ResultsTable";
import { ScoredPair } from "@/app/api/spike-detector/route";

export function SpikeDetectorDashboard() {
    const [filters, setFilters] = useState<FilterState>({
        network: "all",
        minLiquidity: 1000,
        minVolume5m: 100,
        maxAgeHours: 7200, // Default to 300 days to show most active meme coins
        autoRefresh: false
    });

    const [pairs, setPairs] = useState<ScoredPair[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/spike-detector");
            const data = await res.json();
            if (data.pairs) {
                setPairs(data.pairs);
            }
            setLastUpdated(Date.now());
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-refresh interval
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (filters.autoRefresh) {
            interval = setInterval(fetchData, 30000); // 30s
        }
        return () => clearInterval(interval);
    }, [filters.autoRefresh, fetchData]);

    // Client-side filtering logic
    const filteredPairs = pairs.filter(pair => {
        if (filters.network !== "all" && pair.chainId !== filters.network) return false;
        if (pair.liquidity.usd < filters.minLiquidity) return false;
        if ((pair.volume.m5 || 0) < filters.minVolume5m) return false;
        if (pair.pairAgeHours > filters.maxAgeHours) return false;
        return true;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Live Meme Coin Scanner</h2>
                    <p className="text-xs text-slate-400">
                        Powered by <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Dexscreener</a> API
                        <span className="mx-2">•</span>
                        Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Additional header controls if needed */}
                </div>
            </div>

            <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onRefresh={fetchData}
                isRefreshing={loading}
            />

            <ResultsTable pairs={filteredPairs} />
        </div>
    );
}
