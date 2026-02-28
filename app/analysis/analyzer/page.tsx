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
    }, [query]);

    // Ephemeral URL parameter handling  
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            fetchTokenomicsData(q);
            // Clear URL without reloading
            window.history.replaceState(null, "", "/analyzer");
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
            {/* Header / Hero Section */}
            <div className="mb-8 text-center max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Tokenomics Analyzer
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg mb-8">
                    Deep dive into any token&apos;s economy. Analyze inflation, supply distribution, and safety scores instantly.
                </p>

                <Card className="bg-background/50 backdrop-blur border-primary/20 shadow-lg glow-card">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center gap-4">
                            <label className="text-sm font-medium text-muted-foreground">
                                Search Tokens from All Blockchains
                            </label>

                            {/* Token Search */}
                            <div className="relative w-full max-w-xl">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-2.5 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            setSelectedToken(null);
                                        }}
                                        placeholder="Search any token (Bitcoin, Solana, etc...)"
                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-base focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Search Results Dropdown */}
                                {showResults && searchResults.length > 0 && (
                                    <div className="absolute z-20 w-full mt-2 bg-card border border-border rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                        {searchResults.map((token) => (
                                            <button
                                                key={token.id}
                                                type="button"
                                                onClick={() => handleSelectToken(token)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={token.thumb}
                                                    alt={token.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <div className="font-medium">{token.name}</div>
                                                    <div className="text-sm text-gray-400">
                                                        {token.symbol.toUpperCase()}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {isSearching && (
                                    <div className="absolute right-3 top-3">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
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
        href: "/scan",
    },
    {
        name: "Portfolio Tracker",
        description: "Track your crypto holdings and performance across all chains",
        href: "/portfolio",
    },
    {
        name: "Whale Watch",
        description: "Monitor large wallet movements and follow smart money",
        href: "/whales",
    },
];

export default function AnalyzerPage() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8 space-y-12">
                {/* Breadcrumbs */}
                <Breadcrumbs items={[{ label: "Tokenomics Analyzer" }]} />

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

