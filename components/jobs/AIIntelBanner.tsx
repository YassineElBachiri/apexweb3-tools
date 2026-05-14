"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NormalizedAIJob } from "@/lib/remotive";
import { CACHE_KEYS, CACHE_TTL } from "@/lib/ai-web3-jobs";

interface HotCategory {
    name: string;
    count: number;
    trend: "up" | "stable" | "new";
}

interface SalaryRange {
    low: number | null;
    high: number | null;
    currency: string;
}

interface IntelData {
    headline: string | null;
    hotCategories: HotCategory[] | null;
    topSkillStack: string[] | null;
    emergingRole: string | null;
    salaryRange: SalaryRange | null;
    marketSignal: string | null;
    remoteRatio: number | null;
}

interface AIIntelBannerProps {
    jobs: NormalizedAIJob[];
}

async function fetchIntel(jobs: NormalizedAIJob[]): Promise<IntelData> {
    const cacheKey = CACHE_KEYS.banner;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL.intelligenceBanner) return data;
    }

    const res = await fetch("/api/jobs/ai-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs }),
    });
    if (!res.ok) throw new Error("Failed to fetch intelligence");
    const data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
}

export function AIIntelBanner({ jobs }: AIIntelBannerProps) {
    const [intel, setIntel] = useState<IntelData | null>(null);
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        if (!jobs?.length) return;
        fetchIntel(jobs).then(setIntel).catch(console.error);
    }, [jobs]);

    if (!intel) {
        return (
            <div className="my-8 border border-white/10 border-l-4 border-l-primary bg-card/20 backdrop-blur-sm rounded-r-xl overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-primary font-mono font-bold">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shrink-0" />
                        Analyzing Market Signal...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-8 border border-white/10 border-l-4 border-l-primary bg-card/20 backdrop-blur-sm rounded-r-xl overflow-hidden shadow-lg transition-colors hover:border-white/20 hover:bg-card/30">
            {/* Header */}
            <div 
                className="flex items-center justify-between px-6 py-4 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-primary font-mono font-bold">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                    Market Intelligence — updated daily
                </div>
                <span className="text-xs text-muted-foreground font-mono hover:text-foreground transition-colors">
                    [ {expanded ? "collapse" : "expand"} ]
                </span>
            </div>

            {/* Expandable Body */}
            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_90px] gap-5 items-start">
                            <div className="col-span-1 md:col-span-full font-sans text-sm font-semibold text-foreground pb-3.5 border-b border-white/5 mb-0.5">
                                {intel.headline}
                            </div>

                            {/* Skills */}
                            <div>
                                <div className="text-[9px] text-muted-foreground/80 tracking-[0.12em] uppercase mb-2 font-mono font-medium">Top skills in demand</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {intel.topSkillStack?.map(skill => (
                                        <span key={skill} className="text-[10px] font-mono px-2 py-0.5 bg-background/60 border border-white/10 text-muted-foreground rounded hover:text-foreground transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hot Categories */}
                            <div>
                                <div className="text-[9px] text-muted-foreground/80 tracking-[0.12em] uppercase mb-2 font-mono font-medium">Hot Categories</div>
                                {intel.hotCategories?.slice(0, 3).map((cat, i) => {
                                    const colors = ['#627EEA', '#9945FF', '#EC796B'];
                                    const color = colors[i % colors.length];
                                    return (
                                        <div key={cat.name} className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5 font-mono">
                                            <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}66` }} />
                                            {cat.name} <span className="text-[10px] ml-1 opacity-70">({cat.count})</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Salary */}
                            <div>
                                <div className="text-[9px] text-muted-foreground/80 tracking-[0.12em] uppercase mb-2 font-mono font-medium">Salary signal</div>
                                <div className="text-[11px] text-muted-foreground leading-[1.6]">
                                    {intel.salaryRange && (intel.salaryRange.low || intel.salaryRange.high) ? (
                                        <>
                                            {intel.salaryRange.low ? `$${(intel.salaryRange.low / 1000).toFixed(0)}K` : "—"}
                                            {" – "}
                                            {intel.salaryRange.high ? `$${(intel.salaryRange.high / 1000).toFixed(0)}K` : "—"}
                                        </>
                                    ) : "Market salary data not widely disclosed."}
                                    {intel.emergingRole && (
                                        <div className="mt-2 text-primary font-mono font-medium text-[11px]">Emerging: {intel.emergingRole}</div>
                                    )}
                                </div>
                            </div>

                            {/* Remote Ratio */}
                            <div className="text-center p-3 bg-background/60 border border-white/5 rounded-lg shadow-inner">
                                <span className="block font-sans text-[26px] font-extrabold text-primary leading-none">
                                    {intel.remoteRatio != null ? intel.remoteRatio : "?"}%
                                </span>
                                <span className="text-[9px] text-muted-foreground/80 uppercase tracking-[0.1em] mt-1.5 block font-mono font-medium">Remote</span>
                            </div>

                            {/* Market Signal */}
                            {intel.marketSignal && (
                                <div className="md:col-span-2 text-[11px] text-muted-foreground leading-[1.6] pt-1">
                                    <strong className="text-foreground font-medium mr-1.5">This week:</strong>
                                    {intel.marketSignal}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
