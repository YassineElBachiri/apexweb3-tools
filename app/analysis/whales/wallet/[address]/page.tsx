"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Activity, Clock, ExternalLink, Share2, Search,
    ArrowRight, Zap, Target, MousePointer2, ChevronLeft,
    Wallet, TrendingUp, History, Download, Globe, Shield, Loader2,
    Copy, Twitter
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { shortAddress } from "@/lib/whales/utils";
import { getTxUrl } from "@/lib/whales/explorerLinks";

interface WhaleTx {
    id: string; hash: string; chain: string; symbol: string;
    amount: number; amountUSD: number; timestamp: number;
    age: string; from: { address: string; label: string | null; type: string };
    to: { address: string; label: string | null; type: string };
}

export default function WalletTracePage() {
    const { address } = useParams() as { address: string };
    const router = useRouter();
    const [txs, setTxs] = useState<WhaleTx[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch(`/api/whales/wallet/${address}`);
                const data = await res.json();
                setTxs(data.transactions || []);
            } catch (e: any) {
                setError("Failed to fetch wallet history.");
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [address]);

    const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    const totalVolume = txs.reduce((acc, tx) => acc + tx.amountUSD, 0);

    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `🐋 Whale Wallet Trace on ApexWeb3\nWallet: ${shortAddress(address)}\nRecent Volume: $${(totalVolume / 1_000_000).toFixed(1)}M\nTrace Live at 👇\n${shareUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20">
            {/* ── HERO ── */}
            <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-16">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute left-1/4 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-cyan-600/15 blur-[120px]" />
                    <div className="absolute right-1/4 top-10 h-[380px] w-[380px] rounded-full bg-purple-600/15 blur-[100px]" />
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center text-center">
                        <Link href="/analysis/whales" className="inline-flex items-center gap-2 mb-8 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Whale Watch
                        </Link>
                        
                        <div className="w-20 h-20 bg-slate-800/80 rounded-3xl border border-slate-700 flex items-center justify-center text-4xl mb-6 shadow-2xl group-hover:scale-105 transition-transform">
                             🐋
                        </div>
                        
                        <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                            Whale <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Trace</span>
                        </h1>
                        
                        <div className="flex items-center gap-3 bg-slate-100/5 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-sm shadow-inner group">
                             <Wallet className="w-4 h-4 text-slate-500" />
                             <span className="text-sm font-mono text-slate-300 select-all">{address}</span>
                             <button onClick={() => {navigator.clipboard.writeText(address)}} className="text-slate-600 hover:text-white transition-colors cursor-copy active:scale-90 transition-transform"><Download className="w-3.5 h-3.5" /></button>
                        </div>

                        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl">
                            <StatCard label="Recent Alerts" value={txs.length.toString()} icon={<Activity className="w-3.5 h-3.5" />} color="cyan" />
                            <StatCard label="Tracked Volume" value={`$${(totalVolume / 1_000_000).toFixed(1)}M`} icon={<TrendingUp className="w-3.5 h-3.5" />} color="emerald" />
                            <StatCard label="Wallet Type" value={txs[0]?.from.type === 'exchange' ? 'Exchange Out' : 'Smart Money'} icon={<Shield className="w-3.5 h-3.5" />} color="purple" />
                            <StatCard label="Network" value={isSolana ? 'Solana' : 'Multi-chain'} icon={<Globe className="w-3.5 h-3.5" />} color="blue" />
                        </div>

                        {/* Share dropdown */}
                        <div className="relative group mt-10">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm font-bold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all shadow-xl">
                                <Share2 className="w-4 h-4" /> Share This Trace
                            </button>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-48 rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 overflow-hidden">
                                <button onClick={handleCopy} className="w-full flex items-center gap-2 px-4 py-3.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <Copy className="w-4 h-4 text-slate-500" /> {copied ? "Copied!" : "Copy URL"}
                                </button>
                                <div className="mx-3 h-px bg-slate-800" />
                                <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")} className="w-full flex items-center gap-2 px-4 py-3.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <Twitter className="w-4 h-4 text-cyan-400" /> Share on X
                                </button>
                                <div className="mx-3 h-px bg-slate-800" />
                                <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank")} className="w-full flex items-center gap-2 px-4 py-3.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    <ExternalLink className="w-4 h-4 text-blue-400" /> Telegram
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── HISTORY ── */}
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                         <h2 className="text-xl font-black text-white flex items-center gap-3"><History className="w-5 h-5 text-cyan-400" /> Interaction History</h2>
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-800/80 px-3 py-1.5 rounded-xl bg-slate-900/40">
                             <Zap className="w-3 h-3 text-emerald-400" /> Live Data Scraped via Block Explorer
                         </div>
                    </div>

                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-500">
                             <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                             <p className="font-bold uppercase tracking-widest text-[10px]">Processing block data...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold text-center rounded-3xl">⚠️ {error}</div>
                    ) : txs.length === 0 ? (
                        <div className="py-32 text-center space-y-4 bg-slate-900/20 border border-slate-800 rounded-3xl opacity-50">
                             <Search className="w-12 h-12 mx-auto text-slate-700" />
                             <h3 className="text-lg font-black text-white uppercase tracking-widest">No Recent Movements Detect</h3>
                             <p className="text-sm text-slate-500 max-w-sm mx-auto">This address hasn't moved large volumes of stablecoins in the last {isSolana ? 'block' : '50 transactions'}.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {txs.map(tx => (
                                <div key={tx.id} className="group relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all hover:-translate-x-0.5 shadow-lg group-hover:bg-slate-900/90 overflow-hidden">
                                     <div className={`absolute top-0 left-0 w-1 h-full ${tx.from.address === address ? 'bg-rose-500/50' : 'bg-emerald-500/50'}`} />
                                     
                                     <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                                          <div className="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                                {tx.from.address === address ? '💸' : '💰'}
                                          </div>
                                          <div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-xl font-black text-white leading-none tabular-nums">${(tx.amountUSD / 1_000_000).toFixed(2)}M</p>
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{tx.symbol}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded text-slate-400">{tx.chain}</span>
                                                    <span className="text-[10px] font-bold text-slate-600">{tx.age} ago</span>
                                                </div>
                                          </div>
                                     </div>

                                     {/* Flow Box */}
                                     <div className="flex-1 w-full md:w-auto flex items-center gap-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                                          <div className="flex-1 min-w-0 text-right">
                                                <p className="text-[10px] font-mono truncate text-slate-400" title={tx.from.address}>{tx.from.label || shortAddress(tx.from.address)}</p>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-700 mt-0.5">SOURCE</p>
                                          </div>
                                          <ArrowRight className={`w-3.5 h-3.5 text-slate-700 shrink-0 ${tx.from.address === address ? 'text-rose-900' : 'text-emerald-900 animate-pulse'}`} />
                                          <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-mono truncate text-slate-400" title={tx.to.address}>{tx.to.label || shortAddress(tx.to.address)}</p>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-700 mt-0.5">RECEIVER</p>
                                          </div>
                                     </div>

                                     {/* Actions */}
                                     <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                          <a href={getTxUrl(tx.chain, tx.hash)} target="_blank" className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></a>
                                          {/* Detect if we should allow tracing the other side */}
                                          {tx.from.address !== address && (
                                              <button onClick={() => router.push(`/analysis/whales/wallet/${tx.from.address}`)} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"><MousePointer2 className="w-4 h-4" /></button>
                                          )}
                                          {tx.to.address !== address && (
                                              <button onClick={() => router.push(`/analysis/whales/wallet/${tx.to.address}`)} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"><MousePointer2 className="w-4 h-4" /></button>
                                          )}
                                     </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    const colors: Record<string, string> = {
        cyan: "border-cyan-500/20 text-cyan-400",
        emerald: "border-emerald-500/20 text-emerald-400",
        purple: "border-purple-500/20 text-purple-400",
        blue: "border-blue-500/20 text-blue-400",
    };
    return (
        <div className={`p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl h-full text-left transition-all hover:scale-[1.03] duration-300 shadow-lg ${colors[color] || ''}`}>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                 {icon} {label}
             </div>
             <p className="text-xl font-black text-white leading-none">{value}</p>
        </div>
    );
}
