"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, TrendingUp, PieChart, Activity, AlertCircle } from "lucide-react";
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
        <div className="container mx-auto px-4 py-8">
            {/* Redesigned Hero Section */}
            <div className="relative mb-12 text-center max-w-4xl mx-auto pt-8">
                {/* Background decorative elements */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
                    <div className="absolute w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -top-20 opacity-50" />
                    <div className="absolute w-[600px] h-[300px] bg-secondary/10 rounded-full blur-[100px] top-10 opacity-50" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(255,51,102,0.15)]">
                    <TrendingUp className="w-4 h-4" />
                    <span>Real-Time Tokenomics Engine</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                    Tokenomics <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x">Analyzer</span>
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    Deep dive into any token&apos;s economy. Analyze inflation risk, supply distribution, and real-time market data across all major blockchains.
                </p>

                {/* Stat Pills */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <div className="px-4 py-2 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Unlock Schedules</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium text-muted-foreground">Inflation Tracking</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-muted-foreground">Risk Scoring</span>
                    </div>
                </div>

                <Card className="bg-background/40 backdrop-blur-md border-primary/20 shadow-[0_0_40px_rgba(0,0,0,0.3)] glow-card overflow-visible">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col items-center gap-4">
                            {/* Token Search */}
                            <div className="relative w-full max-w-2xl">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                    <div className="relative flex items-center bg-background border border-border rounded-xl">
                                        <Search className="absolute left-4 text-muted-foreground w-5 h-5" />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => {
                                                setQuery(e.target.value);
                                                setSelectedToken(null);
                                            }}
                                            placeholder="Search by token name or paste contract address..."
                                            className="w-full bg-transparent pl-12 pr-12 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all rounded-xl"
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
                                    <div className="absolute z-50 w-full mt-2 bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl max-h-80 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2">
                                        {searchResults.map((token) => (
                                            <button
                                                key={token.id}
                                                type="button"
                                                onClick={() => handleSelectToken(token)}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-primary/10 transition-colors text-left border-b border-border/50 last:border-0"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={token.thumb}
                                                    alt={token.name}
                                                    className="w-10 h-10 rounded-full bg-background-card"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null;
                                                        target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%236366f1'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3E${token.symbol?.charAt(0) || '?'}%3C/text%3E%3C/svg%3E`;
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold text-[15px]">{token.name}</div>
                                                    <div className="text-sm text-primary font-mono bg-primary/10 inline-block px-1.5 rounded mt-0.5">
                                                        {token.symbol.toUpperCase()}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[400px]">
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
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8 space-y-12">
                {/* Main content */}
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <AnalyzerContent />
                </Suspense>

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

