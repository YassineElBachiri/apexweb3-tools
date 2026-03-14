"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionCard } from "@/components/whales/transaction-card";
import { Eye, RefreshCw, Activity, Zap, Layers, Globe, Shield, Info, LayoutGrid, Waves, Bitcoin, Box, Filter } from "lucide-react";
import type { ApiResponse, WhaleWatchData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/utils";

const FILTER_OPTIONS = [
    { label: "All (>$100K)", value: 100000 },
    { label: ">$500K", value: 500000 },
    { label: ">$1M", value: 1000000 },
];

const NETWORKS = [
    { label: "All Networks", value: "all", icon: LayoutGrid },
    { label: "Ethereum", value: "ethereum", icon: Waves, color: "text-blue-400" },
    { label: "Solana", value: "solana", icon: Zap, color: "text-purple-400" },
    { label: "Bitcoin", value: "bitcoin", icon: Bitcoin, color: "text-orange-400" },
    { label: "Base", value: "base", icon: Box, color: "text-blue-500" },
];

export default function WhalesPage() {
    const [data, setData] = useState<WhaleWatchData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState(100000);
    const [selectedNetwork, setSelectedNetwork] = useState("all");
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`/api/whales?minValue=${selectedFilter}&network=${selectedNetwork}`);
            const result: ApiResponse<WhaleWatchData> = await response.json();

            if (result.success && result.data) {
                setData(result.data);
            }
        } catch (error) {
            console.error("Error fetching whale data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedFilter, selectedNetwork]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const stats = useMemo(() => {
        if (!data || data.transactions.length === 0) return null;

        const totalVolume = data.transactions.reduce((acc, tx) => acc + (tx.valueUsd || 0), 0);
        const largestTx = Math.max(...data.transactions.map(tx => tx.valueUsd || 0));
        const activeNetworks = new Set(data.transactions.map(tx => tx.network)).size;

        return { totalVolume, largestTx, activeNetworks, count: data.transactions.length };
    }, [data]);

    return (
        <div className="min-h-screen bg-brand-dark pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-12">
                {/* Background glow blobs */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
                    <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-blue-600 blur-[130px]" />
                    <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-purple-600 blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge
                            variant="outline"
                            className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400"
                        >
                            <RefreshCw className={`mr-1 h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                            {refreshing ? "Updating Feed..." : "Live Feed — Updates Every 30s"}
                        </Badge>

                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                            Whale{" "}
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 bg-clip-text text-transparent">
                                Watch
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400">
                            Real-time intelligence on{" "}
                            <span className="font-semibold text-slate-200">
                                institutional-grade cryptocurrency movements
                            </span>{" "}
                            across multiple networks.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <StatPill icon="🐋" label=">$100k Movements" />
                            <StatPill icon="🌍" label="Multi-chain Tracking" />
                            <StatPill icon="⚡" label="30s Auto-Refresh" />
                            <Button onClick={fetchData} disabled={refreshing} variant="outline" size="sm" className="rounded-full border-slate-700 bg-slate-800/60 text-xs text-slate-300 hover:bg-slate-700/60 hover:text-white h-[26px] px-3 py-0">
                                <RefreshCw className={`h-3 w-3 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                                Force Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl md:px-6 animate-in fade-in duration-700">
                {/* Stats Dashboard */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        <Card className="bg-slate-900/60 border-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary/30 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                        <Activity className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Vol (Feed)</span>
                                </div>
                                <div className="text-2xl font-bold tracking-tight">{formatUSD(stats.totalVolume, 0)}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/60 border-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-yellow-500/30 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 rounded-lg bg-yellow-500/10">
                                        <Zap className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Largest Movement</span>
                                </div>
                                <div className="text-2xl font-bold tracking-tight">{formatUSD(stats.largestTx, 0)}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/60 border-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-emerald-500/30 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                        <Globe className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Networks</span>
                                </div>
                                <div className="text-2xl font-bold tracking-tight">{stats.activeNetworks} Chains</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/60 border-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-purple-500/30 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10">
                                        <Layers className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sample Size</span>
                                </div>
                                <div className="text-2xl font-bold tracking-tight">{stats.count} Transfers</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-72 space-y-8">
                        {/* Threshold Filter */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Filter className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Movement Threshold</h3>
                            </div>
                            <div className="p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-sm space-y-1">
                                {FILTER_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedFilter(option.value)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                            selectedFilter === option.value
                                                ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {selectedFilter === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Network Filter */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Network</h3>
                            </div>
                            <div className="p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-sm space-y-1">
                                {NETWORKS.map((net) => {
                                    const Icon = net.icon;
                                    return (
                                        <button
                                            key={net.value}
                                            onClick={() => setSelectedNetwork(net.value)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                selectedNetwork === net.value
                                                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
                                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                                            }`}
                                        >
                                            <Icon className={`h-4 w-4 ${selectedNetwork === net.value ? "text-primary" : "text-slate-500"}`} />
                                            <span className="capitalize">{net.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Feed Content */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                                <RefreshCw className="h-10 w-10 mb-4 text-primary animate-spin" />
                                <h3 className="text-xl font-bold mb-1">Scanning the depths...</h3>
                                <p className="text-muted-foreground">Capturing global whale activity</p>
                            </div>
                        ) : data && data.transactions.length > 0 ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="px-3 py-1 rounded-full bg-slate-800/50 border-slate-700 text-xs text-muted-foreground font-mono">
                                        {data.transactions.length} RESULTS FOUND
                                    </Badge>
                                    <span className="text-xs text-muted-foreground animate-pulse flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        LIVE FEED
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {data.transactions.map((tx) => (
                                        <TransactionCard key={tx.hash} transaction={tx} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Card className="bg-slate-900/20 border-dashed border-slate-800 py-32 text-center">
                                <CardContent>
                                    <Eye className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                                    <h2 className="text-2xl font-bold mb-2">Quiet Waters</h2>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        No movements detected matching your filters. Try lowering the threshold or changing networks.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
            
            {/* How It Works & Disclaimer */}
            <div className="container mx-auto px-4 py-8 max-w-7xl md:px-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-400">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-slate-300">
                        <Info className="h-4 w-4 text-blue-500" />
                        Platform Methodology
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs">
                        <HowItWorksItem
                            emoji="🐋"
                            title="Threshold Filters"
                            body="Filter movements globally based on USD values. Base threshold captures highly significant institutional capital flows."
                        />
                        <HowItWorksItem
                            emoji="🌍"
                            title="Network Aggregation"
                            body="Unifies whale alerts across Ethereum, Solana, Bitcoin, and Base into a single real-time multi-chain feed."
                        />
                        <HowItWorksItem
                            emoji="⚡"
                            title="Live Data Feed"
                            body="Metrics and large transactions stream automatically every 30 seconds to maintain high-precision market analytics."
                        />
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <div className="flex items-start gap-2 rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-xs leading-relaxed">
                            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <div>
                                <p className="font-bold text-red-400 mb-1 tracking-wide uppercase">Legal Risk Disclaimer (E-E-A-T Compliance)</p>
                                <p className="text-slate-400">
                                    The ApexWeb3 Whale Watch is an analytical tool leveraging public on-chain blockchain data for informational purposes only. Large transaction tracking is imperfect and does not constitute financial, investment, or legal advice. Capital movements may be internal treasury transfers, exchange reshuffles, or institutional OTC trades, and do not necessarily indicate impending market price movements. Always perform your own due diligence (DYOR) before making trading decisions. © 2026 ApexWeb3 Intelligence. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatPill({ icon, label }: { icon: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            <span>{icon}</span>
            {label}
        </span>
    );
}

function HowItWorksItem({
    emoji,
    title,
    body,
}: {
    emoji: string;
    title: string;
    body: string;
}) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-slate-200">
                <span>{emoji}</span>
                {title}
            </p>
            <p className="text-xs leading-relaxed text-slate-500">{body}</p>
        </div>
    );
}
