"use client";

import { useState, useEffect } from "react";
import { ToolFAQ } from "@/components/seo/ToolFAQ";
import { WhaleTransaction } from "@/types/whale";
import { getTxUrl } from "@/lib/whales/explorerLinks";
import { shortAddress } from "@/lib/whales/utils";
import { Activity, Clock, ExternalLink, RefreshCw, Share2, Search, Filter, ArrowRight, Zap, Target } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const CHAIN_ICONS: Record<string, string> = {
  ethereum: '⟠', bsc: '⬡', base: '🔵', arbitrum: '🔷',
  polygon: '⬟', optimism: '🔴', solana: '◎', avalanche: '🔺',
};

function getTypeBadge(type: string) {
  if (type === 'mint')   return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (type === 'burn')   return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  return "bg-primary/10 text-primary border-primary/20";
}

function formatNumberCompact(amount: number) {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
    return amount.toFixed(2);
}

function getSizeDetails(amountUSD: number) {
  if (amountUSD >= 10_000_000) return { icon: "🦈", amountUSD, colorText: "text-rose-400", borderStyle: "border-rose-500/40 shadow-[0_0_18px_rgba(244,63,94,0.15)] hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]" };
  if (amountUSD >=  1_000_000) return { icon: "🐋", amountUSD, colorText: "text-blue-400", borderStyle: "border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" };
  if (amountUSD >=    500_000) return { icon: "🐬", amountUSD, colorText: "text-cyan-400", borderStyle: "border-slate-700/60" };
  return                              { icon: "🐟", amountUSD, colorText: "text-emerald-400", borderStyle: "border-slate-700/60" };
}

function getFlowBorder(tx: WhaleTransaction) {
  const fromIsEx = tx.from.type === 'exchange';
  const toIsEx = tx.to.type === 'exchange';
  if (tx.type === 'mint') return 'border-l-blue-500';
  if (tx.type === 'burn') return 'border-l-purple-500';
  if (fromIsEx && toIsEx) return 'border-l-yellow-500';
  if (!fromIsEx && toIsEx) return 'border-l-rose-500';
  if (fromIsEx && !toIsEx) return 'border-l-emerald-500';
  return 'border-l-slate-600';
}

function generateShareUrl(tx: WhaleTransaction): string {
  const text = `🐋 Whale Alert via @ApexWeb3\n${tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${tx.symbol} just moved\n💰 $${tx.amountUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} transferred\nFROM: ${tx.from.label ?? tx.from.address.slice(0,8)}\nTO: ${tx.to.label ?? tx.to.address.slice(0,8)}\nChain: ${tx.chain}\nLive feed 👇\nhttps://apexweb3.com/analysis/whales\n#CryptoWhales #Web3 #${tx.symbol}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-300">
      <span>{icon}</span>
      {label}
    </span>
  );
}

export default function WhaleWatchPage() {
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);
  const [filter, setFilter] = useState({ min: 500000, chain: 'all' });
  const [loading, setLoading]   = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [liveCount, setLiveCount] = useState(0);
  const [errorMsg, setErrorMsg]   = useState('');

  const fetchWhales = async () => {
    try {
      const params = new URLSearchParams({ min: filter.min.toString(), chain: filter.chain });
      const res  = await fetch(`/api/whales?${params}`);
      const data = await res.json();

      setTransactions(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newOnes = (data.transactions ?? []).filter((t: WhaleTransaction) => !existingIds.has(t.id));
        if (newOnes.length > 0) setLiveCount(c => c + newOnes.length);
        return [...newOnes, ...prev].slice(0, 100);
      });

      setErrorMsg('');
      setLoading(false);
      setCountdown(30);
    } catch (e: any) {
      setErrorMsg(e.message ?? "Feed paused");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTransactions([]);
    fetchWhales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { fetchWhales(); return 30; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const activeChains = new Set(transactions.map(t => t.chain)).size;

  return (
    <div className="min-h-screen bg-brand-dark pb-20 font-sans">
      
      {/* ── Hero Section (Spike Detector Style) ── */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50 pt-24 pb-12">
          {/* Background glow blobs */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
              <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-primary blur-[130px]" />
              <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-secondary blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-3xl text-center">
                  <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Zap className="mr-1 h-3 w-3 fill-current" />
                      Live Feed — Updates Every 30s
                  </Badge>

                  <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                      Whale{" "}
                      <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                          Watch
                      </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-400 mx-auto max-w-2xl">
                      Live scanner tracking seven-figure stablecoin moves across Ethereum, Base, BSC, Arbitrum, Polygon, Optimism and Solana.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                      <StatPill icon="🐋" label="Stablecoins > $100K" />
                      <StatPill icon="🌍" label="7 Blockchains" />
                      <StatPill icon="⚡" label="Real-time RPCs" />
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6">
        {errorMsg && (
          <div className="mb-6 p-4 max-w-3xl mx-auto bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold rounded-xl text-center shadow-lg">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ── Main Dashboard Layout ── */}
        <div className="flex flex-col gap-6 xl:flex-row">

          {/* ── Main Content (Feed) ── */}
          <div className="min-w-0 flex-1 order-2 xl:order-1">
            
            {/* Stats Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-primary" />
                        <span><strong className="text-white font-bold">{activeChains}</strong> Active Chains</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                        <Target className="h-4 w-4 text-emerald-400" />
                        <span><strong className="text-emerald-400 font-bold">{liveCount}</strong> Moves Detected</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                    <RefreshCw className={`h-3.5 w-3.5 ${countdown <= 5 ? "animate-spin text-primary" : ""}`} />
                    <span>Refresh in {countdown}s</span>
                </div>
            </div>

            {/* Grid Feed */}
            {loading && transactions.length === 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 animate-pulse">
                            <div className="flex justify-between items-center">
                                <div className="h-4 w-20 bg-slate-800 rounded"/>
                                <div className="h-4 w-12 bg-slate-800 rounded"/>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-full bg-slate-800 rounded"/>
                                    <div className="h-3 w-2/3 bg-slate-800 rounded"/>
                                </div>
                            </div>
                            <div className="h-10 w-full bg-slate-800 rounded mt-2"/>
                        </div>
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <Search className="w-12 h-12 text-slate-700" />
                  <p className="font-bold text-lg text-slate-300">No recent movements</p>
                  <p className="text-sm text-center max-w-sm">No stablecoin transfers above ${filter.min.toLocaleString()} found currently.</p>
                  {filter.min > 100000 && (
                    <button onClick={() => setFilter(f => ({ ...f, min: 100000 }))} className="px-4 py-2 mt-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
                      Drop threshold to $100K
                    </button>
                  )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {transactions.map(tx => {
                        const typeBadge  = getTypeBadge(tx.type);
                        const sizeSpec   = getSizeDetails(tx.amountUSD);
                        const flowBorder = getFlowBorder(tx);
                        const fromIsExchange = tx.from.type === 'exchange';
                        const toIsExchange   = tx.to.type   === 'exchange';
                        const txUrl = getTxUrl(tx.chain, tx.hash);

                        return (
                            <div key={tx.id} className={`group relative flex flex-col gap-3 rounded-xl border bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900/80 border-l-4 ${flowBorder} border-t-slate-700/60 border-r-slate-700/60 border-b-slate-700/60 hover:border-r-slate-600 hover:border-b-slate-600 ${sizeSpec.borderStyle}`}>
                                
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-bold text-white text-xs truncate">
                                            {tx.symbol}
                                        </span>
                                        <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-300 border-slate-600 truncate`}>
                                            <span className="mr-1">{CHAIN_ICONS[tx.chain]}</span> {tx.chain.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className={`px-1.5 py-0.5 text-[8px] tracking-widest font-black rounded border uppercase ${typeBadge}`}>
                                        {tx.type}
                                    </div>
                                </div>

                                {/* Value Stats */}
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center justify-center w-10 h-10 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                        {sizeSpec.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-lg leading-none font-black font-mono text-white tracking-tight flex items-baseline gap-1 truncate">
                                            {formatNumberCompact(tx.amount)}
                                            <span className="text-primary text-xs font-semibold">{tx.symbol}</span>
                                        </div>
                                        <div className={`text-[11px] mt-1 font-bold ${sizeSpec.colorText} truncate`}>
                                            ${formatNumberCompact(tx.amountUSD)} <span className="text-slate-500 font-medium">USD</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Track */}
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50 mt-1">
                                    <div className="min-w-0 space-y-1 text-right">
                                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider flex items-center justify-end">From</div>
                                        <div className={`text-[11px] font-mono truncate ${fromIsExchange ? 'text-white font-bold' : 'text-slate-400'}`} title={tx.from.address}>{tx.from.label ?? shortAddress(tx.from.address)}</div>
                                        {fromIsExchange && <div className="text-[8px] text-rose-300 font-bold bg-rose-500/20 border border-rose-500/30 rounded px-1.5 py-0.5 inline-block">Exchange</div>}
                                    </div>
                                    <div className="flex items-center justify-center shrink-0 opacity-50">
                                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider flex items-center">To</div>
                                        <div className={`text-[11px] font-mono truncate ${toIsExchange ? 'text-white font-bold' : 'text-slate-400'}`} title={tx.to.address}>{tx.to.label ?? shortAddress(tx.to.address)}</div>
                                        {toIsExchange && <div className="text-[8px] text-indigo-300 font-bold bg-indigo-500/20 border border-indigo-500/30 rounded px-1.5 py-0.5 inline-block">Exchange</div>}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex items-center justify-between text-slate-500 border-t border-slate-800/80 pt-3 mt-1">
                                    <div className="text-[10px] font-medium flex items-center gap-1.5 tracking-wide text-slate-400">
                                        <Clock className="w-3 h-3" /> {tx.age}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <a href={txUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-1.5 rounded-md hover:bg-slate-700 hover:text-white transition-colors" title="View Explorer">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <a href={generateShareUrl(tx)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-1.5 rounded-md hover:bg-blue-500/20 hover:text-blue-400 transition-colors" title="Share">
                                            <Share2 className="w-3.5 h-3.5" />
                                        </a>
                                        {tx.from.address !== 'unknown' && (
                                            <Link href={`/analysis/whales/wallet/${tx.from.address}`} className="flex items-center justify-center p-1.5 rounded-md hover:bg-primary/20 hover:text-primary transition-colors" title="Trace Wallet">
                                                <Search className="w-3.5 h-3.5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
          </div>

          {/* ── Sidebar (Filters) ── */}
          <div className="xl:w-[280px] xl:shrink-0 order-1 xl:order-2">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 sticky top-24 shadow-xl">
              <h2 className="text-[13px] font-bold tracking-widest uppercase text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
                <Filter className="w-4 h-4 text-primary" /> Tracking Filters
              </h2>

              <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">Min Size USD</label>
                    <div className="grid grid-cols-2 gap-2">
                    {THRESHOLDS.map(opt => (
                        <button
                        key={opt.val}
                        onClick={() => setFilter(f => ({ ...f, min: opt.val }))}
                        className={`w-full text-center px-1 py-2 text-[11px] font-bold rounded-lg border transition-all duration-200 ${filter.min === opt.val ? 'bg-primary/10 text-primary border-primary/40 shadow-[0_0_10px_rgba(var(--primary),0.1)]' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600'}`}
                        >
                        {opt.lbl}
                        </button>
                    ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">Blockchain</label>
                    <div className="grid grid-cols-2 gap-2">
                    {CHAINS.map(opt => (
                        <button
                        key={opt.val}
                        onClick={() => setFilter(f => ({ ...f, chain: opt.val }))}
                        className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 text-[10px] font-bold rounded-lg border transition-all duration-200 ${filter.chain === opt.val ? 'bg-primary/10 text-primary border-primary/40 shadow-[0_0_10px_rgba(var(--primary),0.1)]' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600'}`}
                        >
                        <span className="text-sm">{CHAIN_ICONS[opt.val] ?? ''}</span>
                        <span>{opt.lbl}</span>
                        </button>
                    ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <ToolFAQ
            toolName="Whale Watch"
            description={
              <>
                <p>The ApexWeb3 Whale Watch scrapes large stablecoin transfers directly from public block explorers and Solana RPC nodes.</p>
                <p>Flow direction is color-coded: a green left border indicates smart money leaving an exchange (accumulation), a red border means funds moving into an exchange (possible sell), and yellow marks internal moves.</p>
              </>
            }
            faqs={[
              { question: "What tokens are tracked?", answer: "We focus on USDT and USDC — the two most-transferred stablecoins by volume." },
              { question: "How fresh is the data?", answer: "The server caches responses for 25 seconds using Next.js ISR. The client automatically polls every 30 seconds." }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
