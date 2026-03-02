"use client";

import { ApexRiskProfile } from "@/lib/security-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, Share2, Copy, ArrowRight, Activity, Percent, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RiskDashboardProps {
    profile: ApexRiskProfile;
}

export function RiskDashboard({ profile }: RiskDashboardProps) {
    const [copied, setCopied] = useState(false);

    const isSafe = profile.status === 'SAFE';
    const isCritical = profile.status === 'CRITICAL';
    const isWarning = profile.status === 'WARNING';

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Simulated Swap Calculation
    const swapAmount = 100;
    const calculateSimulatedResult = () => {
        if (profile.isHoneypot) return 0;

        let amount = swapAmount;
        // Apply buy tax
        if (profile.buyTax) amount = amount * (1 - (profile.buyTax / 100));
        // Apply sell tax
        if (profile.sellTax) amount = amount * (1 - (profile.sellTax / 100));
        return parseFloat(amount.toFixed(2));
    };

    const simulatedReturn = calculateSimulatedResult();
    const swapFails = profile.isHoneypot || simulatedReturn === 0;

    return (
        <div className="space-y-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* The Verdict Header */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border ${isSafe ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]' :
                isCritical ? 'bg-rose-950/20 border-rose-500/30 shadow-[0_0_50px_-12px_rgba(225,29,72,0.3)]' :
                    'bg-yellow-950/20 border-yellow-500/30'
                }`}>
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full opacity-50 ${isSafe ? 'bg-emerald-500' : isCritical ? 'bg-rose-500' : 'bg-yellow-500'
                    }`} />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl border ${isSafe ? 'bg-emerald-500/10 border-emerald-500/20' :
                            isCritical ? 'bg-rose-500/10 border-rose-500/20 animate-pulse' :
                                'bg-yellow-500/10 border-yellow-500/20'
                            }`}>
                            {isSafe ? <ShieldCheck className="w-12 h-12 text-emerald-500" /> :
                                isCritical ? <ShieldAlert className="w-12 h-12 text-rose-500" /> :
                                    <AlertTriangle className="w-12 h-12 text-yellow-500" />}
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Risk Verdict
                            </h2>
                            <h1 className={`text-3xl md:text-4xl font-black ${isSafe ? 'text-emerald-400' : isCritical ? 'text-rose-400' : 'text-yellow-400'
                                }`}>
                                {isSafe ? 'Likely Safe to Trade.' :
                                    isCritical ? 'DO NOT BUY: High Risk.' :
                                        'Proceed with Caution.'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <div className="text-6xl font-black text-white drop-shadow-lg">
                            {profile.score}
                            <span className="text-2xl text-muted-foreground">/100</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mt-2 flex items-center gap-2">
                            {profile.network.toUpperCase()}
                            <span className="opacity-50">•</span>
                            {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
                            <button onClick={() => navigator.clipboard.writeText(profile.address)} className="hover:text-white transition-colors">
                                <Copy className="w-3 h-3" />
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid Layout for Flags and Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Simulated Swap Box */}
                <Card className="lg:col-span-1 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-black/20 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-primary">
                            <Activity className="w-5 h-5" />
                            Simulated Swap
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Testing execution on a $100 sequence.</p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-3 relative">
                            {/* Line connecting the steps */}
                            <div className="absolute left-[13px] top-6 bottom-6 w-0.5 bg-white/10" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 text-xs font-bold">1</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Buy $100</p>
                                    <p className="text-xs text-muted-foreground flex justify-between">
                                        Tax: {profile.buyTax ?? 0}%
                                        <span className={profile.buyTax ? 'text-orange-400' : 'text-green-400'}>
                                            -${profile.buyTax ?? 0}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 relative z-10 w-full justify-center py-2">
                                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 opacity-50" />
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${swapFails ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-purple-500/20 border-purple-500/50 text-purple-400'}`}>2</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Sell Position</p>
                                    <p className="text-xs text-muted-foreground flex justify-between">
                                        Tax: {profile.sellTax ?? 0}%
                                        <span className={profile.sellTax ? 'text-orange-400' : 'text-green-400'}>
                                            -${profile.sellTax ? ((100 - (profile.buyTax || 0)) * ((profile.sellTax || 0) / 100)).toFixed(2) : 0}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl border ${swapFails ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-sm font-bold ${swapFails ? 'text-rose-400' : 'text-emerald-400'}`}>Net Return</span>
                                <span className={`text-xl font-black ${swapFails ? 'text-rose-500' : 'text-emerald-500'}`}>${simulatedReturn}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">
                                {swapFails ? "Transaction simulated to fail. Do not trade." : "Simulation successful. Taxes accounted for."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Flag List Grid */}
                <Card className="lg:col-span-2 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl">
                    <CardHeader className="border-b border-white/5 bg-black/20 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Security Checks</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">{profile.flags.length} audit points analyzed.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 border-white/10 hover:bg-white/5">
                            {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                            {copied ? "Copied!" : "Share Scan"}
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.flags.map((flag, idx) => (
                                <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${flag.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/20'
                                    }`}>
                                    <div className="mt-0.5 shrink-0">
                                        {flag.passed ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${flag.passed ? 'text-gray-200' : 'text-rose-400'}`}>
                                            {flag.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1 mt-0.5 leading-relaxed">
                                            {flag.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Contextual CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pb-20 md:pb-0">
                {profile.isHoneypot ? (
                    <Button asChild size="lg" variant="destructive" className="w-full sm:w-auto font-bold shadow-lg shadow-rose-500/20 bg-rose-600 hover:bg-rose-700">
                        <Link href="/analysis/contract-analyzer">
                            What is a Honeypot? Read Insight Guide <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                ) : null}

                {isSafe ? (
                    <Button asChild size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href={`/analysis/analyzer?q=${profile.address}`}>
                            Analyze Tokenomics <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                ) : null}

                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-bold border-white/10 hover:bg-white/5">
                    <Link href="/analysis/contract-analyzer">
                        Scan Another Token
                    </Link>
                </Button>
            </div>

            {/* Mobile Sticky Scan Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-white/10 md:hidden z-50">
                <Button asChild size="lg" className="w-full font-bold bg-primary hover:bg-primary/90 shadow-lg">
                    <Link href="/analysis/contract-analyzer">
                        <Search className="w-4 h-4 mr-2" /> Scan New Token
                    </Link>
                </Button>
            </div>

        </div>
    );
}
