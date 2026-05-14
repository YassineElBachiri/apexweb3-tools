"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Web3Job } from "@/types/job";
import { Sparkles, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface SummaryData {
    tldr: string[];
    realRequirements: string | null;
    redFlags: string | null;
}

interface JobSummaryCardProps {
    job: Web3Job;
}

export function JobSummaryCard({ job }: JobSummaryCardProps) {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!job?.description) return;

        // Per-job cache
        const cacheKey = `apexweb3_job_summary_${job.slug}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            try {
                setSummary(JSON.parse(cached));
                return;
            } catch { /* fall through */ }
        }

        setLoading(true);
        setError(false);

        fetch("/api/jobs/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed");
                return res.json();
            })
            .then((data) => {
                setSummary(data);
                sessionStorage.setItem(cacheKey, JSON.stringify(data));
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [job]);

    if (!job?.description) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-950/30 to-purple-950/20 backdrop-blur-sm overflow-hidden"
        >
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400/70">
                    AI TL;DR — decide in 5 seconds
                </span>
            </div>

            <div className="px-5 py-4">
                {/* Loading State */}
                {loading && (
                    <div className="flex items-center gap-2 text-muted-foreground py-2">
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        <span className="text-sm font-mono tracking-tight">ANALYZING_JD_DATA...</span>
                    </div>
                )}

                {/* Main Summary Content (AI or Fallback) */}
                {(summary || error) && !loading && (
                    <div className="space-y-4">
                        {/* 3-bullet TL;DR */}
                        <ul className="space-y-2">
                            {(summary?.tldr || [
                                `${job.title} role at ${job.company}`,
                                `${job.location} • ${job.remote ? 'Remote-first' : 'On-site'}`,
                                `Core tags: ${job.tags.slice(0, 3).join(', ') || 'General Web3'}`
                            ]).map((bullet, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                        <span className="text-[10px] font-bold text-indigo-400">{i + 1}</span>
                                    </span>
                                    <span className="text-sm text-foreground/90 leading-relaxed font-mono tracking-tight">{bullet}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {/* Real Requirements */}
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/10 backdrop-blur-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-green-400/70 mb-0.5 font-mono">
                                        Key_Requirements
                                    </p>
                                    <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                                        {summary?.realRequirements || `Focus on ${job.tags.slice(0, 2).join(' and ') || 'engineering'} expertise.`}
                                    </p>
                                </div>
                            </div>

                            {/* Red Flags / Intelligence */}
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/70 mb-0.5 font-mono">
                                        Market_Intel
                                    </p>
                                    <p className="text-xs text-foreground/80 leading-relaxed font-mono">
                                        {summary?.redFlags || `Verified listing via ${job.source || 'Web3 API'}.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                )}
            </div>
        </motion.div>
    );
}
