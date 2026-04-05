"use client";

import { useState, useEffect } from "react";
import { WhaleTransaction } from "@/types/whale";
import { getTxUrl } from "@/lib/whales/explorerLinks";
import { shortAddress } from "@/lib/whales/utils";
import {
    Activity, Clock, ExternalLink, RefreshCw, Share2, Search,
    Filter, ArrowRight, Zap, Target, MousePointer2, Info
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FAQSection } from "@/components/seo/faq-section";

const CHAIN_ICONS: Record<string, string> = {
    ethereum: '⟠', bsc: '⬡', base: '🔵', arbitrum: '🔷',
    polygon: '⬟', optimism: '🔴', solana: '◎', avalanche: '🔺',
};

const THRESHOLDS = [
    { lbl: "> $100K", val: 100000 },
    { lbl: "> $500K", val: 500000 },
    { lbl: "> $1M",   val: 1000000 },
    { lbl: "> $10M",  val: 10000000 },
];

const CHAINS = [
    { lbl: "All",      val: "all" },
    { lbl: "Ethereum", val: "ethereum" },
    { lbl: "Base",     val: "base" },
    { lbl: "BSC",      val: "bsc" },
    { lbl: "Solana",   val: "solana" },
    { lbl: "Arbitrum", val: "arbitrum" },
    { lbl: "Polygon",  val: "polygon" },
];

function StatPill({ icon, label }: { icon: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-300 backdrop-blur-sm">
            <span>{icon}</span> {label}
        </span>
    );
}

function getTypeStyle(type: string) {
    if (type === 'mint') return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (type === 'burn') return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
}

export default function WhaleWatchPage() {
    const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);
    const [filter, setFilter] = useState({ min: 500000, chain: 'all' });
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(30);
    const [liveCount, setLiveCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchWhales = async () => {
        try {
            const params = new URLSearchParams({ min: filter.min.toString(), chain: filter.chain });
            const res = await fetch(`/api/whales?${params}`);
            const data = await res.json();
            setTransactions(prev => {
                const existingIds = new Set(prev.map(t => t.id));
                const newOnes = (data.transactions ?? []).filter((t: WhaleTransaction) => !existingIds.has(t.id));
                if (newOnes.length > 0) setLiveCount(c => c + newOnes.length);
                return [...newOnes, ...prev].slice(0, 100);
            });
            setErrorMsg(''); setLoading(false); setCountdown(30);
        } catch (e: any) { setErrorMsg(e.message || "Feed paused"); setLoading(false); }
    };

    useEffect(() => { setLoading(true); setTransactions([]); fetchWhales(); }, [filter]);
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(c => { if (c <= 1) { fetchWhales(); return 30; } return c - 1; });
        }, 1000);
        return () => clearInterval(timer);
    }, [filter]);

    const activeChainsCount = new Set(transactions.map(t => t.chain)).size;

    return (
        <div className="min-h-screen bg-brand-dark pb-20">

            {/* ── HERO ── */}
            <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-16">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute left-1/4 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-cyan-600/15 blur-[120px]" />
                    <div className="absolute right-1/4 top-10 h-[380px] w-[380px] rounded-full bg-purple-600/15 blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="outline" className="mb-5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                            <Zap className="mr-1.5 h-3 w-3 fill-current uppercase tracking-widest" /> Live Analytics Engine
                        </Badge>

                        <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.08]">
                            Whale{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Watch
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
                            Real-time tracker for seven-figure stablecoin movements across <span className="text-white font-semibold flex-wrap">7 major blockchains.</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <StatPill icon="🐋" label="Stablecoins > $100K" />
                            <StatPill icon="📡" label="Direct RPC Feed" />
                            <StatPill icon="⚡" label="No Delay" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:px-6">
                {errorMsg && <div className="mb-6 p-4 max-w-lg mx-auto bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black text-center rounded-2xl">⚠️ {errorMsg}</div>}

                <div className="flex flex-col xl:flex-row gap-8">
                    
                    {/* ── SIDEBAR (FILTERS) ── */}
                    <aside className="xl:w-72 xl:shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                                    <Filter className="w-3.5 h-3.5 text-cyan-400" /> Scanner Filters
                                </h3>
                                
                                <div className="space-y-6">
                                    {/* THRESHOLD */}
                                    <div>
                                        <label className="block text-[9px] font-black uppercase text-slate-600 mb-3 tracking-widest">Min Value USD</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {THRESHOLDS.map(t => (
                                                <button key={t.val} onClick={() => setFilter(f => ({ ...f, min: t.val }))} className={`py-2 text-[10px] font-black rounded-lg border transition-all ${filter.min === t.val ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-slate-800/40 border-slate-700/60 text-slate-500 hover:text-white'}`}>
                                                    {t.lbl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CHAINS */}
                                    <div>
                                        <label className="block text-[9px] font-black uppercase text-slate-600 mb-3 tracking-widest">Blockchain</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {CHAINS.map(c => (
                                                <button key={c.val} onClick={() => setFilter(f => ({ ...f, chain: c.val }))} className={`flex flex-col items-center py-3 text-[10px] font-black rounded-lg border transition-all ${filter.chain === c.val ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-slate-800/40 border-slate-700/60 text-slate-500 hover:text-white'}`}>
                                                    <span className="text-sm mb-1">{CHAIN_ICONS[c.val] || '✦'}</span>
                                                    {c.lbl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500 leading-relaxed italic">
                                <Info className="w-4 h-4 text-slate-600 mb-2" />
                                Whale moves are identified by scanning RPC logs for Transfers exceeding {filter.min / 1000}K on major stablecoin contracts.
                            </section>
                        </div>
                    </aside>

                    {/* ── FEED ── */}
                    <main className="flex-1 min-w-0">
                        {/* Summary Bar */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
                            <div className="flex gap-6 items-center">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-cyan-400" />
                                    <span className="text-[11px] font-black uppercase text-slate-400"><strong className="text-white">{activeChainsCount}</strong> Active Nets</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[11px] font-black uppercase text-slate-400"><strong className="text-emerald-400">{liveCount}</strong> Detections</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 group">
                                <RefreshCw className={`w-3.5 h-3.5 ${countdown <= 5 ? 'animate-spin text-cyan-400' : ''}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Polling in {countdown}s</span>
                            </div>
                        </div>

                        {/* TX Cards */}
                        {loading && transactions.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1,2,3,4,5,6].map(i => <div key={i} className="h-44 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="py-24 text-center space-y-4 bg-slate-900/20 border border-slate-800 rounded-3xl">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto opacity-50"><Search className="w-8 h-8" /></div>
                                <h3 className="text-xl font-black text-white">Quiet in the Trench</h3>
                                <p className="text-sm text-slate-500">No movements found matching the current filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
                                {transactions.map(tx => {
                                    const isExchangeIn = tx.to.type === 'exchange';
                                    const isExchangeOut = tx.from.type === 'exchange';
                                    return (
                                        <div key={tx.id} className="group relative flex flex-col p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/5 overflow-hidden">
                                            {/* Glow Accent */}
                                            <div className={`absolute top-0 left-0 w-1 h-full ${isExchangeIn ? 'bg-rose-500' : isExchangeOut ? 'bg-emerald-500' : 'bg-slate-700'}`} />

                                            {/* Top Line */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm border border-slate-700/60 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">{CHAIN_ICONS[tx.chain]} {tx.chain}</span>
                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-[0.1em] ${getTypeStyle(tx.type)}`}>{tx.type}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-bold">{tx.age}</span>
                                            </div>

                                            {/* Big Value */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                    {tx.amountUSD >= 10_000_000 ? '🦈' : tx.amountUSD >= 1_000_000 ? '🐋' : '🐬'}
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-white leading-none">${(tx.amountUSD / 1_000_000).toFixed(2)}M <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">USD</span></p>
                                                    <p className="text-[11px] font-bold text-slate-500 mt-1">{tx.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} {tx.symbol}</p>
                                                </div>
                                            </div>

                                            {/* Flow */}
                                            <div className="flex items-center gap-3 p-2 bg-slate-950/40 border border-slate-800 rounded-xl mb-4">
                                                <div className="flex-1 min-w-0 text-right">
                                                    <p className={`text-[10px] font-mono truncate ${isExchangeOut ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>{tx.from.label || shortAddress(tx.from.address)}</p>
                                                    <p className="text-[8px] uppercase tracking-widest text-slate-700 font-black">Source</p>
                                                </div>
                                                <ArrowRight className="w-3 h-3 text-slate-700 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-[10px] font-mono truncate ${isExchangeIn ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>{tx.to.label || shortAddress(tx.to.address)}</p>
                                                    <p className="text-[8px] uppercase tracking-widest text-slate-700 font-black">Receiver</p>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-end gap-1 pt-4 border-t border-slate-800 mt-auto opacity-40 group-hover:opacity-100 transition-opacity">
                                                <a href={getTxUrl(tx.chain, tx.hash)} target="_blank" className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                                                <Link href={`/analysis/whales/wallet/${tx.from.address}`} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><MousePointer2 className="w-3.5 h-3.5" /></Link>
                                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🐋 Whale Detection via @ApexWeb3\n${tx.amount.toLocaleString()} ${tx.symbol} moved on ${tx.chain}\nhttps://apexweb3.com/analysis/whales`)}`} target="_blank" className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Share2 className="w-3.5 h-3.5" /></a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </main>
                </div>

                <div className="mt-24">
                     <FAQSection title="Whale Watch Analytics FAQ" faqs={[
                        { question: "How are transfers detected?", answer: "We scan RPC logs for every block on 7 chains. We only display moves above $100K to filter out local noise." },
                        { question: "What do the colors mean?", answer: "Green marks accumulation (Exchanges -> Wallets). Red marks distribution (Wallets -> Exchanges). Gray marks internal transfers." }
                     ]} />
                </div>
            </div>
        </div>
    );
}
