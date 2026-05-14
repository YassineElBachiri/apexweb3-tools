"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Web3Job } from "@/types/job";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, ChevronDown, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrustFlag {
    label: string;
    status: "clear" | "warning" | "risk";
    detail: string;
}

interface TrustScoreData {
    verdict: "SAFE" | "CAUTION" | "RISK";
    score: number;
    summary: string;
    flags: TrustFlag[];
    advice: string;
}

interface TrustScorePanelProps {
    job: Web3Job;
}

const NETWORKS = [
    { value: "ethereum", label: "Ethereum" },
    { value: "bsc", label: "BNB Chain" },
    { value: "polygon", label: "Polygon" },
    { value: "arbitrum", label: "Arbitrum" },
    { value: "base", label: "Base" },
    { value: "solana", label: "Solana" },
    { value: "avalanche", label: "Avalanche" },
];

const verdictConfig = {
    SAFE: {
        icon: ShieldCheck,
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        label: "Safe",
        barColor: "bg-green-500",
    },
    CAUTION: {
        icon: ShieldAlert,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        label: "Caution",
        barColor: "bg-yellow-500",
    },
    RISK: {
        icon: ShieldX,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        label: "High Risk",
        barColor: "bg-red-500",
    },
};

const flagStatusConfig = {
    clear: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/15", dot: "bg-green-400" },
    warning: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/15", dot: "bg-yellow-400" },
    risk: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/15", dot: "bg-red-400" },
};

export function TrustScorePanel({ job }: TrustScorePanelProps) {
    const [open, setOpen] = useState(false);
    const [contractAddress, setContractAddress] = useState("");
    const [network, setNetwork] = useState("ethereum");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TrustScoreData | null>(null);
    const [inputError, setInputError] = useState("");

    const handleAnalyze = async () => {
        if (!contractAddress.trim()) {
            setInputError("Enter a contract address to analyze.");
            return;
        }

        setInputError("");
        setLoading(true);
        setResult(null);

        try {
            // Optionally fetch GoPlus data first, then pass to Claude
            const res = await fetch("/api/jobs/trust-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contractAddress: contractAddress.trim(),
                    network,
                    contractData: {}, // Can be extended with real GoPlus data later
                    jobTitle: job.title,
                    company: job.company,
                }),
            });

            if (!res.ok) throw new Error("Analysis failed");
            const data = await res.json();
            setResult(data);
        } catch {
            setInputError("Analysis failed. Check the address and try again.");
        } finally {
            setLoading(false);
        }
    };

    const verdict = result ? verdictConfig[result.verdict] : null;

    return (
        <div className="rounded-2xl border border-white/5 bg-card/20 overflow-hidden">
            {/* Header Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                id="trust-score-toggle"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-foreground">Company Trust Score</p>
                        <p className="text-xs text-muted-foreground">Analyze the token contract before you commit</p>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/5"
                    >
                        <div className="p-6 space-y-5">
                            {/* Disclaimer */}
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Not financial advice. This is a due diligence tool to help you assess whether a company&apos;s token contract looks legitimate before accepting a job offer.
                                </p>
                            </div>

                            {/* Input */}
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="contract-address-input" className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                        Token Contract Address
                                    </label>
                                    <input
                                        id="contract-address-input"
                                        type="text"
                                        value={contractAddress}
                                        onChange={(e) => setContractAddress(e.target.value)}
                                        placeholder="0x... or contract address"
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                                    />
                                    {inputError && <p className="text-xs text-red-400 mt-1">{inputError}</p>}
                                </div>

                                <div>
                                    <label htmlFor="network-select" className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                        Network
                                    </label>
                                    <select
                                        id="network-select"
                                        value={network}
                                        onChange={(e) => setNetwork(e.target.value)}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                                    >
                                        {NETWORKS.map((n) => (
                                            <option key={n.value} value={n.value} className="bg-background">
                                                {n.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-500/10"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Analyzing contract...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4 mr-2" />
                                            Run Trust Analysis
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Results */}
                            <AnimatePresence>
                                {result && verdict && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        {/* Verdict Header */}
                                        <div className={`flex items-center gap-3 p-4 rounded-xl border ${verdict.bg} ${verdict.border}`}>
                                            <verdict.icon className={`w-6 h-6 ${verdict.color} shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className={`font-bold text-sm ${verdict.color}`}>{verdict.label}</p>
                                                    <span className={`text-sm font-bold ${verdict.color}`}>{result.score}/100</span>
                                                </div>
                                                <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${verdict.barColor} transition-all duration-700`}
                                                        style={{ width: `${result.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-foreground/90">{result.summary}</p>

                                        {/* Flags */}
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Security Flags</p>
                                            {result.flags.map((flag, i) => {
                                                const cfg = flagStatusConfig[flag.status];
                                                return (
                                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg}`}>
                                                        <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0 mt-1.5`} />
                                                        <div>
                                                            <p className={`text-xs font-bold ${cfg.color}`}>{flag.label}</p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">{flag.detail}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Advice */}
                                        <div className="p-3 rounded-xl bg-background/40 border border-white/5">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Advice</p>
                                            <p className="text-sm text-foreground/90">{result.advice}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
