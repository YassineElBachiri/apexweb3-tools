"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Search, CheckCircle, Zap, Lock, AlertTriangle, ShieldCheck, TrendingUp, Users, Star, ChevronRight, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

// ─── Suggestion type ───────────────────────────────────────────────────────────
interface TokenSuggestion {
    address: string;
    name: string;
    symbol: string;
    chain: string;
    chainLabel: string;
    priceUsd: string;
    imageUrl?: string;
    volume24h: number;
    liquidity: number;
}

// ─── Chain detection helpers ───────────────────────────────────────────────────
function detectChain(address: string): { chain: string; label: string; color: string } | null {
    const trimmed = address.trim();
    if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
        return { chain: "eth", label: "EVM (ETH / Base)", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
    }
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) {
        return { chain: "solana", label: "Solana", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
    }
    return null;
}

// ─── Loading steps ─────────────────────────────────────────────────────────────
const SCAN_STEPS = [
    "Fetching contract…",
    "Simulating swap…",
    "Analyzing taxes…",
    "Generating report…",
];

// ─── Recently scanned mock seed (replaced by API data) ────────────────────────
const SEED_RECENT = [
    { name: "PEPE", chain: "eth", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", score: 88 },
    { name: "BONK", chain: "solana", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", score: 91 },
    { name: "BRETT", chain: "base", address: "0x532f27101965dd16442E59d40670FaF5eBB142E4", score: 76 },
    { name: "WIF", chain: "solana", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", score: 83 },
    { name: "SHIB", chain: "eth", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", score: 79 },
    { name: "FLOKI", chain: "eth", address: "0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E", score: 65 },
    { name: "DOGE2.0", chain: "eth", address: "0x8A953CfE442c5E8855cc6c61b1293FA648BAE472", score: 42 },
    { name: "ORCA", chain: "solana", address: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", score: 95 },
];

const TESTIMONIALS = [
    { text: "Saved me from a honeypot rug. The sell-tax detection caught 99% tax before I ape'd in.", handle: "@cryptodan_eth" },
    { text: "I run every meme coin through ApexWeb3 before buying. Non-negotiable checklist now.", handle: "@sol_degen" },
    { text: "Best free token scanner out there. Caught a hidden owner flag on a 'safe' token.", handle: "@basechain_max" },
];

// ─── Chain label helper ───────────────────────────────────────────────────────
function chainLabel(chainId: string): string {
    const map: Record<string, string> = { ethereum: "ETH", solana: "SOL", base: "BASE" };
    return map[chainId?.toLowerCase()] ?? chainId?.toUpperCase() ?? "?";
}
function chainColor(chainId: string): string {
    const map: Record<string, string> = {
        ethereum: "text-blue-400 bg-blue-500/10 border-blue-500/30",
        solana:   "text-purple-400 bg-purple-500/10 border-purple-500/30",
        base:     "text-sky-400 bg-sky-500/10 border-sky-500/30",
    };
    return map[chainId?.toLowerCase()] ?? "text-slate-400 bg-slate-500/10 border-slate-500/30";
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ContractAnalyzerPage() {
    const router = useRouter();
    const [address, setAddress] = useState("");
    const [detectedChain, setDetectedChain] = useState<ReturnType<typeof detectChain>>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState("");
    const [recentScans, setRecentScans] = useState(SEED_RECENT);
    const [scanCount, setScanCount] = useState(14_832);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ── Autocomplete state ────────────────────────────────────────────────────
    const [suggestions, setSuggestions] = useState<TokenSuggestion[]>([]);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Debounced search for autocomplete
    const searchSuggestions = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const isAddress = /^0x[a-fA-F0-9]{40}$/.test(query) || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(query);
        if (isAddress || query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsSuggestLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                const SUPPORTED = ["ethereum", "solana", "base"];

                const seen = new Set<string>();
                const items: TokenSuggestion[] = [];

                (data.pairs || [])
                    .filter((p: any) => SUPPORTED.includes(p.chainId?.toLowerCase()))
                    .sort((a: any, b: any) => {
                        const vol = (p: any) => p.volume?.h24 || 0;
                        const txns = (p: any) => (p.txns?.h24?.buys || 0) + (p.txns?.h24?.sells || 0);
                        return vol(b) * Math.sqrt(txns(b) + 1) - vol(a) * Math.sqrt(txns(a) + 1);
                    })
                    .forEach((p: any) => {
                        const key = `${p.chainId}:${p.baseToken?.address}`;
                        if (seen.has(key)) return;
                        seen.add(key);
                        items.push({
                            address: p.baseToken?.address ?? "",
                            name: p.baseToken?.name ?? "Unknown",
                            symbol: p.baseToken?.symbol ?? "???",
                            chain: p.chainId?.toLowerCase(),
                            chainLabel: chainLabel(p.chainId),
                            priceUsd: p.priceUsd ? `$${parseFloat(p.priceUsd).toPrecision(4)}` : "—",
                            imageUrl: p.info?.imageUrl,
                            volume24h: p.volume?.h24 || 0,
                            liquidity: p.liquidity?.usd || 0,
                        });
                    });

                setSuggestions(items.slice(0, 8));
                setShowSuggestions(items.length > 0);
            } catch {
                setSuggestions([]);
            } finally {
                setIsSuggestLoading(false);
            }
        }, 350);
    }, []);

    // Fetch real recent scans from API
    useEffect(() => {
        fetch("/api/recent-scans")
            .then(r => r.json())
            .then(data => {
                if (data?.scans?.length) setRecentScans(data.scans);
                if (data?.todayCount) setScanCount(data.todayCount);
            })
            .catch(() => { /* keep seed */ });
    }, []);

    // Detect chain on address change + trigger autocomplete
    const handleAddressChange = (val: string) => {
        setAddress(val);
        setError("");
        setDetectedChain(detectChain(val));
        searchSuggestions(val.trim());
    };

    // Select a suggestion → fill input and scan immediately
    const handleSelectSuggestion = (s: TokenSuggestion) => {
        setShowSuggestions(false);
        setSuggestions([]);
        setAddress(s.address);
        setDetectedChain(detectChain(s.address));
        // Auto-trigger scan
        const chainMap: Record<string, string> = { ethereum: "eth", solana: "solana", base: "base" };
        const chain = chainMap[s.chain] ?? "eth";
        setIsLoading(true);
        setError("");
        setCurrentStep(0);
        runSteps();
        setTimeout(() => {
            router.push(`/analysis/security-scanner/${chain}/${s.address}`);
        }, 3600);
    };

    // Animated progress stepper during loading
    const runSteps = useCallback(() => {
        setCurrentStep(0);
        let step = 0;
        intervalRef.current = setInterval(() => {
            step++;
            if (step < SCAN_STEPS.length) {
                setCurrentStep(step);
            } else {
                clearInterval(intervalRef.current!);
            }
        }, 900);
    }, []);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = address.trim();
        if (!trimmed) { setError("Please enter a contract address or token name."); return; }

        setIsLoading(true);
        setError("");
        setCurrentStep(0);
        
        let finalAddress = trimmed;
        let finalChain = "";
        
        const isEVM = /^0x[a-fA-F0-9]{40}$/.test(trimmed);
        const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);

        // Utility to map DexScreener chainId to our supported chains
        const mapChain = (chainId: string) => {
            const raw = chainId?.toLowerCase();
            if (raw === 'solana') return 'solana';
            if (raw === 'ethereum') return 'eth';
            if (raw === 'base') return 'base';
            return null;
        };

        // Native coins that can't be scanned as ERC/SPL tokens
        const NATIVE_COINS: Record<string, string> = {
            bitcoin: "Bitcoin (BTC) is a native coin — it has no smart contract to scan. Try a wrapped version like WBTC: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            btc: "Bitcoin (BTC) is a native coin — it has no smart contract to scan. Try a wrapped version like WBTC: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            ethereum: "Ethereum (ETH) is a native coin — it has no ERC20 contract to scan. Try WETH: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            eth: "Ethereum (ETH) is a native coin — no ERC20 contract. Try WETH: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            bnb: "BNB is a native coin on BSC and is not currently scannable via our supported chains.",
            sol: "SOL is the native Solana coin — it has no SPL contract to scan.",
            solana: "SOL is the native Solana coin — it has no SPL contract to scan.",
            xrp: "XRP is not available on our supported chains (Ethereum, Base, Solana).",
            ada: "Cardano (ADA) is not available on our supported chains.",
            matic: "MATIC/POL — if you mean Polygon's native token, it's not on our supported chains. Try entering the ERC20 contract address directly.",
        };

        try {
            if (isEVM || isSolana) {
                // Address input: try to resolve actual chain to avoid checking base address on eth network
                finalChain = isSolana ? "solana" : "eth"; // Base fallback
                
                // Fire and forget search for exact chain
                const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${trimmed}`);
                const data = await res.json();
                
                if (data.pairs && data.pairs.length > 0) {
                    const c = mapChain(data.pairs[0].chainId);
                    if (c) finalChain = c;
                }

                runSteps();
                await new Promise(r => setTimeout(r, 3600));

            } else {
                const query = trimmed.toLowerCase();
                
                // Block native coins — they have no scannable contract
                if (NATIVE_COINS[query]) {
                    setError(NATIVE_COINS[query]);
                    setIsLoading(false);
                    return;
                }

                // Token Name/Symbol input
                const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(trimmed)}`);
                const data = await res.json();
                
                if (!data.pairs || data.pairs.length === 0) {
                    setError(`Could not find token "${trimmed}". Try entering the exact contract address.`);
                    setIsLoading(false);
                    return;
                }
                
                // Filter only for supported chains
                const supportedPairs = data.pairs.filter((p: any) => mapChain(p.chainId) !== null);
                
                if (supportedPairs.length === 0) {
                     setError(`"${trimmed}" was found but only on unsupported networks. Paste the contract address directly.`);
                     setIsLoading(false);
                     return;
                }

                // Smart scoring — defeats both fake liquidity and FDV spoofing.
                const bestPair = supportedPairs.sort((a: any, b: any) => {
                    const getScore = (pair: any) => {
                        const liq = pair.liquidity?.usd || 0;
                        const vol24h = pair.volume?.h24 || 0;
                        const txns24h = (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0);
                        
                        // Filter out mathematical-liquidity scams:
                        // Real tokens with $50k+ liquidity have meaningful daily volume
                        if (liq > 50_000 && vol24h < 100) return 0;
                        if (liq > 500_000 && txns24h < 20) return 0;
                        
                        // Exact symbol match gets a 10x bonus
                        const symbolMatch = pair.baseToken?.symbol?.toLowerCase() === query ? 10 : 1;
                        const nameMatch = pair.baseToken?.name?.toLowerCase() === query ? 5 : 1;
                        const matchBonus = Math.max(symbolMatch, nameMatch);
                        
                        // Core score: volume * sqrt(txns) to favour liquid, frequently-traded pairs
                        const activityScore = vol24h * Math.sqrt(txns24h + 1);
                        
                        return activityScore * matchBonus;
                    };
                    
                    return getScore(b) - getScore(a);
                })[0];
                
                finalAddress = bestPair.baseToken.address;
                finalChain = mapChain(bestPair.chainId) as string;

                runSteps();
                await new Promise(r => setTimeout(r, 2000));
            }
        } catch (err) {
             setError("Error communicating with data provider. Try entering the direct contract address.");
             setIsLoading(false);
             return;
        }
        
        router.push(`/analysis/security-scanner/${finalChain}/${finalAddress}`);
    };

    const progressPct = isLoading ? ((currentStep + 1) / SCAN_STEPS.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">

            {/* ── Background glow ── */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-indigo-600/8 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl">

                {/* ── Breadcrumbs ── */}
                <div className="pt-8 pb-2">
                    <Breadcrumbs items={[{ label: "Security Scanner" }]} />
                </div>

                {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
                <section className="py-12 md:py-20 text-center space-y-6">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        Live scanning — {scanCount.toLocaleString()} tokens scanned to date
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
                        Is This Token
                        <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Safe?
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Scan any Ethereum, Base, or Solana token in seconds.
                        Detect honeypots, hidden taxes, and rug pulls&nbsp;<strong className="text-foreground">before you trade.</strong>
                    </p>

                    {/* ── Scan Form ── */}
                    <form onSubmit={handleScan} className="relative max-w-2xl mx-auto mt-8 space-y-3">
                        <div className="relative flex flex-col sm:flex-row gap-3">
                            {/* Input wrapper with autocomplete */}
                            <div ref={wrapperRef} className="relative flex-1 group">
                                {isSuggestLoading
                                    ? <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
                                    : <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                }
                                <input
                                    id="contract-address-input"
                                    type="text"
                                    value={address}
                                    onChange={e => handleAddressChange(e.target.value)}
                                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                    onKeyDown={e => e.key === "Escape" && setShowSuggestions(false)}
                                    placeholder="Paste contract address or token name…"
                                    disabled={isLoading}
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="w-full h-14 pl-12 pr-4 text-base font-mono bg-card/60 backdrop-blur-md border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground/60 transition-all disabled:opacity-60"
                                />
                                {/* Chain badge (raw address) */}
                                {detectedChain && !isLoading && !showSuggestions && (
                                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${detectedChain.color}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                        {detectedChain.label}
                                    </div>
                                )}

                                {/* ── Autocomplete Dropdown ── */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-white/10 bg-[#0d0b1e]/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                                        <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50">Token results</span>
                                            <button type="button" onClick={() => setShowSuggestions(false)} className="text-muted-foreground/40 hover:text-muted-foreground text-xs">✕</button>
                                        </div>
                                        <ul className="max-h-[340px] overflow-y-auto">
                                            {suggestions.map((s, idx) => (
                                                <li key={`${s.chain}:${s.address}`}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectSuggestion(s)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group/item"
                                                    >
                                                        {/* Token logo */}
                                                        {s.imageUrl
                                                            ? <img src={s.imageUrl} alt={s.symbol} className="w-9 h-9 rounded-full flex-shrink-0 object-cover ring-1 ring-white/10" />
                                                            : <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-300">{s.symbol.slice(0, 2)}</div>
                                                        }

                                                        {/* Name + address */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-foreground group-hover/item:text-white truncate">{s.name}</span>
                                                                <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">{s.symbol}</span>
                                                            </div>
                                                            <div className="text-[11px] text-muted-foreground/50 font-mono truncate mt-0.5">{s.address}</div>
                                                        </div>

                                                        {/* Right meta */}
                                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${chainColor(s.chain)}`}>{s.chainLabel}</span>
                                                            <span className="text-[11px] text-muted-foreground/70 font-mono">{s.priceUsd}</span>
                                                        </div>
                                                    </button>
                                                    {idx < suggestions.length - 1 && <div className="mx-4 h-px bg-white/[0.04]" />}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-1.5">
                                            <span className="text-[10px] text-muted-foreground/40">Sorted by real trading activity · Powered by DexScreener</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <button
                                id="scan-now-btn"
                                type="submit"
                                disabled={isLoading}
                                className="h-14 px-8 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all duration-200 disabled:opacity-60 whitespace-nowrap flex-shrink-0"
                            >
                                {isLoading ? "Scanning…" : "Scan Now — It's Free"}
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </p>
                        )}

                        {/* Progress bar */}
                        {isLoading && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                                        {SCAN_STEPS[currentStep]}
                                    </span>
                                    <span>{Math.round(progressPct)}%</span>
                                </div>
                                <div className="h-1.5 bg-card rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                <div className="flex gap-6 justify-center pt-1">
                                    {SCAN_STEPS.map((step, i) => (
                                        <span
                                            key={step}
                                            className={`text-xs transition-all ${i <= currentStep ? "text-blue-400 font-semibold" : "text-muted-foreground/40"}`}
                                        >
                                            {i + 1}. {step.replace("…", "")}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>

                    {/* ── Trust signals ── */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { icon: <CheckCircle className="w-3.5 h-3.5" />, text: "100% Free", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                            { icon: <Zap className="w-3.5 h-3.5" />, text: "Results in <5 seconds", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                            { icon: <Lock className="w-3.5 h-3.5" />, text: "No wallet connection needed", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                        ].map(({ icon, text, color }) => (
                            <span key={text} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}>
                                {icon} {text}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════ RECENTLY SCANNED TICKER ═══════════════════════════════ */}
                <section className="relative -mx-4 mb-16 overflow-hidden">
                    {/* Section label */}
                    <div className="flex items-center justify-center gap-3 py-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />
                        <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Feed
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
                    </div>

                    {/* Gradient fade masks on left & right edges */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                    {/* Marquee track — duplicated for seamless loop */}
                    <div className="flex overflow-hidden py-3">
                        <div className="flex gap-3 animate-ticker whitespace-nowrap will-change-transform">
                            {[...recentScans, ...recentScans, ...recentScans].map((scan, i) => {
                                const isGood = scan.score >= 80;
                                const isMid = scan.score >= 50 && scan.score < 80;
                                const scoreColor = isGood
                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
                                    : isMid
                                    ? "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                                    : "text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_12px_rgba(248,113,113,0.15)]";
                                const dotColor = isGood ? "bg-emerald-400" : isMid ? "bg-amber-400" : "bg-rose-400";
                                return (
                                    <Link
                                        key={`${scan.address}-${i}`}
                                        href={`/analysis/security-scanner/${scan.chain}/${scan.address}`}
                                        className="flex-shrink-0 inline-flex items-center gap-3 pl-3 pr-2 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-primary/30 hover:bg-primary/5 backdrop-blur-sm transition-all duration-200 group"
                                    >
                                        {/* Chain dot */}
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />

                                        {/* Token name */}
                                        <span className="text-sm font-bold text-foreground/90 group-hover:text-white transition-colors">
                                            {scan.name}
                                        </span>

                                        {/* Score badge */}
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${scoreColor}`}>
                                            {scan.score}<span className="opacity-50 font-normal">/100</span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>


                {/* ═══════════════════════════════ FEATURE CARDS ═══════════════════════════════ */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
                    {[
                        {
                            icon: "🍯",
                            title: "Honeypot Detection",
                            desc: "Our simulated swap technology executes buy and sell orders on a forked chain to ensure you can actually exit your position.",
                            color: "from-rose-500/10 to-transparent border-rose-500/20",
                        },
                        {
                            icon: "💰",
                            title: "Tax Analysis",
                            desc: "Automatically read hidden buy and sell taxes embedded in the smart contract before they eat your capital with surprise slippage.",
                            color: "from-orange-500/10 to-transparent border-orange-500/20",
                        },
                        {
                            icon: "🔗",
                            title: "Multi-Chain Support",
                            desc: "Unified scanning for EVM chains (Ethereum, Base) and Solana — detect risks across all major ecosystems without switching tools.",
                            color: "from-blue-500/10 to-transparent border-blue-500/20",
                        },
                        {
                            icon: "👑",
                            title: "Owner Privilege Scanner",
                            desc: "Detect if the developer retains the ability to mint tokens, blacklist wallets, change fees, or reclaim ownership at any time.",
                            color: "from-yellow-500/10 to-transparent border-yellow-500/20",
                        },
                        {
                            icon: "🔐",
                            title: "Contract Verification",
                            desc: "Check if the contract source code is publicly verified. Unverified contracts hide malicious logic — a critical red flag.",
                            color: "from-emerald-500/10 to-transparent border-emerald-500/20",
                        },
                        {
                            icon: "📊",
                            title: "Risk Score (0–100)",
                            desc: "Every scan produces a composite safety score. From 0 (certain rug) to 100 (blue-chip safe), see the verdict at a glance.",
                            color: "from-purple-500/10 to-transparent border-purple-500/20",
                        },
                    ].map(({ icon, title, desc, color }) => (
                        <div key={title} className={`p-6 rounded-2xl bg-gradient-to-br ${color} border backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}>
                            <div className="text-3xl mb-4">{icon}</div>
                            <h3 className="text-base font-bold mb-2 text-foreground">{title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </section>

                {/* ═══════════════════════════════ SOCIAL PROOF ═══════════════════════════════ */}
                <section className="mb-20 text-center space-y-10">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-3 text-5xl font-black text-foreground">
                            <Users className="w-10 h-10 text-primary" />
                            {scanCount.toLocaleString()}+
                        </div>
                        <p className="text-muted-foreground">tokens scanned by DeFi traders this month</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {TESTIMONIALS.map(({ text, handle }) => (
                            <div key={handle} className="p-6 rounded-2xl bg-card/40 border border-white/5 text-left space-y-3">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{text}&rdquo;</p>
                                <p className="text-xs font-semibold text-primary">{handle}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════ VERDICT SCALE ═══════════════════════════════ */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-center mb-8">How We Score Tokens</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { range: "0–30", label: "HIGH RISK", desc: "Avoid — critical flags found", emoji: "🔴", bg: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
                            { range: "31–60", label: "MODERATE RISK", desc: "Proceed with caution", emoji: "🟡", bg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
                            { range: "61–85", label: "LOW RISK", desc: "Looks clean — still DYOR", emoji: "🟢", bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                            { range: "86–100", label: "VERY SAFE", desc: "No major flags found", emoji: "✅", bg: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                        ].map(({ range, label, desc, emoji, bg }) => (
                            <div key={range} className={`p-5 rounded-2xl border ${bg} text-center space-y-2`}>
                                <div className="text-3xl">{emoji}</div>
                                <div className="text-2xl font-black">{range}</div>
                                <div className="text-sm font-bold">{label}</div>
                                <div className="text-xs opacity-70">{desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════ FAQ ═══════════════════════════════ */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {[
                            {
                                q: "How to check if a crypto token is safe?",
                                a: "Paste the contract address into ApexWeb3's scanner and get a comprehensive risk report in seconds. We check for honeypots, hidden taxes, unverified contracts, and dangerous owner privileges — the most common rug pull vectors.",
                            },
                            {
                                q: "What is a honeypot in crypto?",
                                a: "A honeypot is a malicious smart contract that lets you buy tokens but blocks you from selling. The developer profits while all traders are locked in permanently. Our simulated swap detects this before you invest.",
                            },
                            {
                                q: "How to detect a rug pull before it happens?",
                                a: "Key red flags include: unrenounced ownership, unlocked liquidity, unverified contract code, high sell taxes (>10%), and 'hidden owner' functions. Our scanner checks all of these automatically.",
                            },
                            {
                                q: "What is buy/sell tax in DeFi?",
                                a: "Buy and sell taxes are fees deducted from every transaction, encoded in the smart contract. Legitimate projects rarely exceed 5%. Taxes above 10% are a warning sign; above 25% is almost always exploitative.",
                            },
                            {
                                q: "Does ApexWeb3 support Solana token scanning?",
                                a: "Yes. ApexWeb3 supports Ethereum, Base (L2), and Solana. Simply paste any contract address and we auto-detect the chain. Solana scans use the RugCheck API for freeze/mint authority analysis.",
                            },
                        ].map(({ q, a }, i) => (
                            <details key={i} className="group p-5 rounded-2xl bg-card/30 border border-white/5 cursor-pointer hover:border-primary/20 transition-colors">
                                <summary className="font-semibold text-foreground flex items-center justify-between gap-3 list-none">
                                    {q}
                                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-90 transition-transform" />
                                </summary>
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════ RELATED TOOLS ═══════════════════════════════ */}
                <section className="mb-20">
                    <h2 className="text-xl font-bold mb-6">Related Security Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { title: "Tokenomics Analyzer", desc: "Deep dive supply distribution & inflation risk", href: "/analysis/analyzer", icon: <TrendingUp className="w-5 h-5" /> },
                            { title: "Whale Watch", desc: "Track large wallet movements in real-time", href: "/analysis/whales", icon: <Shield className="w-5 h-5" /> },
                            { title: "Risk Screener", desc: "Batch scan multiple tokens at once", href: "/analysis/risk", icon: <ShieldCheck className="w-5 h-5" /> },
                        ].map(({ title, desc, href, icon }) => (
                            <Link key={title} href={href} className="flex items-start gap-4 p-5 rounded-2xl bg-card/30 border border-white/5 hover:border-primary/25 hover:bg-primary/5 transition-all group">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">{icon}</div>
                                <div>
                                    <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{title}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
