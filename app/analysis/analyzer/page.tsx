"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    Search, Loader2, TrendingUp, PieChart, Activity,
    AlertCircle, Zap, Shield, BarChart3, Layers,
    ChevronRight, Info, ArrowRight
} from "lucide-react";
import { searchTokens } from "@/lib/coingecko";
import { TokenSearchResult } from "@/types";
import { TokenomicsView } from "@/components/tokenomics/tokenomics-view";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSection } from "@/components/seo/faq-section";
import { RelatedTools } from "@/components/seo/related-tools";
import { tokenomicsFAQs } from "@/lib/seo-content/tokenomics-faq";
import Link from "next/link";
import type { ApiResponse, TokenomicsAnalysis } from "@/types";

// ─── Feature cards for empty state ─────────────────────────────────────────────
const FEATURES = [
    {
        icon: <Activity className="w-6 h-6" />,
        title: "Inflation Analysis",
        desc: "Analyze supply schedules and inflation risks to avoid dilution before it's priced in.",
        color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
        iconColor: "text-emerald-400",
        glow: "group-hover:shadow-emerald-500/20",
    },
    {
        icon: <PieChart className="w-6 h-6" />,
        title: "Supply Distribution",
        desc: "Visualize circulating vs. locked vs. unvested supply with precision progress tracking.",
        color: "from-blue-500/20 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
        iconColor: "text-blue-400",
        glow: "group-hover:shadow-blue-500/20",
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Volume Metrics",
        desc: "Deep liquidity scoring, 24h volume momentum, and real market cap vs FDV ratios.",
        color: "from-purple-500/20 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40",
        iconColor: "text-purple-400",
        glow: "group-hover:shadow-purple-500/20",
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Risk Score",
        desc: "Composite risk scoring across inflation, liquidity, and holder concentration metrics.",
        color: "from-rose-500/20 to-rose-500/5 border-rose-500/20 hover:border-rose-500/40",
        iconColor: "text-rose-400",
        glow: "group-hover:shadow-rose-500/20",
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "ATH / ATL Tracker",
        desc: "Benchmark current price against all-time highs and lows to assess recovery potential.",
        color: "from-amber-500/20 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
        iconColor: "text-amber-400",
        glow: "group-hover:shadow-amber-500/20",
    },
    {
        icon: <Layers className="w-6 h-6" />,
        title: "Multi-Chain Support",
        desc: "Tokens from Ethereum, Solana, BSC, Polygon, Base, and 50+ chains — all in one place.",
        color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40",
        iconColor: "text-cyan-400",
        glow: "group-hover:shadow-cyan-500/20",
    },
];

// ─── Popular tokens quick-launch ───────────────────────────────────────────────
const POPULAR = [
    { id: "bitcoin", symbol: "BTC", label: "Bitcoin" },
    { id: "ethereum", symbol: "ETH", label: "Ethereum" },
    { id: "solana", symbol: "SOL", label: "Solana" },
    { id: "pepe", symbol: "PEPE", label: "Pepe" },
    { id: "bonk", symbol: "BONK", label: "Bonk" },
    { id: "chainlink", symbol: "LINK", label: "Chainlink" },
];

// ─── Related tools ──────────────────────────────────────────────────────────────
const relatedTools = [
    {
        name: "Security Scanner",
        description: "Detect rug pulls, honeypots, and scam tokens before investing",
        href: "/analysis/contract-analyzer",
    },
    {
        name: "Whale Watch",
        description: "Monitor large wallet movements and follow smart money",
        href: "/analysis/whales",
    },
    {
        name: "Trench Hunter",
        description: "Real-time micro-cap spike detector with velocity scoring",
        href: "/discovery/spike-detector",
    },
];

// ─── Main inner component (uses searchParams — must be wrapped in Suspense) ────
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

    const searchWrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Debounced search
    useEffect(() => {
        if (selectedToken && query === selectedToken.name) return;
        const timer = setTimeout(async () => {
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
        return () => clearTimeout(timer);
    }, [query, selectedToken]);

    // Handle URL param ?q=
    useEffect(() => {
        const q = searchParams.get("q");
        if (q && q !== address) {
            fetchTokenomicsData(q);
        }
    }, [searchParams, address]);

    const fetchTokenomicsData = async (tokenId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/tokenomics?tokenId=${tokenId}`);
            const result: ApiResponse<TokenomicsAnalysis> = await response.json();
            if (result.success && result.data) {
                setData(result.data);
                setAddress(tokenId);
            } else {
                setError(result.error || "Failed to fetch tokenomics data");
                setData(null);
            }
        } catch {
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
        // Update URL without full reload
        window.history.pushState(null, "", `/analysis/analyzer?q=${token.id}`);
        await fetchTokenomicsData(token.id);
    };

    const handleClear = () => {
        setData(null);
        setError(null);
        setQuery("");
        setSelectedToken(null);
        setAddress(null);
        window.history.pushState(null, "", "/analysis/analyzer");
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20">

            {/* ═══════════ HERO ═══════════ */}
            <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-16">
                {/* Ambient glow blobs */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-600/15 blur-[130px]" />
                    <div className="absolute right-1/4 top-10 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[110px]" />
                    <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/12 blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">

                        {/* Live Badge */}
                        <div className="inline-flex items-center gap-2 mb-5 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-cyan-400 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            Tokenomics Intelligence Engine
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        </div>

                        {/* Headline */}
                        <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
                            Tokenomics{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Analyzer
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            X-ray any token&apos;s economy.{" "}
                            <span className="font-semibold text-slate-200">
                                Inflation risk, supply distribution, unlock schedules
                            </span>{" "}
                            and real-time market data — all in seconds.
                        </p>

                        {/* Stat pills */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                            {[
                                { icon: "📊", label: "Unlock Schedules" },
                                { icon: "📈", label: "Inflation Tracking" },
                                { icon: "⚠️", label: "Risk Scoring" },
                                { icon: "🔗", label: "50+ Chains" },
                            ].map(({ icon, label }) => (
                                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300 backdrop-blur-sm">
                                    <span>{icon}</span> {label}
                                </span>
                            ))}
                        </div>

                        {/* ── Search Box ── */}
                        <div ref={searchWrapperRef} className="mt-10 mx-auto w-full max-w-2xl relative text-left z-50">
                            {/* Glow ring */}
                            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 blur opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                            <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
                                {isSearching
                                    ? <Loader2 className="absolute left-4 w-5 h-5 text-cyan-400 animate-spin" />
                                    : <Search className="absolute left-4 w-5 h-5 text-slate-500 pointer-events-none" />
                                }
                                <input
                                    id="token-search-input"
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setSelectedToken(null); }}
                                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                    onKeyDown={(e) => { if (e.key === "Escape") setShowResults(false); }}
                                    placeholder="Search by token name, e.g. Ethereum, PEPE, BONK…"
                                    className="w-full bg-transparent pl-12 pr-4 py-4 text-slate-100 text-[15px] focus:outline-none placeholder:text-slate-500 transition-all"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                {query && (
                                    <button onClick={handleClear} className="absolute right-4 text-slate-500 hover:text-white transition-colors text-lg">✕</button>
                                )}
                            </div>

                            {/* Search dropdown */}
                            {showResults && searchResults.length > 0 && (
                                <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-slate-700/60 bg-slate-900/98 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Results via CoinGecko</span>
                                        <button onClick={() => setShowResults(false)} className="text-slate-600 hover:text-slate-400 text-xs">✕</button>
                                    </div>
                                    <ul className="max-h-72 overflow-y-auto">
                                        {searchResults.map((token, idx) => (
                                            <li key={token.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectToken(token)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group/item"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={token.thumb}
                                                        alt={token.name}
                                                        className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0"
                                                        onError={(e) => {
                                                            const t = e.target as HTMLImageElement;
                                                            t.onerror = null;
                                                            t.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2306b6d4'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dy='.3em'%3E${token.symbol?.charAt(0) || '?'}%3C/text%3E%3C/svg%3E`;
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-sm text-slate-200 group-hover/item:text-white transition-colors truncate">{token.name}</div>
                                                        <div className="text-xs text-slate-500 font-mono mt-0.5">{token.symbol?.toUpperCase()}</div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover/item:text-cyan-400 transition-colors flex-shrink-0" />
                                                </button>
                                                {idx < searchResults.length - 1 && <div className="mx-4 h-px bg-slate-800" />}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Popular tokens */}
                        {!data && !loading && (
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                                <span className="text-xs text-slate-600 mr-1">Popular:</span>
                                {POPULAR.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setQuery(t.label);
                                            window.history.pushState(null, "", `/analysis/analyzer?q=${t.id}`);
                                            fetchTokenomicsData(t.id);
                                            setSelectedToken(null);
                                            setShowResults(false);
                                        }}
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
                                    >
                                        {t.symbol}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ── Inline Results (Loading / Error / Data) ── */}
                        {loading && (
                            <div className="mt-10 flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
                                    <div className="relative w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                                        <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm animate-pulse">Fetching tokenomics data…</p>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    {["Pulling market data", "Analyzing supply", "Scoring risks"].map((s) => (
                                        <span key={s} className="text-xs text-slate-600 bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded-full">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="mt-10 max-w-md mx-auto py-10 text-center">
                                <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-7 h-7 text-rose-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Analysis Failed</h3>
                                <p className="text-slate-400 text-sm mb-5">{error}</p>
                                <button
                                    onClick={handleClear}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
                                >
                                    <Search className="w-4 h-4" /> Try another token
                                </button>
                            </div>
                        )}

                        {data && address && !loading && (
                            <div className="mt-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <button
                                    onClick={handleClear}
                                    className="mb-5 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors group"
                                >
                                    <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                                    New search
                                </button>
                                <TokenomicsView data={data} address={address} hideAddress={true} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!data && !loading && !error && (
                <div className="container mx-auto px-4 md:px-6 mt-10 min-h-[400px]">
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <p className="text-center text-xs font-bold tracking-widest uppercase text-slate-600 mb-8">
                            What you get
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                            {FEATURES.map(({ icon, title, desc, color, iconColor, glow }) => (
                                <div
                                    key={title}
                                    className={`group relative p-6 rounded-2xl bg-gradient-to-br border backdrop-blur-sm hover:scale-[1.02] transition-all duration-200 cursor-default shadow-lg hover:shadow-xl ${color} ${glow}`}
                                >
                                    <div className={`mb-4 ${iconColor}`}>{icon}</div>
                                    <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* How it works strip */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 mb-6">
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
                                <Info className="h-4 w-4 text-cyan-400" />
                                How It Works
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { n: "1", title: "Search Any Token", body: "Type a token name or symbol above. Powered by CoinGecko's 13,000+ token index." },
                                    { n: "2", title: "Fetch Live Data", body: "We pull price history, supply, FDV, volume, holder stats and vesting schedules in real-time." },
                                    { n: "3", title: "Read Your Report", body: "A full tokenomics dashboard loads with risk score, charts, and actionable insights." },
                                ].map(({ n, title, body }) => (
                                    <div key={n} className="flex gap-3">
                                        <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-xs font-black text-cyan-400 flex-shrink-0 mt-0.5">
                                            {n}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-200 mb-1">{title}</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Page export ────────────────────────────────────────────────────────────────
export default function AnalyzerPage() {
    return (
        <div className="min-h-screen bg-brand-dark">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
            }>
                <AnalyzerContent />
            </Suspense>

            <div className="container mx-auto px-4 md:px-6 py-12 space-y-16">
                <FAQSection
                    title="Tokenomics Analyzer — Frequently Asked Questions"
                    faqs={tokenomicsFAQs}
                />
                <RelatedTools
                    title="Explore More Crypto Analysis Tools"
                    tools={relatedTools}
                />
            </div>
        </div>
    );
}
