"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Wallet, ArrowRight } from "lucide-react";

export default function TrackerPage() {
    const [address, setAddress] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (address) {
            router.push(`/portfolio/${address}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto text-center">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-6 animate-pulse-glow">
                    <Wallet className="h-12 w-12 text-primary" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="gradient-text">Wallet Tracker</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-12">
                    Enter any wallet address to instantly view holdings, track value, and analyze performance without connecting your wallet.
                </p>

                <div className="bg-card p-2 rounded-xl border border-border glow-card max-w-xl mx-auto">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 text-muted-foreground h-5 w-5" />
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Paste wallet address (0x...)"
                                className="w-full bg-background border-none rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!address}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Track
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-6 rounded-xl bg-card border border-border/50">
                        <h3 className="font-semibold mb-2">Safe & Secure</h3>
                        <p className="text-sm text-muted-foreground">No wallet connection required. Just watch and analyze.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border/50">
                        <h3 className="font-semibold mb-2">Multi-Chain</h3>
                        <p className="text-sm text-muted-foreground">Support for Ethereum, BSC, Polygon and more.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-card border border-border/50">
                        <h3 className="font-semibold mb-2">Real-Time</h3>
                        <p className="text-sm text-muted-foreground">Live price updates and instant value calculation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
