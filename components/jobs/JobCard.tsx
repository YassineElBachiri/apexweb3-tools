import { Web3Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils";

interface JobCardProps {
    job: Web3Job;
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="group relative hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full overflow-hidden border-white/5 bg-card/40 backdrop-blur-sm hover:-translate-y-1">
            {/* Gradient Border on Hover */}
            <div
                className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    maskImage: 'linear-gradient(white, white), linear-gradient(white, white)',
                    maskClip: 'content-box, border-box',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    WebkitMaskImage: 'linear-gradient(white, white), linear-gradient(white, white)',
                    WebkitMaskClip: 'content-box, border-box'
                }}
            />

            <CardHeader className="pb-3 space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                        <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                            {job.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span>{job.company}</span>
                        </CardDescription>
                    </div>
                    {job.logo ? (
                        <div className="w-12 h-12 rounded-xl bg-white p-1.5 shrink-0 shadow-sm border border-border/50 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-muted/50 p-1.5 shrink-0 flex items-center justify-center border border-border/50">
                            <Building2 className="w-6 h-6 text-muted-foreground/50" />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4 space-y-4">
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground/80">
                    <div className="flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-md border border-white/5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]">{job.location}</span>
                    </div>
                    {job.salary && (
                        <div className="flex items-center gap-1.5 font-medium text-green-500/90 bg-green-500/10 px-2.5 py-1 rounded-md border border-green-500/10">
                            <span>💰 {job.salary}</span>
                        </div>
                    )}
                </div>

                {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {job.description.replace(/<[^>]+>/g, '')}
                    </p>
                )}

                <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 3).map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="px-2.5 py-0.5 text-xs font-medium bg-secondary/50 hover:bg-secondary/70 border-transparent transition-colors"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {job.tags.length > 3 && (
                        <Badge variant="outline" className="px-2 py-0.5 text-xs text-muted-foreground/70 border-dashed">
                            +{job.tags.length - 3}
                        </Badge>
                    )}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground/60">
                    <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        <span>{formatTimeAgo(job.created_at)}</span>
                    </div>
                    {job.remote && (
                        <span className="flex items-center gap-1 text-blue-400 font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Remote
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 pb-5 z-20 relative flex gap-3">
                <Button asChild variant="outline" className="flex-1 font-semibold border-white/10 hover:bg-white/5 transition-all duration-300" size="default">
                    <Link
                        href={`/jobs/${job.slug}`}
                    >
                        View Details
                    </Link>
                </Button>
                {job.apply_url && (
                    <Button asChild className="flex-1 font-semibold shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all duration-300" size="default">
                        <a
                            href={job.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                        >
                            Apply Hub
                        </a>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
