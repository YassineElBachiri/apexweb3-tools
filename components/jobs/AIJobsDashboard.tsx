"use client";

import { useState, useMemo } from "react";
import { NormalizedAIJob } from "@/lib/remotive";
import { AIJobCard } from "@/components/jobs/AIJobCard";
import { AIIntelBanner } from "@/components/jobs/AIIntelBanner";
import { AiAffiliateBanner } from "@/components/affiliates/AiAffiliateBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const CATEGORY_TABS = [
    { id: "all", label: "All" },
    { id: "AI Agents", label: "AI Agents" },
    { id: "Decentralized AI", label: "Decentralized AI" },
    { id: "ML Engineering", label: "ML Engineering" },
    { id: "Data Science", label: "Data Science" },
    { id: "AI Product", label: "AI Product" },
    { id: "Other", label: "Other" },
];

interface AIJobsDashboardProps {
    initialJobs: NormalizedAIJob[];
    error?: string;
    sources?: { remotive: number; web3career: number };
}

export function AIJobsDashboard({ initialJobs, error, sources }: AIJobsDashboardProps) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [aiOnly, setAiOnly] = useState(false);
    const [search, setSearch] = useState("");

    const filteredJobs = useMemo(() => {
        return initialJobs.filter(job => {
            const category = job.aiEvaluation?.category || "Other";
            if (activeCategory !== "all" && category !== activeCategory) return false;
            if (remoteOnly && !job.remote) return false;
            if (aiOnly && !job.aiEvaluation?.relevant && job.source !== 'remotive') return false;
            if (search.trim()) {
                const q = search.toLowerCase();
                const tagsStr = job.tags ? job.tags.join(" ") : "";
                const text = `${job.title} ${job.company} ${tagsStr}`.toLowerCase();
                if (!text.includes(q)) return false;
            }
            return true;
        });
    }, [initialJobs, activeCategory, remoteOnly, aiOnly, search]);

    const categoryCounts = useMemo(() => {
        const baseJobs = initialJobs.filter(job => {
            if (remoteOnly && !job.remote) return false;
            if (aiOnly && !job.aiEvaluation?.relevant && job.source !== 'remotive') return false;
            if (search.trim()) {
                const q = search.toLowerCase();
                const tagsStr = job.tags ? job.tags.join(" ") : "";
                const text = `${job.title} ${job.company} ${tagsStr}`.toLowerCase();
                if (!text.includes(q)) return false;
            }
            return true;
        });

        const counts: Record<string, number> = { all: baseJobs.length };
        baseJobs.forEach(j => {
            const cat = j.aiEvaluation?.category || "Other";
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    }, [initialJobs, remoteOnly, aiOnly, search]);

    if (error && initialJobs.length === 0) {
        return (
            <div className="container py-20 max-w-4xl mx-auto px-4 text-center font-mono text-muted-foreground">
                ◈ {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-16">
            <div className="container max-w-5xl mx-auto px-5 mt-12 space-y-8">
                
                {/* HERO */}
                <div className="pb-8 border-b border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
                        <div>
                            <div className="text-xs text-primary tracking-widest uppercase mb-4 flex items-center gap-2 font-mono font-bold">
                                <div className="w-6 h-0.5 bg-primary" />
                                Web3 + AI Careers
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-4">
                                Find your role<br />
                                in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">on-chain</span><br />
                                economy.
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-md">
                                Live listings from top Web3 protocols, DeFi teams, and AI × blockchain companies.
                            </p>
                        </div>
                        <div className="flex flex-row md:flex-col gap-6 text-left md:text-right">
                            <div>
                                <span className="text-3xl md:text-4xl font-extrabold text-foreground block leading-none">{initialJobs.length}+</span>
                                <span className="text-xs text-muted-foreground tracking-widest uppercase font-mono mt-1 block">live roles</span>
                            </div>
                            <div>
                                <span className="text-3xl md:text-4xl font-extrabold text-foreground block leading-none">91%</span>
                                <span className="text-xs text-muted-foreground tracking-widest uppercase font-mono mt-1 block">remote</span>
                            </div>
                            {sources && (
                                <div className="text-[10px] text-muted-foreground font-mono mt-2">
                                    {sources.remotive} via Remotive<br/>
                                    {sources.web3career} via web3.career
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* INTEL BANNER */}
                {initialJobs.length > 0 && <AIIntelBanner jobs={initialJobs} />}

                {/* CONTROLS */}
                <div className="flex flex-col gap-4 py-2">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="search roles, skills, companies..."
                            className="pl-12 h-14 bg-card/20 border-white/10 text-base font-mono focus:border-primary transition-colors backdrop-blur-sm rounded-xl"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <Button 
                            variant={remoteOnly ? "default" : "outline"}
                            size="sm"
                            className="h-10 font-mono text-xs rounded-lg"
                            onClick={() => setRemoteOnly(!remoteOnly)}
                        >
                            ◉ Remote only
                        </Button>
                        <Button 
                            variant={aiOnly ? "default" : "outline"}
                            size="sm"
                            className="h-10 font-mono text-xs rounded-lg"
                            onClick={() => setAiOnly(!aiOnly)}
                        >
                            ◈ AI × Web3 only
                        </Button>
                        
                        <span className="text-sm text-muted-foreground ml-auto font-mono">
                            <strong className="text-foreground">{filteredJobs.length}</strong> roles found
                        </span>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
                    {CATEGORY_TABS.map(tab => {
                        const count = categoryCounts[tab.id] || 0;
                        const isActive = activeCategory === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCategory(tab.id)}
                                className={`px-5 py-3 font-mono text-sm font-medium tracking-wide whitespace-nowrap transition-all border-b-2 mb-[-1px] ${
                                    isActive ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground hover:border-white/20"
                                }`}
                            >
                                {tab.label}
                                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded border ${
                                    isActive ? "bg-primary/10 border-primary text-primary" : "bg-card border-white/10 text-muted-foreground"
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* SECTION LABEL & LIST CONTAINER */}
                <div className="flex flex-col rounded-2xl border border-white/5 overflow-hidden bg-card/20 backdrop-blur-xl shadow-2xl">
                    <div className="bg-card/40 px-5 py-2 border-b border-white/5 text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">
                        {activeCategory === "all" ? "All roles" : activeCategory}
                    </div>

                    {/* JOB LIST */}
                    <AnimatePresence mode="popLayout">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job, index) => (
                                <div key={job.id}>
                                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <AIJobCard job={job} />
                                    </motion.div>

                                    {/* Insert Affiliate Card every 6 jobs */}
                                    {(index + 1) % 6 === 0 && (
                                        <div className="p-4 border-b border-white/5 bg-card/10">
                                            <AiAffiliateBanner 
                                                context={{ 
                                                    type: 'job', 
                                                    category: 'ai',
                                                    tags: job.tags
                                                }} 
                                                variant="inline"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <motion.div className="text-center py-16 text-muted-foreground text-sm font-mono" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                ◈ No roles match. Try adjusting filters.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* BOTTOM TEXT */}
                <div className="text-center text-[10px] text-muted-foreground pt-4">
                    Jobs powered by web3.career & Remotive
                </div>
                
            </div>
        </div>
    );
}
