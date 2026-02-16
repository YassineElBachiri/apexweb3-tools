"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, X, Building2, MapPin, Globe, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ApplyButtonProps {
    applyUrl: string;
    jobTitle: string;
    company: string;
    location?: string;
    remote?: boolean;
    tags?: string[];
    summary?: string;
    className?: string;
}

export function ApplyButton({
    applyUrl,
    jobTitle,
    company,
    location,
    remote,
    tags,
    summary,
    className = ""
}: ApplyButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleInitialClick = () => {
        setIsOpen(true);
        trackEvent("apply_button_click", {
            job_title: jobTitle,
            company: company,
            source: "job_detail_page"
        });
    };

    const handleConfirmClick = () => {
        trackEvent("apply_confirm_click", {
            job_title: jobTitle,
            company: company,
            url: applyUrl
        });
        window.open(applyUrl, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };

    return (
        <>
            <Button
                size="lg"
                onClick={handleInitialClick}
                className={`w-full font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 ${className}`}
            >
                <span className="flex items-center gap-2">
                    Apply on Web3.career
                    <ExternalLink className="w-4 h-4" />
                </span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-6 sm:p-8 space-y-6">
                                {/* Header */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Apply for {jobTitle}</h2>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="w-4 h-4" />
                                        <span>{company}</span>
                                    </div>
                                </div>

                                {/* Summary */}
                                {summary && (
                                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            Key Highlights
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {summary}
                                        </p>
                                    </div>
                                )}

                                {/* Job Details Grid */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {(location || remote) && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-muted-foreground font-medium">Location</span>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <span>{location || "Remote"}</span>
                                            </div>
                                        </div>
                                    )}
                                    {remote && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-muted-foreground font-medium">Work Type</span>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-blue-400" />
                                                <span className="text-blue-400">Remote</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {tags && tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.slice(0, 5).map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Disclaimer */}
                                <p className="text-xs text-muted-foreground text-center pt-2">
                                    You will be redirected to the official application page.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button className="flex-1" onClick={handleConfirmClick}>
                                        Continue to Apply
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
