import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, CalendarDays, Globe } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { Web3Job } from "@/types/job";

interface JobHighlightsProps {
    job: Web3Job;
}

export function JobHighlights({ job }: JobHighlightsProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Company & Location Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">

                {/* Company */}
                <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-md border border-white/5">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{job.company}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-md border border-white/5">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                </div>

                {/* Remote Badge */}
                {job.remote && (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Remote</span>
                    </div>
                )}

                {/* Date Posted */}
                <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>Posted {formatTimeAgo(job.created_at)}</span>
                </div>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 text-xs font-medium bg-secondary/50 hover:bg-secondary/70 border-transparent transition-colors"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
