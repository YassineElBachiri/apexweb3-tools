"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, TrendingUp, PieChart, Activity, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { searchTokens } from "@/lib/coingecko";
import { TokenSearchResult } from "@/types";
import { TokenomicsView } from "@/components/tokenomics/tokenomics-view";
import { Card, CardContent } from "@/components/ui/card";
import type { ApiResponse, TokenomicsAnalysis } from "@/types";

function AnalyzerContent() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([]);
    const [selectedToken, setSelectedToken] = useState<TokenSearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [address, setAddress] = useState<string | null>(null);
    const [data, setData] = useState<TokenomicsAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounced search
    useEffect(() => {
        // Prevent searching again if the query was just set by selecting a token
        if (selectedToken && query === selectedToken.name) {
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 1) {
                setIsSearching(true);
                const results = await searchTokens(query);
                setSearchResults(results);
                setIsSearching(false);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, selectedToken]);

    // Ephemeral URL parameter handling  
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            fetchTokenomicsData(q);
            // Clear URL without reloading
            window.history.replaceState(null, "", "/analysis/analyzer");
        }
    }, [searchParams]);

    const fetchTokenomicsData = async (tokenId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/tokenomics?tokenId=${tokenId}`);
            const result: ApiResponse<TokenomicsAnalysis> = await response.json();

            if (result.success && result.data) {
                setData(result.data);
                setAddress(tokenId); // Store token ID
            } else {
                setError(result.error || "Failed to fetch tokenomics data");
                setData(null);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("An unexpected error occurred");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectToken = async (token: TokenSearchResult) => {
        setSelectedToken(token);
        setQuery(token.name);
        setShowResults(false);

        // Analyze the selected token by ID
        await fetchTokenomicsData(token.id);
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20">
            {/* Redesigned Hero Section matching Spike Detector */}
            <div className="relative border-b border-slate-800 bg-slate-900/50 pt-24 pb-12 z-40">
                {/* Background glow blobs */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
                    <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-brand-primary blur-[130px]" />
                    <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-purple-600 blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge
                            variant="outline"
                            className="mb-4 border-primary/30 bg-primary/10 text-primary"
                        >
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Real-Time Tokenomics Engine
                        </Badge>

                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                            Tokenomics{" "}
                            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                Analyzer
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400">
                            Deep dive into any token&apos;s economy.{" "}
                            <span className="font-semibold text-slate-200">
                                Analyze inflation risk, supply distribution,
                            </span>{" "}
                            and real-time market data across multiple networks.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <StatPill icon="📊" label="Unlock Schedules" />
                            <StatPill icon="📈" label="Inflation Tracking" />
                            <StatPill icon="⚠️" label="Risk Scoring" />
                        </div>
                        
                        {/* Token Search */}
                        <div className="mt-10 mx-auto w-full max-w-2xl relative text-left z-50">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                                    <Search className="absolute left-4 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            setSelectedToken(null);
                                        }}
                                        placeholder="Search by token name or paste contract address..."
                                        className="w-full bg-transparent pl-12 pr-12 py-4 text-slate-200 focus:outline-none transition-all placeholder:text-slate-500"
                                    />
                                    {isSearching && (
                                        <div className="absolute right-4 text-primary">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Search Results Dropdown */}
                            {showResults && searchResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] max-h-80 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2">
                                    {searchResults.map((token) => (
                                        <button
                                            key={token.id}
                                            type="button"
                                            onClick={() => handleSelectToken(token)}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-800 transition-colors text-left border-b border-slate-800 last:border-0 group"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={token.thumb}
                                                alt={token.name}
                                                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%236366f1'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3E${token.symbol?.charAt(0) || '?'}%3C/text%3E%3C/svg%3E`;
                                                }}
                                            />
                                            <div className="flex-1">
                                                <div className="font-bold text-[15px] text-slate-200 group-hover:text-primary transition-colors">{token.name}</div>
                                                <div className="text-xs text-slate-400 font-mono bg-slate-800 inline-block px-1.5 py-0.5 rounded mt-0.5 border border-slate-700">
                                                    {token.symbol.toUpperCase()}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 md:px-6 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
                        </div>
                        <p className="mt-4 text-muted-foreground animate-pulse">Analyzing tokenomics...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-md mx-auto py-12">
                        <Card className="border-destructive/50 bg-destructive/5">
                            <CardContent className="flex flex-col items-center text-center p-6">
                                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                                <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
                                <p className="text-muted-foreground mb-4">{error}</p>
                                <button
                                    onClick={() => {
                                        setData(null);
                                        setError(null);
                                        setQuery("");
                                    }}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Clear Search
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                ) : data && address ? (
                    <TokenomicsView data={data} address={address} hideAddress={true} />
                ) : (
                    /* Default / Empty State */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-6 text-center">
                                <Activity className="h-12 w-12 mx-auto mb-4 text-secondary" />
                                <h3 className="text-xl font-bold mb-2">Inflation Check</h3>
                                <p className="text-muted-foreground">
                                    Analyze token supply schedules and inflation risks to avoid dilution.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-6 text-center">
                                <PieChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                                <h3 className="text-xl font-bold mb-2">Supply Distribution</h3>
                                <p className="text-muted-foreground">
                                    Visualize circulating vs. locked supply and understand vesting schedules.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-6 text-center">
                                <Search className="h-12 w-12 mx-auto mb-4 text-accent" />
                                <h3 className="text-xl font-bold mb-2">Multi-Chain Analysis</h3>
                                <p className="text-muted-foreground">
                                    Analyze tokens from Ethereum, Solana, BSC, Polygon, and more.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

import { Suspense } from "react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSection } from "@/components/seo/faq-section";
import { RelatedTools } from "@/components/seo/related-tools";
import { tokenomicsFAQs } from "@/lib/seo-content/tokenomics-faq";

const relatedTools = [
    {
        name: "Security Scanner",
        description: "Detect rug pulls, honeypots, and scam tokens before investing",
        href: "/analysis/contract-analyzer",
    },
    {
        name: "Portfolio Tracker",
        description: "Track your crypto holdings and performance across all chains",
        href: "/portfolio",
    },
    {
        name: "Whale Watch",
        description: "Monitor large wallet movements and follow smart money",
        href: "/analysis/whales",
    },
];

export default function AnalyzerPage() {
    return (
        <div className="min-h-screen bg-brand-dark">
            {/* Main content */}
            <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                <AnalyzerContent />
            </Suspense>

            <div className="container mx-auto px-4 md:px-6 py-12 space-y-16">
                {/* FAQ Section */}
                <FAQSection
                    title="Tokenomics Analyzer - Frequently Asked Questions"
                    faqs={tokenomicsFAQs}
                />

                {/* Related Tools */}
                <RelatedTools
                    title="Explore More Crypto Analysis Tools"
                    tools={relatedTools}
                />
            </div>
        </div>
    );
}

// Helper component for hero section stats
function StatPill({ icon, label }: { icon: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            <span>{icon}</span>
            {label}
        </span>
    );
}

