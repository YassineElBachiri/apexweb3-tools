"use client";

import { useState, useCallback } from "react";
import { Copy, Check, ExternalLink, Zap, Shield, AlertTriangle, XCircle, Search } from "lucide-react";
import { ScoredPair } from "@/lib/actions/spike-detector";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatNumber(n: number, compact = false): string {
    if (!n || isNaN(n)) return "$0";
    if (compact || n >= 1_000_000)
        return "$" + Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(n);
    if (n >= 1000)
        return "$" + Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(n);
    return "$" + n.toFixed(4);
}

function formatPct(n: number): string {
    const sign = n >= 0 ? "+" : "";
    return sign + n.toFixed(2) + "%";
}

function formatTokenAge(pairCreatedAt: number): string {
    if (!pairCreatedAt) return "Unknown";
    const nowMs = Date.now();
    const diffMs = nowMs - pairCreatedAt;
    if (diffMs < 0) return "New";

    const minutes = Math.floor(diffMs / 60_000);
    const hours = Math.floor(diffMs / 3_600_000);
    const days = Math.floor(diffMs / 86_400_000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}

function getChainBadgeColor(chainId: string): string {
    const map: Record<string, string> = {
        solana: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        ethereum: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        base: "bg-sky-500/20 text-sky-300 border-sky-500/30",
        bsc: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        arbitrum: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        polygon: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    };
    return map[chainId] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

function getSafetyIcon(label: ScoredPair["safetyLabel"]) {
    if (label === "Safe") return <Shield className="h-3 w-3" />;
    if (label === "Warning") return <AlertTriangle className="h-3 w-3" />;
    return <XCircle className="h-3 w-3" />;
}

function getSafetyClass(label: ScoredPair["safetyLabel"]): string {
    if (label === "Safe") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    if (label === "Warning") return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    return "bg-red-500/15 text-red-300 border-red-500/30";
}

function truncateAddress(addr: string): string {
    if (!addr || addr.length < 12) return addr;
    return addr.slice(0, 6) + "…" + addr.slice(-4);
}

// ── Component ──────────────────────────────────────────────────────────────────
interface SpikeCardProps {
    pair: ScoredPair;
}

export function SpikeCard({ pair }: SpikeCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(pair.baseToken.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback: select + execCommand
            const el = document.createElement("textarea");
            el.value = pair.baseToken.address;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [pair.baseToken.address]);

    // ── Quick X Search: search by CONTRACT ADDRESS (not symbol) ────────────────
    const handleSearchX = useCallback(() => {
        const query = encodeURIComponent(pair.baseToken.address);
        window.open(`https://x.com/search?q=${query}`, "_blank", "noopener,noreferrer");
    }, [pair.baseToken.address]);

    const change5m = pair.priceChange?.m5 || 0;
    const isPositive = change5m >= 0;
    // Velocity is now already a percentage (0–100+), cap bar display at 100
    const velocityPct = Math.min(pair.volumeVelocity || 0, 100);

    return (
        <div
            id={`token-${pair.pairAddress}`}
            className={[
                "group relative flex flex-col gap-3 rounded-xl border bg-slate-900/60 p-4 backdrop-blur-sm",
                "transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900/80",
                pair.isSpiking
                    ? "border-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.15)] hover:shadow-[0_0_28px_rgba(16,185,129,0.25)]"
                    : pair.isHeatingUp
                        ? "border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                        : "border-slate-700/60 hover:border-slate-600/60",
                pair.isDevSold ? "ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900" : ""
            ].join(" ")}
        >
            {/* Spike indicator badge */}
            {pair.isSpiking && (
                <div className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    <Zap className="h-2.5 w-2.5 fill-current" />
                    SPIKING
                </div>
            )}

            {pair.isHeatingUp && (
                <div className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    <span className="h-2.5 w-2.5">🟡</span>
                    HEATING UP
                </div>
            )}

            {pair.isDevSold && (
                <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full border border-red-500 bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                    🚨 RUG WARNING
                </div>
            )}

            {/* Header Row */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm truncate">
                            ${pair.baseToken.symbol}
                        </span>
                        <span
                            className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${getChainBadgeColor(pair.chainId)}`}
                        >
                            {pair.chainId.toUpperCase().slice(0, 3)}
                        </span>
                        {pair.isAI && (
                            <span className="inline-flex items-center rounded-full border border-brand-primary/30 bg-brand-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-primary">
                                🤖 AI AGENT
                            </span>
                        )}
                        {pair.isPump && (
                            <span className="inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/10 px-1.5 py-0.5 text-[10px] font-bold text-pink-400">
                                💊 PUMP
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{pair.baseToken.name}</p>
                </div>

                {/* Safety Badge */}
                <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getSafetyClass(pair.safetyLabel)}`}
                >
                    {getSafetyIcon(pair.safetyLabel)}
                    {pair.safetyLabel}
                </span>
            </div>

            {/* Stats Grid — 4 columns: MCAP | Liquidity | 5m Chg | Age */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
                <StatBox
                    label="MCAP"
                    value={formatNumber(pair.marketCapUsd, true)}
                />
                <StatBox
                    label="Liquidity"
                    value={formatNumber(pair.liquidity?.usd || 0, true)}
                />
                <StatBox
                    label="5m Chg"
                    value={formatPct(change5m)}
                    valueClass={isPositive ? "text-emerald-400" : "text-red-400"}
                />
                <StatBox
                    label="Age"
                    value={formatTokenAge(pair.pairCreatedAt)}
                    valueClass="text-amber-400"
                />
            </div>

            {/* Volume Velocity Bar */}
            <div>
                <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Volume Velocity</span>
                    <span className="font-semibold text-slate-400">
                        {(pair.volumeVelocity || 0).toFixed(1)}%
                    </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${velocityPct}%`,
                            background:
                                velocityPct > 50
                                    ? "linear-gradient(90deg, #10b981, #34d399)"
                                    : velocityPct > 20
                                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                        : "linear-gradient(90deg, #ef4444, #f87171)",
                        }}
                    />
                </div>
            </div>

            {/* Contract Address Row */}
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/60 px-2 py-1.5">
                <span className="flex-1 font-mono text-[10px] text-slate-400 truncate">
                    {truncateAddress(pair.baseToken.address)}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    id={`copy-ca-${pair.pairAddress}`}
                    className={[
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold",
                        "transition-all duration-200",
                        copied
                            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                            : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-700 hover:text-white",
                    ].join(" ")}
                    aria-label="Copy contract address"
                >
                    {copied ? (
                        <>
                            <Check className="h-3 w-3" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3" />
                            Copy CA
                        </>
                    )}
                </button>

                {/* Quick X Search — searches by contract address */}
                <button
                    onClick={handleSearchX}
                    id={`search-x-${pair.pairAddress}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300"
                    aria-label={`Quick X Search for ${pair.baseToken.symbol}`}
                >
                    <Search className="h-3 w-3" />
                    X Search
                </button>

                <a
                    href={pair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`dex-link-${pair.pairAddress}`}
                    className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 transition-all duration-200 hover:border-brand-primary/50 hover:bg-brand-primary/10 hover:text-brand-primary"
                    aria-label="Open on DexScreener"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>

                {pair.chainId === "solana" && (
                    <a
                        href={`https://neo.bullx.io/terminal?chain=solana&address=${pair.baseToken.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 transition-all duration-200 hover:bg-emerald-500/20"
                    >
                        <Zap className="h-3 w-3 fill-current" />
                        BullX
                    </a>
                )}
            </div>
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatBox({
    label,
    value,
    valueClass = "text-white",
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div className="rounded-lg bg-slate-800/50 p-2">
            <p className="text-[9px] uppercase tracking-wide text-slate-500">{label}</p>
            <p className={`mt-0.5 text-xs font-bold ${valueClass}`}>{value}</p>
        </div>
    );
}
