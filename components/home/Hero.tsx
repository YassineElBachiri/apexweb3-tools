"use client";

import { ChevronDown, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
    const scrollToTools = () => {
        const toolsSection = document.getElementById("tools");
        if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-dark">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                        <span className="w-2 h-2 rounded-full bg-brand-pink animate-ping" />
                        <span className="text-sm font-medium text-gray-300">
                            New: Security Scanner Live
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue">
                            Master Crypto
                        </span>
                        <br />
                        <span className="text-white">
                            Without Complexity
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Professional Web3 tools for everyone. Track portfolios, analyze tokens,
                        and convert currencies — <span className="text-brand-blue font-medium">100% free, no login required</span>.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className="bg-brand-purple hover:bg-brand-purple/90 text-white px-8 py-6 text-lg rounded-full shadow-[0_0_30px_rgba(199,125,255,0.3)] transition-all hover:scale-105"
                            onClick={scrollToTools}
                        >
                            Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Link href="/demo">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                            >
                                <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="pt-12 flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-medium text-gray-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-brand-blue rounded-full" />
                            No Tracking
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-brand-purple rounded-full" />
                            Real-Time Data
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-brand-pink rounded-full" />
                            Completely Free
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer p-2 hover:bg-white/5 rounded-full transition-colors" onClick={scrollToTools}>
                <ChevronDown className="h-6 w-6 text-gray-400" />
            </div>
        </section>
    );
}
