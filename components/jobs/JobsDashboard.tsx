"use client";

import { useState, useMemo, useEffect } from "react";
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

    // Apply all data-transform helpers once — title clean, salary normalize, classify
    const jobs = useMemo(() => initialJobs.map(normalizeJob), [initialJobs]);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
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
    }, [jobs, searchTerm, activeCategory, chainFilter, remoteOnly, aiOnly]);

    const categoryCounts = useMemo(() => {
        const baseJobs = jobs.filter(job => {
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
    }, [jobs, searchTerm, chainFilter, remoteOnly, aiOnly]);

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

                {/* EMAIL OPT-IN */}
                <EmailOptIn />

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

// ─── Classification helpers ────────────────────────────────────────────────

const AI_WEB3_TITLE_KEYWORDS = [
    'ai agent', 'ml engineer', 'machine learning', 'llm', 'artificial intelligence',
    'nlp', 'deep learning', 'data scientist', 'ai engineer', 'langchain',
    'on-chain ml', 'decentralized ai', 'ai researcher', 'prompt engineer',
    'ai product', 'ai developer', 'computer vision', 'generative ai'
]

const AI_WEB3_COMPANY_KEYWORDS = [
    'fetch.ai', 'bittensor', 'ocean protocol', 'akash', 'singularitynet',
    'ritual', 'gensyn', 'modulus', 'inference labs'
]

const ENGINEERING_KEYWORDS = [
    'solidity', 'smart contract', 'blockchain developer', 'rust developer',
    'protocol engineer', 'zk engineer', 'zero-knowledge', 'evm', 'frontend engineer',
    'backend engineer', 'full stack', 'devops', 'infrastructure engineer',
    'release engineer', 'software engineer', 'web3 developer', 'dapp'
]

const SECURITY_KEYWORDS = [
    'security engineer', 'auditor', 'penetration', 'vulnerability', 'security researcher',
    'smart contract audit', 'security analyst', 'incident response'
]

const PRODUCT_KEYWORDS = [
    'product manager', 'product designer', 'ux designer', 'ui designer',
    'product lead', 'product owner', 'head of product'
]

const RESEARCH_KEYWORDS = [
    'researcher', 'quantitative researcher', 'economist', 'tokenomics',
    'quant trader', 'quant researcher', 'data analyst', 'research scientist'
]

const COMMUNITY_KEYWORDS = [
    'community manager', 'community lead', 'social media', 'content manager',
    'marketing manager', 'growth', 'community'
]

function classifyJob(job: { title: string; company: string; tags: string[] }): string {
    const titleLower = job.title.toLowerCase()
    const companyLower = job.company.toLowerCase()
    const tagsLower = (job.tags || []).join(' ').toLowerCase()
    const fullText = `${titleLower} ${tagsLower}`

    const aiTitleMatch = AI_WEB3_TITLE_KEYWORDS.some(kw => titleLower.includes(kw))
    const aiCompanyMatch = AI_WEB3_COMPANY_KEYWORDS.some(kw => companyLower.includes(kw))
    if (aiTitleMatch || aiCompanyMatch) return 'AI × Web3'

    if (SECURITY_KEYWORDS.some(kw => titleLower.includes(kw))) return 'Security'
    if (PRODUCT_KEYWORDS.some(kw => titleLower.includes(kw))) return 'Product'
    if (RESEARCH_KEYWORDS.some(kw => titleLower.includes(kw))) return 'Research'
    if (COMMUNITY_KEYWORDS.some(kw => titleLower.includes(kw))) return 'Community'
    if (ENGINEERING_KEYWORDS.some(kw => fullText.includes(kw))) return 'Engineering'

    return 'Other'
}

function normalizeSalary(salary: string | null | undefined): string | undefined {
    if (!salary || salary.trim() === '' || salary === '-') return undefined
    let s = salary.trim()
    s = s.replace(/^USD\s*/i, '$').replace(/\bUSD\b/gi, '')
    s = s.replace(/\$(\d+),(\d)k/gi, (_, a) => `$${a}K`)
    s = s.replace(/(\d)\s*k/gi, '$1K')
    s = s.replace(/\s*[-\u2013\u2014]\s*/g, '\u2013')
    s = s.replace(/\s*\(Est\.\)/gi, '')
    s = s.replace(/\s+/g, ' ').trim()
    if (!s || s === '\u2013' || s === '-') return undefined
    return s
}

function cleanJobTitle(title: string): string {
    if (!title) return title
    let t = title.trim()
    t = t.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/gu, '')
    const prefixes = [
        /^we'?re hiring[:\s]*/i,
        /^\[hiring\][:\s]*/i,
        /^now hiring[:\s]*/i,
        /^job opening[:\s]*/i,
        /^open role[:\s]*/i,
        /^opportunity[:\s]*/i,
    ]
    for (const prefix of prefixes) {
        t = t.replace(prefix, '')
    }
    t = t.replace(/\s*[-\u2013|]\s*(accelerator|program|internship program).*$/i, '')
    t = t.replace(/\s+/g, ' ').trim()
    if (t.length > 0) t = t.charAt(0).toUpperCase() + t.slice(1)
    return t
}

// Apply transforms to a raw Web3Job
function normalizeJob(job: Web3Job): Web3Job {
    return {
        ...job,
        title: cleanJobTitle(job.title),
        salary: normalizeSalary(job.salary),
        category: classifyJob(job),
    }
}

// Keep getCategoryForJob as thin wrapper using classifyJob
function getCategoryForJob(job: Web3Job): string {
    return job.category || classifyJob(job)
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

// ─── EmailOptIn component ──────────────────────────────────────────────────

function EmailOptIn() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

    async function subscribe() {
        if (!email || !email.includes('@')) return
        setStatus('loading')
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, tag: 'jobs-page' })
            })
            if (res.ok) setStatus('done')
            else setStatus('error')
        } catch {
            setStatus('error')
        }
    }

    return (
        <div style={{
            margin: '40px 0',
            padding: '28px',
            background: '#0A0F16',
            border: '1px solid #1A2332',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '24px',
            alignItems: 'center'
        }}>
            <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: '#D8E8F8', marginBottom: '6px' }}>
                    Get new Web3 roles in your inbox
                </div>
                <div style={{ fontSize: '12px', color: '#4A6A8A', fontFamily: 'DM Mono, monospace' }}>
                    Weekly digest. Web3 + AI × Web3 roles only. No spam. Unsubscribe anytime.
                </div>
            </div>
            {status === 'done' ? (
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#00D2FF' }}>
                    ✓ You&apos;re on the list
                </div>
            ) : (
                <div style={{ display: 'flex' }}>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && subscribe()}
                        style={{
                            background: '#080C10',
                            border: '1px solid #1A2332',
                            borderRight: 'none',
                            padding: '11px 14px',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '12px',
                            color: '#C8D6E8',
                            outline: 'none',
                            width: '220px'
                        }}
                    />
                    <button
                        onClick={subscribe}
                        disabled={status === 'loading'}
                        style={{
                            background: status === 'loading' ? '#006A80' : '#00D2FF',
                            color: '#060D14',
                            border: 'none',
                            padding: '11px 18px',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '11px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            letterSpacing: '0.1em',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {status === 'loading' ? 'SENDING...' : 'SUBSCRIBE →'}
                    </button>
                </div>
            )}
            {status === 'error' && (
                <div style={{ gridColumn: '1/-1', fontSize: '11px', color: '#FF6B6B', fontFamily: 'DM Mono, monospace' }}>
                    Something went wrong. Please try again.
                </div>
            )}
        </div>
    )
}
