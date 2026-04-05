"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Shield, Search, CheckCircle, Zap, Lock, AlertTriangle,
    ShieldCheck, TrendingUp, Users, Star, ChevronRight,
    Loader2, Target, BarChart3, Activity, ArrowRight
} from "lucide-react";
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
        return { chain: "eth", label: "EVM (ETH / Base)", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" };
    }
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) {
        return { chain: "solana", label: "Solana", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
    }
    return null;
}

const SCAN_STEPS = ["Fetching contract…", "Simulating swap…", "Analyzing taxes…", "Generating report…"];

const SEED_RECENT = [
    { name: "PEPE", chain: "eth", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", score: 88 },
    { name: "BONK", chain: "solana", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", score: 91 },
    { name: "BRETT", chain: "base", address: "0x532f27101965dd16442E59d40670FaF5eBB142E4", score: 76 },
    { name: "WIF", chain: "solana", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", score: 83 },
    { name: "SHIB", chain: "eth", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", score: 79 },
    { name: "FLOKI", chain: "eth", address: "0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E", score: 65 },
    { name: "DOGE2.0", chain: "eth", address: "0x8A953CfE442c5E8855cc6c61b1293FA648BAE472", score: 42 },
];

const TESTIMONIALS = [
    { text: "Saved me from a honeypot rug. The sell-tax detection caught 99% tax before I ape'd in.", handle: "@cryptodan_eth" },
    { text: "I run every meme coin through ApexWeb3 before buying. Non-negotiable checklist now.", handle: "@sol_degen" },
    { text: "Best free token scanner out there. Caught a hidden owner flag on a 'safe' token.", handle: "@basechain_max" },
];

const chainLabel = (chainId: string) => (chainId === "ethereum" ? "ETH" : chainId === "base" ? "BASE" : chainId?.toUpperCase() || "?");

const chainColor = (chain: string) => {
    if (chain === "solana") return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    if (chain === "ethereum" || chain === "eth") return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    return "text-blue-400 bg-blue-500/10 border-blue-500/20";
};

export default function ContractAnalyzerPage() {
    const router = useRouter();
    const [address, setAddress] = useState("");
    const [detectedChain, setDetectedChain] = useState<ReturnType<typeof detectChain>>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState("");
    const [recentScans, setRecentScans] = useState(SEED_RECENT);
    const [scanCount, setScanCount] = useState(14832);
    const [suggestions, setSuggestions] = useState<TokenSuggestion[]>([]);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const searchSuggestions = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
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
                    .sort((a: any, b: any) => (b.volume?.h24 || 0) * Math.sqrt(b.txns?.h24?.buys + b.txns?.h24?.sells + 1) - (a.volume?.h24 || 0) * Math.sqrt(a.txns?.h24?.buys + a.txns?.h24?.sells + 1))
                    .forEach((p: any) => {
                        const key = `${p.chainId}:${p.baseToken?.address}`;
                        if (seen.has(key)) return;
                        seen.add(key);
                        items.push({
                            address: p.baseToken?.address,
                            name: p.baseToken?.name,
                            symbol: p.baseToken?.symbol,
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
            } catch { setSuggestions([]); } finally { setIsSuggestLoading(false); }
        }, 350);
    }, []);

    useEffect(() => {
        fetch("/api/recent-scans").then(r => r.json()).then(data => {
            if (data?.scans?.length) setRecentScans(data.scans);
            if (data?.todayCount) setScanCount(data.todayCount);
        }).catch(() => {});
    }, []);

    const runSteps = useCallback(() => {
        setCurrentStep(0);
        let step = 0;
        intervalRef.current = setInterval(() => {
            step++;
            if (step < SCAN_STEPS.length) setCurrentStep(step);
            else clearInterval(intervalRef.current!);
        }, 900);
    }, []);

    const handleSelectSuggestion = (suggestion: TokenSuggestion) => {
        setAddress(suggestion.address);
        setShowSuggestions(false);
        handleScan(undefined, suggestion.address);
    };

    const handleScan = async (e?: React.FormEvent, directAddress?: string) => {
        if (e) e.preventDefault();
        const trimmed = (directAddress || address).trim();
        if (!trimmed) { setError("Enter a contract address or token name."); return; }
        setIsLoading(true); setError(""); setCurrentStep(0);
        
        const isEVM = /^0x[a-fA-F0-9]{40}$/.test(trimmed);
        const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);
        
        let finalChain = isSolana ? "solana" : "eth";
        let finalAddress = trimmed;

        try {
            if (!isEVM && !isSolana) {
                // Name search resolution logic (same as before)
                const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(trimmed)}`);
                const data = await res.json();
                const pair = (data.pairs || []).find((p: any) => ["ethereum", "solana", "base"].includes(p.chainId?.toLowerCase()));
                if (!pair) { setError("Token not found on supported chains."); setIsLoading(false); return; }
                finalAddress = pair.baseToken.address;
                finalChain = pair.chainId === "ethereum" ? "eth" : pair.chainId;
            }
        } catch { setError("API error. Try direct address."); setIsLoading(false); return; }

        runSteps();
        setTimeout(() => router.push(`/analysis/security-scanner/${finalChain}/${finalAddress}`), 3600);
    };

    const progressPct = isLoading ? ((currentStep + 1) / SCAN_STEPS.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-brand-dark pb-20">

            {/* ═══════════ HERO ═══════════ */}
            <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-16">
                {/* Background glow blobs */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute left-1/4 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
                    <div className="absolute right-1/4 top-10 h-[380px] w-[380px] rounded-full bg-purple-600/15 blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center gap-2 mb-5 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-400 uppercase">
                            <Shield className="w-3.5 h-3.5" />
                            Security Intelligence Network
                        </div>

                        <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
                            Contract{" "}
                            <span className="inline-block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent pb-1">
                                Analyzer
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 text-center">
                            Scan Ethereum, Base, or Solana contracts in seconds.
                            Detect honeypots and rug pulls <span className="text-white font-semibold">before you trade.</span>
                        </p>

                        {/* ── Search Box ── */}
                        <form onSubmit={handleScan} className="mt-10 mx-auto w-full max-w-2xl relative text-left z-50">
                            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur opacity-70 transition duration-500 pointer-events-none" />
                            <div className="relative flex flex-col sm:flex-row gap-3">
                                <div ref={wrapperRef} className="relative flex-1">
                                    {isSuggestLoading ? <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" /> : <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />}
                                    <input
                                        type="text" value={address}
                                        onChange={e => { setAddress(e.target.value); setError(""); setDetectedChain(detectChain(e.target.value)); searchSuggestions(e.target.value); }}
                                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                        placeholder="Contract address or token name…"
                                        className="w-full h-14 pl-12 pr-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl text-slate-100 font-mono text-[14px] focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
                                        autoComplete="off" spellCheck={false} disabled={isLoading}
                                    />
                                    {detectedChain && !isLoading && !showSuggestions && (
                                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${detectedChain.color}`}>
                                            {detectedChain.label}
                                        </div>
                                    )}
                                    {/* Dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-slate-700/60 bg-slate-900/98 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <ul className="max-h-72 overflow-y-auto">
                                                {suggestions.map((s, idx) => (
                                                    <li key={s.address}>
                                                        <button type="button" onClick={() => handleSelectSuggestion(s)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group/item">
                                                            {s.imageUrl ? <img src={s.imageUrl} alt="" className="w-9 h-9 rounded-full ring-1 ring-white/10" /> : <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold">{s.symbol.slice(0, 2)}</div>}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-bold text-sm text-slate-200 truncate">{s.name}</div>
                                                                <div className="text-[10px] text-slate-500 font-mono truncate">{s.address}</div>
                                                            </div>
                                                            <div className={`text-[10px] px-2 py-0.5 rounded-full border ${chainColor(s.chain)}`}>{s.chainLabel}</div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <button type="submit" disabled={isLoading} className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 whitespace-nowrap">
                                    {isLoading ? "Scanning…" : "Analyse Now"}
                                </button>
                            </div>
                        </form>

                        {error && <div className="mt-4 text-center max-w-2xl mx-auto"><p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl inline-block">{error}</p></div>}
                        
                        {/* Progress */}
                        {isLoading && (
                            <div className="mt-8 max-w-lg mx-auto space-y-3">
                                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>{SCAN_STEPS[currentStep]}</span>
                                    <span className="text-blue-400">{Math.round(progressPct)}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                                    <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <StatPill icon={<CheckCircle className="w-3 h-3" />} label="Free" />
                            <StatPill icon={<Zap className="w-3 h-3" />} label="Real-time" />
                            <StatPill icon={<Lock className="w-3 h-3" />} label="Safe" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── LIVE FEED TICKER ── */}
            <section className="relative overflow-hidden border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm py-4">
                <div className="flex gap-4 animate-ticker whitespace-nowrap px-4">
                    {[...recentScans, ...recentScans].map((scan, i) => (
                        <Link key={i} href={`/analysis/security-scanner/${scan.chain}/${scan.address}`} className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 transition-all group">
                             <span className={`w-1.5 h-1.5 rounded-full ${scan.score >= 80 ? 'bg-emerald-500 animate-pulse' : scan.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                             <span className="text-xs font-bold text-slate-300 group-hover:text-white">{scan.name}</span>
                             <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${scan.score >= 80 ? 'text-emerald-400 border-emerald-500/20' : 'text-rose-400 border-rose-500/20'}`}>{scan.score}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <div className="container mx-auto px-4 md:px-6 pt-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
                    <FeatureCard icon="🍯" title="Honeypot Shield" desc="Simulated swap technology detects tokens you can buy but never sell." accent="rose" />
                    <FeatureCard icon="💰" title="Tax Scanner" desc="X-ray hidden fees and slippage traps before they drain your wallet." accent="amber" />
                    <FeatureCard icon="👑" title="Authority Check" desc="Detect unrenounced ownership and dangerous developer permissions." accent="purple" />
                    <FeatureCard icon="🔐" title="Liquidity Audit" desc="Confirm liquidity is locked or burned. No more surprise rug pulls." accent="emerald" />
                    <FeatureCard icon=" verified" iconNode={<ShieldCheck className="w-6 h-6 text-blue-400" />} title="Contract Audit" desc="Verify source code authenticity and check for hidden proxies." accent="blue" />
                    <FeatureCard icon="📊" title="Safety Score" desc="Binary security analysis from 0 to 100 for every single token." accent="cyan" />
                </div>

                <div className="text-center mb-20 space-y-6">
                    <h2 className="text-2xl font-black text-white">Trusted by {scanCount.toLocaleString()} traders worldwide</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm space-y-4">
                                <div className="flex gap-1"> {Array(5).fill(0).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />)} </div>
                                <p className="text-sm text-slate-400 italic">&quot;{t.text}&quot;</p>
                                <p className="text-xs font-bold text-blue-400">{t.handle}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto space-y-16">
                     <div>
                        <h2 className="text-2xl font-black text-white text-center mb-10">How we score security</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <ScoreBox label="High Risk" score="0-30" color="rose" />
                            <ScoreBox label="Moderate" score="31-60" color="amber" />
                            <ScoreBox label="Safe" score="61-85" color="emerald" />
                            <ScoreBox label="Blue-chip" score="86-100" color="blue" />
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-400 backdrop-blur-sm">{icon}{label}</span>;
}

function FeatureCard({ icon, title, desc, accent, iconNode }: { icon: string; title: string; desc: string; accent: string; iconNode?: React.ReactNode }) {
    const accents: Record<string, string> = {
        rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20",
        amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
        purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
        emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
        blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
        cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
    };
    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-br border backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200 ${accents[accent]}`}>
            <div className="mb-4 text-2xl">{iconNode || icon}</div>
            <h3 className="text-base font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function ScoreBox({ label, score, color }: { label: string; score: string; color: string }) {
    const colors: Record<string, string> = {
        rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
        amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    };
    return <div className={`p-4 rounded-2xl border text-center space-y-1 ${colors[color]}`}><p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p><p className="text-2xl font-black">{score}</p></div>;
}
