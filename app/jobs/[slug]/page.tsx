import { fetchJobBySlug, fetchWeb3Jobs } from "@/lib/web3Career";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { JobCard } from "@/components/jobs/JobCard";
import { JobHighlights } from "@/components/jobs/JobHighlights"; // Import new component
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Briefcase, CheckCircle2, Code2, FileText } from "lucide-react";
import Link from "next/link";
import { generateJobSummary } from "@/lib/generateSummary"; // Import new helper
import { generateJobPostingJSONLD } from "@/lib/generateJobStructuredData"; // Import new helper

// --- Helper for parsing description sections ---
function parseJobDescription(description: string | undefined): {
    overview: string;
    responsibilities: string[];
    requirements: string[];
    techStack: string[];
    extras: string;
} {
    const result = {
        overview: "",
        responsibilities: [] as string[],
        requirements: [] as string[],
        techStack: [] as string[],
        extras: "",
    };

    if (!description) return result;

    // Strip HTML tags for parsing, keep raw for fallback
    const plainText = description
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?(p|div|li|ul|ol|h[1-6])[^>]*>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');

    const lines = plainText.split("\n").map(l => l.trim()).filter(Boolean);

    let currentSection: "overview" | "responsibilities" | "requirements" | "tech" | "extras" = "overview";
    const overviewLines: string[] = [];
    const extrasLines: string[] = [];

    for (const line of lines) {
        const lower = line.toLowerCase();

        // Detect section headings
        if (/responsibilit|what you.?ll do|your role|duties|key tasks/i.test(lower)) {
            currentSection = "responsibilities";
            continue;
        }
        if (/requirement|qualif|what we.?re looking|must have|you have|skills|experience needed/i.test(lower)) {
            currentSection = "requirements";
            continue;
        }
        if (/tech stack|technologies|tools we use|stack|technical environment/i.test(lower)) {
            currentSection = "tech";
            continue;
        }
        if (/nice to have|bonus|perks|benefits|what we offer|why join|about us|about the company/i.test(lower)) {
            currentSection = "extras";
            continue;
        }

        // Clean bullet-point prefixes
        const cleaned = line.replace(/^[-•*·>]+\s*/, "").trim();
        if (!cleaned) continue;

        switch (currentSection) {
            case "overview":
                overviewLines.push(cleaned);
                break;
            case "responsibilities":
                result.responsibilities.push(cleaned);
                break;
            case "requirements":
                result.requirements.push(cleaned);
                break;
            case "tech":
                result.techStack.push(cleaned);
                break;
            case "extras":
                extrasLines.push(cleaned);
                break;
        }
    }

    result.overview = overviewLines.join(" ");
    result.extras = extrasLines.join(" ");

    return result;
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

// --- Metadata Generation ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const job = await fetchJobBySlug(slug);

    if (!job) {
        return {
            title: "Job Not Found | ApexWeb3",
            description: "The job you're looking for could not be found."
        };
    }

    // AI Summary / Fallback for Description
    const summary = generateJobSummary(job.description || "");
    const description = `${summary} Apply at ${job.company}. ${job.location}. ${job.tags.slice(0, 3).join(", ")}.`;

    // Title: [Job Title] | [Tag/Tech] | [City, Country]
    const mainTag = job.tags.length > 0 ? job.tags[0] : (job.remote ? "Remote" : "Web3");
    const title = `${job.title} | ${mainTag} | ${job.location}`;

    return {
        title,
        description: description.substring(0, 160), // Hard limit for safety
        alternates: {
            canonical: `https://apexweb3.com/jobs/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://apexweb3.com/jobs/${slug}`,
            siteName: "ApexWeb3 Tools",
            locale: "en_US",
            type: "website",
            images: job.logo ? [{ url: job.logo }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function JobDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const job = await fetchJobBySlug(slug);

    if (!job) {
        notFound();
    }

    // Fetch related jobs (same tags)
    const { jobs: allJobs } = await fetchWeb3Jobs();
    const relatedJobs = allJobs
        .filter(j =>
            j.id !== job.id &&
            j.tags.some(tag => job.tags.includes(tag))
        )
        .slice(0, 3);

    // Generate JSON-LD structured data
    const jsonLd = generateJobPostingJSONLD(job);

    return (
        <div className="min-h-screen bg-background">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd }}
            />

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="container max-w-5xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[200px]">{job.title}</span>
                </div>

                {/* Hero Section */}
                <Card className="mb-8 overflow-hidden border-white/10 bg-card/40 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Company Logo */}
                            {job.logo ? (
                                <div className="w-20 h-20 rounded-xl bg-white p-2 shrink-0 shadow-md border border-border/50">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-muted/50 shrink-0 flex items-center justify-center border border-border/50">
                                    <Building2 className="w-10 h-10 text-muted-foreground/50" />
                                </div>
                            )}

                            {/* Job Info */}
                            <div className="flex-1 space-y-4">
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>

                                {/* Refactored Highlights Component */}
                                <JobHighlights job={job} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Structured Job Description */}
                {(() => {
                    const parsed = parseJobDescription(job.description);
                    const hasSections = parsed.responsibilities.length > 0 || parsed.requirements.length > 0 || parsed.techStack.length > 0;

                    return (
                        <div className="space-y-6 mb-8">
                            {/* Overview */}
                            {parsed.overview && (
                                <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <FileText className="w-5 h-5 text-primary" />
                                            </div>
                                            <h2 className="text-2xl font-bold">Overview</h2>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {parsed.overview}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Responsibilities */}
                            {parsed.responsibilities.length > 0 && (
                                <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                <Briefcase className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold">Responsibilities</h2>
                                        </div>
                                        <ul className="space-y-3">
                                            {parsed.responsibilities.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Requirements */}
                            {parsed.requirements.length > 0 && (
                                <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-green-500/10">
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold">Requirements</h2>
                                        </div>
                                        <ul className="space-y-3">
                                            {parsed.requirements.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500/60 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tech Stack */}
                            {parsed.techStack.length > 0 && (
                                <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-purple-500/10">
                                                <Code2 className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold">Tech Stack</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {parsed.techStack.map((tech, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="px-3 py-1.5 text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Extras / Benefits (if any) */}
                            {parsed.extras && (
                                <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <h2 className="text-2xl font-bold mb-4">Additional Info</h2>
                                        <p className="text-muted-foreground leading-relaxed">{parsed.extras}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Raw Description Fallback (when no sections detected) */}
                            {!hasSections && !parsed.overview && (
                                <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <FileText className="w-5 h-5 text-primary" />
                                            </div>
                                            <h2 className="text-2xl font-bold">Job Description</h2>
                                        </div>
                                        <div
                                            className="prose prose-invert prose-sm md:prose-base max-w-none"
                                            dangerouslySetInnerHTML={{ __html: job.description || "No description provided." }}
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    );
                })()}

                {/* Apply Button — After Description */}
                <Card className="mb-8 border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-8 text-center space-y-4">
                        <h2 className="text-2xl font-bold">Interested in this role?</h2>
                        <p className="text-muted-foreground">
                            Apply directly on Web3.career to submit your application for <span className="text-foreground font-medium">{job.title}</span> at <span className="text-foreground font-medium">{job.company}</span>.
                        </p>
                        <div className="max-w-md mx-auto">
                            <ApplyButton
                                applyUrl={job.apply_url}
                                jobTitle={job.title}
                                company={job.company}
                                location={job.location}
                                remote={job.remote}
                                tags={job.tags}
                                summary={generateJobSummary(job.description || "")}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Related Jobs */}
                {relatedJobs.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedJobs.map((relatedJob) => (
                                <JobCard key={relatedJob.id} job={relatedJob} />
                            ))}
                        </div>
                    </div>
                )}

                {/* SEO Content Block */}
                <div className="mt-12 p-6 bg-card/20 backdrop-blur-sm rounded-xl border border-white/5">
                    <h2 className="text-xl font-semibold mb-3">About Web3 Jobs at ApexWeb3</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Find the best Web3, Crypto, and Blockchain career opportunities. Our job board features
                        remote and on-site positions from leading companies in the decentralized ecosystem.
                        Browse developer, engineering, marketing, design, and business roles in DeFi, NFTs,
                        and blockchain infrastructure.
                    </p>
                </div>
            </div>

            {/* Sticky Apply Button (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-white/10 z-50">
                <ApplyButton
                    applyUrl={job.apply_url}
                    jobTitle={job.title}
                    company={job.company}
                    location={job.location}
                    remote={job.remote}
                    tags={job.tags}
                    summary={generateJobSummary(job.description || "")}
                />
            </div>
        </div>
    );
}

// Generate static params for top jobs for ISR
export async function generateStaticParams() {
    const { jobs } = await fetchWeb3Jobs();

    // Generate static pages for first 50 jobs
    // In a real production build with thousands of pages, we might want to increase this 
    // or rely on on-demand ISR for the rest (by not returning them here but setting fallback to blocking/true)
    // Next.js default behavior for generic generateStaticParams in app router with dynamic routes
    // is to build what is returned and for others, it depends on `dynamicParams` (default true)
    return jobs.slice(0, 50).map((job) => ({
        slug: job.slug,
    }));
}

// Revalidate every hour
export const revalidate = 3600;

