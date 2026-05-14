import { fetchUnifiedJobBySlug, fetchAIWeb3Jobs } from "@/lib/ai-web3-jobs";
import { fetchWeb3Jobs } from "@/lib/web3Career";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Building2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils";
import { Metadata } from "next";
import { JobSummaryCard } from "@/components/jobs/JobSummaryCard";
import { TrustScorePanel } from "@/components/jobs/TrustScorePanel";
import { CareerCoachPanel } from "@/components/jobs/CareerCoachPanel";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const resolvedParams = await params;
    const job = await fetchUnifiedJobBySlug(resolvedParams.slug);

    if (!job) {
        return {
            title: "Job Not Found | ApexWeb3",
        };
    }

    return {
        title: `${job.title} at ${job.company} | ApexWeb3 Jobs`,
        description: `Apply for the ${job.title} role at ${job.company}. ${job.location}`,
    };
}

export default async function JobDetailsPage({ params }: Props) {
    const resolvedParams = await params;
    const job = await fetchUnifiedJobBySlug(resolvedParams.slug);

    if (!job) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#080C10] pb-24">
            {/* Header / Navigation */}
            <div className="bg-card/30 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="container max-w-5xl mx-auto px-5 h-16 flex items-center">
                    <Link
                        href="/jobs"
                        className="flex items-center text-xs font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                    >
                        <ArrowLeft className="mr-2 w-3.5 h-3.5" />
                        Back to Terminal
                    </Link>
                </div>
            </div>

            <div className="container max-w-5xl mx-auto px-5 mt-12">
                <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                    
                    {/* Left Column: Content */}
                    <div className="space-y-8">
                        
                        {/* HEADER BLOCK */}
                        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Building2 className="w-24 h-24 rotate-12" />
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-background border border-white/10 rounded-2xl p-3 flex items-center justify-center shadow-2xl">
                                    {job.logo ? (
                                        <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-3xl font-bold text-primary">{job.company.charAt(0)}</div>
                                    )}
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">◈ {job.source === 'remotive' ? 'REMOTE_ONLY' : 'WEB3_ORIGINAL'}</span>
                                        <span className="opacity-20">•</span>
                                        <span>{formatTimeAgo(job.created_at)}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                                        {job.title}
                                    </h1>
                                    <div className="flex items-center gap-3 text-lg font-medium text-muted-foreground">
                                        <span className="text-foreground">{job.company}</span>
                                        <span className="opacity-20">•</span>
                                        <span className="flex items-center gap-1.5 text-sm">
                                            <MapPin className="w-4 h-4 text-primary/70" />
                                            {job.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-6 text-sm font-mono text-muted-foreground uppercase tracking-wider">
                                {job.salary && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] opacity-40">SALARY_EST</span>
                                        <span className="text-green-400 font-bold">{job.salary}</span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] opacity-40">WORK_MODE</span>
                                    <span className="text-primary font-bold">{job.remote ? '◉ REMOTE' : 'LOCAL'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] opacity-40">POST_AUTH</span>
                                    <span className="text-foreground/80">VERIFIED</span>
                                </div>
                            </div>
                        </div>

                        {/* TL;DR / AI SUMMARY */}
                        <JobSummaryCard job={job} />

                        {/* DESCRIPTION */}
                        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                            <div className="bg-card/40 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary" />
                                    Job_Description.md
                                </h2>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                                </div>
                            </div>
                            <div className="p-6 md:p-10">
                                <article className="prose prose-invert prose-brand max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
                                    {job.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: job.description }} />
                                    ) : (
                                        <p className="italic opacity-50">No detailed description available.</p>
                                    )}
                                </article>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions / Meta */}
                    <div className="space-y-6">
                        
                        {/* SKILLS */}
                        <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                ◈ STACK_TAGS
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {job.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="bg-background/50 border-white/10 text-muted-foreground font-mono text-[10px]">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* SIDEBAR PANELS */}
                        <TrustScorePanel job={job} />
                        <CareerCoachPanel job={job} />

                        <div className="bg-card/20 border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                ◈ COMPANY_INFO
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                                {job.company} is actively hiring in the {job.tags.slice(0,2).join(', ')} sector. Use our AI Career Coach for interview prep.
                            </p>
                        </div>

                        {/* APPLY BOX - MOVED TO BOTTOM */}
                        <div className="bg-gradient-to-b from-primary/10 to-card/40 border border-primary/20 rounded-2xl p-6 shadow-2xl shadow-primary/5">
                            <h3 className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                ▣ SYSTEM_ACTION
                            </h3>
                            <div className="space-y-4">
                                <Button size="lg" asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_25px_rgba(0,210,255,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                    <a target="_blank" rel="noopener noreferrer" href={job.apply_url || job.url}>
                                        APPLY NOW <ExternalLink className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground font-mono leading-relaxed px-4">
                                    EXTERNAL_SOURCE_AUTH: {job.source?.toUpperCase()}<br/>
                                    REDIRECT_SAFE: TRUE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export async function generateStaticParams() {
    // Fetch slugs from both AI list (which includes Remotive) and standard list
    const [{ jobs: aiJobs }, { jobs: web3Jobs }] = await Promise.all([
        fetchAIWeb3Jobs(),
        fetchWeb3Jobs()
    ]);

    // Combine and deduplicate slugs
    const allSlugs = new Set([
        ...aiJobs.map(j => j.slug),
        ...web3Jobs.map(j => j.slug)
    ]);

    return Array.from(allSlugs).map(slug => ({ slug }));
}

export const revalidate = 3600; // ISR: Revalidate every hour
