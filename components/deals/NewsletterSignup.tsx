"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Zap } from "lucide-react";
import { useState } from "react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Simulate API call
            setTimeout(() => {
                setSubmitted(true);
                setEmail("");
            }, 800);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center md:p-12">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-blue-600/10" />

            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
                <div className="flex justify-center">
                    <div className="rounded-full bg-brand-primary/20 p-3 ring-1 ring-brand-primary/50">
                        <Zap className="h-6 w-6 text-brand-primary" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Get Weekly Web3 Developer Perks
                </h2>

                <p className="text-lg text-slate-400">
                    Don&apos;t miss out on limited-time node credits, hackathon notifications, and exclusive exchange bonuses.
                    Sent once a week. No spam.
                </p>

                {submitted ? (
                    <div className="animate-fade-in rounded-lg bg-green-500/20 p-4 text-green-400 ring-1 ring-green-500/50">
                        Thanks! You&apos;ve been added to the list. Keep building! 🚀
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                            <Input
                                type="email"
                                placeholder="developer@example.com"
                                className="pl-10 text-white placeholder:text-slate-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="bg-brand-primary font-semibold text-white hover:bg-brand-primary/90">
                            Subscribe Free
                        </Button>
                    </form>
                )}

                <p className="text-xs text-slate-600">
                    Join 8,000+ developers receiving our curated deals. Unsubscribe anytime.
                </p>
            </div>
        </div>
    );
}
