"use client";

import { NormalizedAIJob } from "@/lib/remotive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Clock, ChevronRight } from "lucide-react";

import Link from "next/link";

const CHAIN_COLORS: Record<string, string> = {
    Ethereum: "#627EEA", Solana: "#9945FF", Polygon: "#8247E5",
    Starknet: "#EC796B", "Multi-chain": "#00D2FF", Cosmos: "#2E9E7A",
    Bittensor: "#E6007A"
};

interface AIJobCardProps {
    job: NormalizedAIJob;
    featured?: boolean;
}

function timeAgoShort(dateString: string) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
}

export function AIJobCard({ job, featured = false }: AIJobCardProps) {
    const eval_ = job.aiEvaluation;
    const isAI = eval_?.relevant || job.source === 'remotive';
    const displayTitle = eval_?.rewrittenTitle || job.title;
    const displayTags = eval_?.tags?.length ? eval_.tags : job.tags;
    
    const textLower = `${job.title} ${job.description} ${displayTags.join(' ')}`.toLowerCase();
    let chain = "Multi-chain";
    if (textLower.includes("solana")) chain = "Solana";
    else if (textLower.includes("ethereum") || textLower.includes("evm")) chain = "Ethereum";
    else if (textLower.includes("polygon")) chain = "Polygon";
    else if (textLower.includes("starknet")) chain = "Starknet";
    else if (textLower.includes("bittensor")) chain = "Bittensor";

    const c = CHAIN_COLORS[chain] || "#4A6A8A";

    return (
        <Link 
            href={`/jobs/${job.slug}`}
            className="block group"
        >
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-5 border-b border-white/5 transition-all duration-200 relative overflow-hidden bg-card/20 hover:bg-card/40 backdrop-blur-sm ${
                featured ? "border-l-[3px] border-l-primary bg-gradient-to-r from-primary/5 to-transparent" : "border-l-[3px] border-l-transparent hover:border-l-primary/50"
            }`}>
                
                {featured && (
                    <div className="absolute top-2 right-3 font-mono text-[9px] tracking-wider text-primary font-semibold">
                        FEATURED
                    </div>
                )}

                {/* Logo and Main Info */}
                <div className="flex items-start gap-4 md:gap-5 flex-1 min-w-0 pl-1">
                    <div 
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background border flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner transition-colors"
                        style={{ borderColor: `${c}33` }}
                    >
                        {job.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-xl font-bold" style={{ color: c }}>{job.company.charAt(0)}</div>
                        )}
                    </div>
                    <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {displayTitle}
                            </h3>
                            {job.salary && (
                                <Badge variant="secondary" className="hidden lg:inline-flex bg-green-500/10 text-green-400 hover:bg-green-500/20 text-[10px] font-semibold tracking-wider border-green-500/20">
                                    {job.salary}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <span className="font-semibold text-foreground/80">{job.company}</span>
                            <span className="hidden sm:inline text-white/20">•</span>
                            <span className="flex items-center gap-1.5">
                                {job.remote ? <Globe className="w-3.5 h-3.5 text-primary/70" /> : <MapPin className="w-3.5 h-3.5 opacity-70" />}
                                {job.location}
                            </span>
                            <span className="hidden sm:inline text-white/20">•</span>
                            <span style={{ color: c, fontSize: '12px' }} className="font-mono">{chain}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1.5">
                            {displayTags.slice(0, 4).map((tag) => (
                                <Badge key={tag} variant="outline" className="bg-background/50 hover:bg-white/[0.08] text-xs font-medium border-white/5 text-muted-foreground transition-colors">
                                    {tag}
                                </Badge>
                            ))}
                            {isAI && (
                                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 text-xs">
                                    AI × Web3
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side Info */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-3 shrink-0">
                    {/* Mobile Salary */}
                    {job.salary && (
                        <div className="lg:hidden text-sm font-semibold text-green-400">
                            {job.salary}
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 opacity-60" />
                        {timeAgoShort(job.created_at)}
                    </div>
                    <Button size="sm" variant="default" className="hidden sm:flex md:w-28 bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs font-bold gap-1 shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)] transition-all group-hover:scale-105">
                        Apply <ChevronRight className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </Link>
    );
}
