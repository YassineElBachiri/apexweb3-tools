"use client";

import { useState, useMemo } from "react";
import { Web3Job } from "@/types/job";
import { JobCard } from "@/components/jobs/JobCard";
import { JobIntelBanner } from "@/components/jobs/JobIntelBanner";
import { AiAffiliateBanner } from "@/components/affiliates/AiAffiliateBanner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const CATEGORY_TABS = ["All", "Engineering", "AI × Web3", "Security", "Product", "Research", "Community"];

export function JobsDashboard({ initialJobs, error }: { initialJobs: Web3Job[], error: string | null }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [chainFilter, setChainFilter] = useState("All chains");
    const [activeCategory, setActiveCategory] = useState("All");
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [aiOnly, setAiOnly] = useState(false);

    const filteredJobs = useMemo(() => {
        return initialJobs.filter(job => {
            const searchString = `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase();
            if (searchTerm && !searchString.includes(searchTerm.toLowerCase())) return false;
            
            const jobCat = getCategoryForJob(job);
            if (activeCategory !== "All" && jobCat !== activeCategory) return false;
            
            if (chainFilter !== "All chains") {
                const jobChain = getChainForJob(job);
                if (jobChain !== chainFilter) return false;
            }
            
            if (remoteOnly && !job.remote) return false;
            if (aiOnly && jobCat !== "AI × Web3") return false;
            
            return true;
        });
    }, [initialJobs, searchTerm, activeCategory, chainFilter, remoteOnly, aiOnly]);

    const categoryCounts = useMemo(() => {
        const baseJobs = initialJobs.filter(job => {
            const searchString = `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase();
            if (searchTerm && !searchString.includes(searchTerm.toLowerCase())) return false;
            if (chainFilter !== "All chains" && getChainForJob(job) !== chainFilter) return false;
            if (remoteOnly && !job.remote) return false;
            if (aiOnly && getCategoryForJob(job) !== "AI × Web3") return false;
            return true;
        });
        
        const counts: Record<string, number> = { "All": baseJobs.length };
        baseJobs.forEach(job => {
            const cat = getCategoryForJob(job);
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    }, [initialJobs, searchTerm, chainFilter, remoteOnly, aiOnly]);

    const featuredJobs = filteredJobs.filter(j => j.featured || false).slice(0, 3);
    const regularJobs = filteredJobs.filter(j => !featuredJobs.includes(j));

    return (
        <div className="min-h-screen bg-background pb-16">
            {/* TICKER */}
            <div className="bg-card/50 border-b border-white/5 h-10 flex items-center overflow-hidden">
                <div className="bg-primary text-primary-foreground text-xs font-bold px-4 h-full flex items-center whitespace-nowrap shrink-0 tracking-widest z-10 shadow-lg shadow-primary/20">
                    LIVE SIGNAL
                </div>
                <div className="overflow-hidden flex-1">
                    <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap">
                        <span className="flex">
                            <span className="text-xs text-muted-foreground px-8 font-mono">Solidity Engineer @ Uniswap <span className="text-primary ml-2">$180K</span></span>
                            <span className="text-xs text-muted-foreground px-8 font-mono">ZK Engineer @ StarkWare <span className="text-primary ml-2">$240K</span></span>
                            <span className="text-xs text-muted-foreground px-8 font-mono">AI Agent Dev @ Fetch.ai <span className="text-primary ml-2">$160K</span></span>
                            <span className="text-xs text-muted-foreground px-8 font-mono">ML Engineer @ Dune <span className="text-primary ml-2">$170K</span></span>
                        </span>
                        <span className="flex">
                            <span className="text-xs text-muted-foreground px-8 font-mono">Solidity Engineer @ Uniswap <span className="text-primary ml-2">$180K</span></span>
                            <span className="text-xs text-muted-foreground px-8 font-mono">ZK Engineer @ StarkWare <span className="text-primary ml-2">$240K</span></span>
                            <span className="text-xs text-muted-foreground px-8 font-mono">AI Agent Dev @ Fetch.ai <span className="text-primary ml-2">$160K</span></span>
                            <span className="text-xs text-muted-foreground px-8 font-mono">ML Engineer @ Dune <span className="text-primary ml-2">$170K</span></span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="container max-w-5xl mx-auto space-y-8 mt-8">
                {/* HERO */}
                <div className="pb-8 border-b border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
                        <div>
                            <div className="text-xs text-primary tracking-widest uppercase mb-4 flex items-center gap-2 font-mono font-bold">
                                <div className="w-6 h-0.5 bg-primary" />
                                Web3 + AI Careers
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-4">
                                Find your role<br />in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">on-chain</span><br />economy.
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-md">
                                Live listings from top Web3 protocols, DeFi teams, and AI × blockchain companies.
                            </p>
                        </div>
                        <div className="flex flex-row md:flex-col gap-6 text-left md:text-right">
                            <div><span className="text-3xl md:text-4xl font-extrabold text-foreground block leading-none">{initialJobs.length}+</span><span className="text-xs text-muted-foreground tracking-widest uppercase font-mono mt-1 block">live roles</span></div>
                            <div><span className="text-3xl md:text-4xl font-extrabold text-foreground block leading-none">91%</span><span className="text-xs text-muted-foreground tracking-widest uppercase font-mono mt-1 block">remote</span></div>
                        </div>
                    </div>
                </div>

                {/* INTEL BANNER */}
                {initialJobs.length > 0 && <JobIntelBanner jobs={initialJobs} />}

                {/* CONTROLS */}
                <div className="flex flex-col gap-4 py-2">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            className="pl-12 h-14 bg-card/20 border-white/10 text-base font-mono focus:border-primary transition-colors backdrop-blur-sm rounded-xl"
                            placeholder="search roles, skills, companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <select 
                            className="bg-card/20 border border-white/10 text-muted-foreground font-mono text-sm px-4 h-10 rounded-lg outline-none cursor-pointer appearance-none hover:bg-card/40 transition-colors"
                            value={chainFilter}
                            onChange={(e) => setChainFilter(e.target.value)}
                        >
                            <option>All chains</option>
                            <option>Ethereum</option>
                            <option>Solana</option>
                            <option>Polygon</option>
                            <option>Starknet</option>
                            <option>Multi-chain</option>
                        </select>
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
                        <span className="text-sm text-muted-foreground ml-auto font-mono"><strong className="text-foreground">{filteredJobs.length}</strong> roles found</span>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
                    {CATEGORY_TABS.map(cat => {
                        const count = categoryCounts[cat] || 0;
                        const isActive = activeCategory === cat;
                        return (
                            <button 
                                key={cat}
                                className={`px-5 py-3 font-mono text-sm font-medium tracking-wide whitespace-nowrap transition-all border-b-2 mb-[-1px] ${isActive ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground hover:border-white/20'}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                                <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded border ${isActive ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-white/10 text-muted-foreground'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* LIST CONTAINER */}
                <div className="flex flex-col rounded-2xl border border-white/5 overflow-hidden bg-card/20 backdrop-blur-xl shadow-2xl">
                    
                    {/* FEATURED */}
                    {featuredJobs.length > 0 && (
                        <div>
                            <div className="bg-primary/5 px-5 py-2 border-b border-white/5 text-xs font-mono font-bold tracking-widest text-primary uppercase">
                                Featured roles
                            </div>
                            <AnimatePresence mode="popLayout">
                                {featuredJobs.map(job => (
                                    <motion.div key={job.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <JobCard job={job} featured={true} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* ALL JOBS */}
                    {regularJobs.length > 0 && (
                        <div className="bg-card/40 px-5 py-2 border-b border-white/5 text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">
                            {activeCategory === "All" ? "All roles" : activeCategory}
                        </div>
                    )}
                    <AnimatePresence mode="popLayout">
                        {regularJobs.map((job, index) => (
                            <div key={job.id}>
                                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <JobCard job={job} />
                                </motion.div>
                                
                                {/* Insert Affiliate Card every 6 jobs */}
                                {(index + 1) % 6 === 0 && (
                                    <div className="p-4 border-b border-white/5 bg-card/10">
                                        <AiAffiliateBanner 
                                            context={{ 
                                                type: 'job', 
                                                category: 'general',
                                                tags: job.tags
                                            }} 
                                            variant="inline"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredJobs.length === 0 && (
                            <motion.div className="text-center py-16 text-muted-foreground text-sm font-mono" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                ◈ No roles match. Try adjusting filters.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* AI BANNER */}
                <div className="my-12 p-8 bg-gradient-to-br from-card/40 to-background border border-primary/20 rounded-2xl relative overflow-hidden shadow-2xl shadow-primary/5">
                    <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 font-sans text-9xl font-extrabold text-primary opacity-[0.03] pointer-events-none">
                        AI × WEB3
                    </div>
                    <div className="text-xs font-mono font-bold tracking-widest uppercase text-primary mb-3">New section</div>
                    <div className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">AI × Web3 Jobs</div>
                    <div className="text-base text-muted-foreground leading-relaxed max-w-xl mb-6">
                        Roles at the intersection of artificial intelligence and blockchain. AI agents, decentralized ML, on-chain data science, and more.
                    </div>
                    <div className="flex gap-2 flex-wrap mb-8">
                        {["AI Agents", "Decentralized AI", "On-chain ML", "Bittensor", "Fetch.ai"].map(tag => (
                            <span key={tag} className="text-xs font-mono px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Link href="/jobs/ai">
                        <Button size="lg" className="font-mono tracking-widest text-xs h-12 px-6">
                            EXPLORE AI × WEB3 JOBS →
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

// Helpers
function getCategoryForJob(job: Web3Job) {
    const tagsStr = job.tags ? job.tags.join(' ') : '';
    const text = `${job.title} ${tagsStr}`.toLowerCase();
    if (text.includes("ai") || text.includes("machine learning")) return "AI × Web3";
    if (text.includes("security") || text.includes("auditor")) return "Security";
    if (text.includes("product") || text.includes("pm")) return "Product";
    if (text.includes("research") || text.includes("quant") || text.includes("tokenomics")) return "Research";
    if (text.includes("community") || text.includes("marketing") || text.includes("devrel")) return "Community";
    return "Engineering"; // fallback
}

function getChainForJob(job: Web3Job) {
    const tagsStr = job.tags ? job.tags.join(' ') : '';
    const textLower = `${job.title} ${job.description || ''} ${tagsStr}`.toLowerCase();
    if (textLower.includes("solana")) return "Solana";
    if (textLower.includes("ethereum") || textLower.includes("evm")) return "Ethereum";
    if (textLower.includes("polygon")) return "Polygon";
    if (textLower.includes("starknet")) return "Starknet";
    return "Multi-chain";
}
