"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionCard } from "@/components/whales/transaction-card";
import { Eye, RefreshCw, Activity, Zap, Layers, Globe, Shield, Info } from "lucide-react";
import type { ApiResponse, WhaleWatchData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/utils";

const FILTER_OPTIONS = [
    { label: "All (>$100K)", value: 100000 },
    { label: ">$500K", value: 500000 },
    { label: ">$1M", value: 1000000 },
];

const NETWORKS = [
    { label: "All Networks", value: "all" },
    { label: "Ethereum", value: "ethereum" },
    { label: "Solana", value: "solana" },
    { label: "Bitcoin", value: "bitcoin" },
    { label: "Base", value: "base" },
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
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Activity className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Vol (Feed)</span>
                                </div>
                                <div className="text-2xl font-bold">{formatUSD(stats.totalVolume, 0)}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Largest Movement</span>
                                </div>
                                <div className="text-2xl font-bold">{formatUSD(stats.largestTx, 0)}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Globe className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Networks</span>
                                </div>
                                <div className="text-2xl font-bold">{stats.activeNetworks} Chains</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Layers className="h-4 w-4 text-purple-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sample Size</span>
                                </div>
                                <div className="text-2xl font-bold">{stats.count} Transactions</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-2">Threshold</h3>
                            <div className="flex flex-col gap-2">
                                {FILTER_OPTIONS.map((option) => (
                                    <Button
                                        key={option.value}
                                        onClick={() => setSelectedFilter(option.value)}
                                        variant={selectedFilter === option.value ? "default" : "ghost"}
                                        className={`justify-start text-sm ${selectedFilter === option.value ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-slate-800/50"}`}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-2">Network</h3>
                            <div className="flex flex-col gap-2">
                                {NETWORKS.map((net) => (
                                    <Button
                                        key={net.value}
                                        onClick={() => setSelectedNetwork(net.value)}
                                        variant={selectedNetwork === net.value ? "default" : "ghost"}
                                        className={`justify-start text-sm ${selectedNetwork === net.value ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-slate-800/50"}`}
                                    >
                                        <span className="capitalize">{net.label}</span>
                                    </Button>
                                ))}
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
