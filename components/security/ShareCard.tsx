"use client";

import { useState, useRef } from "react";
import { Twitter, Copy, Download, CheckCircle, Code2 } from "lucide-react";
import { buildTwitterShareUrl, buildTokenUrl, getVerdict } from "@/lib/index-now";
import type { ApexRiskProfile } from "@/lib/security-service";
import type { TokenMarketData } from "@/lib/security-service";

interface ShareCardProps {
    profile: ApexRiskProfile;
    marketData?: TokenMarketData | null;
}

export function ShareCard({ profile, marketData }: ShareCardProps) {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const chainLabel = profile.network === "eth" ? "Ethereum" : profile.network === "base" ? "Base" : "Solana";
    const tokenName = marketData?.tokenName ?? "Unknown Token";
    const tokenSymbol = marketData?.tokenSymbol ?? "???";
    const verdict = getVerdict(profile.score);
    const pageUrl = buildTokenUrl(profile.network, profile.address);
    const shortAddr = `${profile.address.slice(0, 8)}…${profile.address.slice(-6)}`;

    const twitterUrl = buildTwitterShareUrl({
        tokenName,
        tokenSymbol,
        chain: profile.network,
        address: profile.address,
        score: profile.score,
        isHoneypot: profile.isHoneypot,
        sellTax: profile.sellTax,
    });

    const embedSnippet = `<iframe src="https://www.apexweb3.com/widget/${profile.network}/${profile.address}" width="400" height="220" frameborder="0" style="border-radius:12px;border:1px solid rgba(255,255,255,0.1)" title="ApexWeb3 Security Score"></iframe>`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(pageUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
    };

    const handleCopyEmbed = () => {
        navigator.clipboard.writeText(embedSnippet);
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2200);
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            // Dynamically import html2canvas to avoid SSR issues
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: "#0a0f1e",
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const link = document.createElement("a");
            link.download = `apexweb3-${tokenSymbol}-scan.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (e) {
            console.error("Download failed:", e);
        } finally {
            setDownloading(false);
        }
    };

    const scoreColor = profile.score >= 80 ? "#10b981" : profile.score >= 50 ? "#f59e0b" : "#f43f5e";
    const scoreBg = profile.score >= 80 ? "rgba(16,185,129,0.1)" : profile.score >= 50 ? "rgba(245,158,11,0.1)" : "rgba(244,63,94,0.1)";

    return (
        <div className="space-y-4">
            {/* ── Visual share card (captured by html2canvas) ── */}
            <div
                ref={cardRef}
                className="rounded-2xl border border-white/10 overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#0f1729 100%)" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-black">A</span>
                        </div>
                        <span className="text-sm font-bold text-white">ApexWeb3 Security Scan</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">apexweb3.com</span>
                </div>

                {/* Body */}
                <div className="px-5 py-5 space-y-4">
                    {/* Token info */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-xl font-black text-white">
                                {tokenName} <span className="text-slate-400 font-semibold">({tokenSymbol})</span>
                            </div>
                            <div className="text-xs font-mono text-slate-500 mt-0.5">{shortAddr}</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 flex-shrink-0">
                            {chainLabel}
                        </div>
                    </div>

                    {/* Score */}
                    <div
                        className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ background: scoreBg, border: `1px solid ${scoreColor}33` }}
                    >
                        <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Risk Score</div>
                            <div className="text-3xl font-black" style={{ color: scoreColor }}>
                                {profile.score}<span className="text-base text-slate-500 font-semibold">/100</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold" style={{ color: scoreColor }}>
                                {verdict.emoji} {verdict.label.split(" — ")[0]}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{verdict.label.split(" — ")[1] ?? ""}</div>
                        </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                        {[
                            {
                                label: "🍯 Honeypot",
                                value: profile.isHoneypot ? "DANGER 🚨" : "SAFE ✅",
                                ok: !profile.isHoneypot,
                            },
                            {
                                label: "💰 Buy Tax",
                                value: profile.buyTax !== undefined ? `${profile.buyTax.toFixed(1)}%` : "N/A",
                                ok: (profile.buyTax ?? 0) <= 5,
                            },
                            {
                                label: "💰 Sell Tax",
                                value: profile.sellTax !== undefined ? `${profile.sellTax.toFixed(1)}%` : "N/A",
                                ok: (profile.sellTax ?? 0) <= 5,
                            },
                            {
                                label: "🔐 Verified",
                                value: profile.flags.some(f => f.name === "Open Source" && f.passed) ? "Yes ✅" : "No ⚠️",
                                ok: profile.flags.some(f => f.name === "Open Source" && f.passed),
                            },
                        ].map(({ label, value, ok }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between px-3 py-2 rounded-lg"
                                style={{
                                    background: ok ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
                                    border: `1px solid ${ok ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)"}`,
                                }}
                            >
                                <span className="text-xs text-slate-400">{label}</span>
                                <span className={`text-xs font-bold ${ok ? "text-emerald-400" : "text-rose-400"}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* URL */}
                    <div className="text-center text-xs text-slate-500 font-mono pt-1">{pageUrl}</div>
                </div>
            </div>

            {/* ── Action buttons ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="share-x-btn"
                    className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#1d9bf0]/10 border border-[#1d9bf0]/30 text-[#1d9bf0] text-sm font-semibold hover:bg-[#1d9bf0]/20 transition-all"
                >
                    <Twitter className="w-4 h-4" />
                    Share on X
                </a>

                <button
                    id="copy-link-btn"
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-card/50 border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all"
                >
                    {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? "Copied!" : "Copy Link"}
                </button>

                <button
                    id="download-report-btn"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-card/50 border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all disabled:opacity-60"
                >
                    <Download className="w-4 h-4" />
                    {downloading ? "Saving…" : "Download"}
                </button>

                <button
                    id="copy-embed-btn"
                    onClick={handleCopyEmbed}
                    className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-card/50 border border-white/10 text-sm font-semibold hover:bg-white/5 transition-all"
                >
                    {copiedEmbed ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Code2 className="w-4 h-4" />}
                    {copiedEmbed ? "Copied!" : "Embed"}
                </button>
            </div>

            {/* Embed snippet preview */}
            {copiedEmbed && (
                <div className="animate-in fade-in duration-200 text-xs font-mono text-muted-foreground bg-black/40 border border-white/5 rounded-lg px-4 py-3 break-all">
                    {embedSnippet}
                </div>
            )}
        </div>
    );
}
