"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ApplyButtonProps {
    applyUrl: string;
    jobTitle: string;
    company: string;
    className?: string;
}

export function ApplyButton({ applyUrl, jobTitle, company, className = "" }: ApplyButtonProps) {
    const handleClick = () => {
        trackEvent("apply_job_click", {
            job_title: jobTitle,
            company: company,
            source: "job_detail_page"
        });
    };

    return (
        <Button
            asChild
            size="lg"
            className={`w-full font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 ${className}`}
        >
            <a
                href={applyUrl}
                target="_blank"
                rel="follow"
                onClick={handleClick}
                className="flex items-center gap-2"
            >
                <span>Apply on Web3.career</span>
                <ExternalLink className="w-4 h-4" />
            </a>
        </Button>
    );
}
