"use client";

import { processScanAction } from "@/app/actions/scan-token";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ShieldAlert, CheckCircle, Search, Rocket, Lock } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export default function SecurityScannerLandingPage() {
    // Note: React 19 useActionState handles form state and pending automatically.
    // In some Next.js 15+ setups, we might use useFormState if useActionState isn't fully typed.
    // We'll use a simpler approach with basic state to ensure compatibility if useActionState throws here.

    return (
        <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
                <Breadcrumbs items={[{ label: "Trust Engine Security Scanner" }]} />

                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                        <Shield className="h-12 w-12 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Trust Engine</span>
                    </h1>

                    <p className="text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
                        Instant security audits for Solana, Base, and Ethereum tokens. Run our proprietary simulated swap to detect honeypots before you trade.
                    </p>

                    <form action={processScanAction} className="relative max-w-2xl mx-auto mt-10">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    name="address"
                                    type="text"
                                    required
                                    placeholder="Enter Token Contract Address (0x... or Base58...)"
                                    className="pl-12 h-14 bg-card/60 backdrop-blur-md border-primary/20 focus:border-primary text-lg"
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                Scan Token
                            </Button>
                        </div>
                        {/* We handle errors via action state ideally, but since we redirect on success, we don't need complex error handling here. 
                            If it doesn't redirect, the user entered an invalid address. */}
                    </form>

                    <div className="flex gap-4 justify-center mt-6">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-1 px-3 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> 100% Free
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1 px-3 text-sm">
                            <Lock className="w-3.5 h-3.5 mr-1.5" /> No API Key Required
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    <div className="p-6 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-sm shadow-xl">
                        <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center mb-4">
                            <ShieldAlert className="w-5 h-5 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Honeypot Detection</h3>
                        <p className="text-sm text-muted-foreground">Our simulated swap technology executes buy and sell orders on a fork to ensure you can exit.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-sm shadow-xl">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Tax Analysis</h3>
                        <p className="text-sm text-muted-foreground">Automatically read buy and sell taxes embedded in the contract before you lose capital to high slippage.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-sm shadow-xl">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                            <Rocket className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Multi-Chain</h3>
                        <p className="text-sm text-muted-foreground">Unified scanning output to analyze EVM (Ethereum, Base) and Solana chain tokens without switching tools.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
