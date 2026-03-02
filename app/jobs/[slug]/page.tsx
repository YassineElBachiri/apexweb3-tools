import { fetchJobBySlug } from "@/lib/web3Career";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Building2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const job = await fetchJobBySlug(resolvedParams.slug);

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
    const job = await fetchJobBySlug(resolvedParams.slug);

    if (!job) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background border-t border-white/5 py-12">
            <div className="container max-w-4xl mx-auto px-4">

                {/* Back Link */}
                <Link
                    href="/jobs"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to All Jobs
                </Link>

                {/* Job Header Card */}
                <div className="bg-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:p-10 mb-8 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                        <div className="flex items-start gap-4 flex-1">
                            {job.logo ? (
                                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-white p-2 rounded-2xl shadow-sm border border-border/50 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-muted/50 p-2 rounded-2xl border border-border/50 flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                            )}

                            <div className="space-y-2">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                                    {job.title}
                                </h1>
                                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                                    <Building2 className="w-5 h-5" />
                                    <span className="font-semibold text-foreground/80">{job.company}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sticky/Fixed Width Apply Button on Desktop */}
                        <div className="md:w-auto w-full shrink-0">
                            {job.apply_url ? (
                                <Button size="lg" asChild className="w-full shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all font-bold text-white">
                                    <a target="_blank" rel="noopener noreferrer" href={job.apply_url}>
                                        Apply for Role <ExternalLink className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                            ) : (
                                <Button size="lg" asChild className="w-full">
                                    <a target="_blank" rel="noopener noreferrer" href={job.url}>
                                        View Original Listing <ExternalLink className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-y-4 gap-x-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 text-brand-blue" />
                            <span>{job.location}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center gap-2 text-green-400 font-medium">
                                <span>💰 {job.salary}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarDays className="w-4 h-4 text-brand-purple" />
                            <span>Posted {formatTimeAgo(job.created_at)}</span>
                        </div>
                        {job.remote && (
                            <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Remote
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Description & Side Meta */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <article className="lg:col-span-2">
                        <div className="bg-card/20 border border-white/5 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-foreground">
                                <span className="bg-brand-blue/20 text-brand-blue p-1.5 rounded-md mr-3">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </span>
                                Role Description
                            </h2>
                            {job.description ? (
                                <div
                                    className="prose prose-invert prose-brand max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-brand-blue hover:prose-a:text-brand-purple prose-a:transition-colors prose-strong:text-foreground"
                                    dangerouslySetInnerHTML={{ __html: job.description }}
                                />
                            ) : (
                                <p className="text-muted-foreground italic">No detailed description provided by the employer.</p>
                            )}
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-card/20 border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-foreground border-b border-white/5 pb-2">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.tags.length > 0 ? (
                                    job.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="px-3 py-1 bg-secondary/40 hover:bg-brand-blue/20 hover:text-brand-blue transition-colors text-sm"
                                        >
                                            {tag}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">Not specified</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-card/20 border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-foreground border-b border-white/5 pb-2">About {job.company}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {job.company} is hiring heavily in the Web3, Crypto, and Blockchain space.
                            </p>
                            <Button variant="outline" className="w-full text-sm font-medium border-white/10 hover:bg-white/5" asChild>
                                {job.apply_url ? (
                                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply Now</a>
                                ) : (
                                    <a href={job.url} target="_blank" rel="noopener noreferrer">View Organization</a>
                                )}
                            </Button>
                        </div>
                    </aside>
                </div>

            </div>
        </main>
    );
}

export const revalidate = 3600; // ISR: Revalidate every hour
