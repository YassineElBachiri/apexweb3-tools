"use client";

import { useState, useMemo } from "react";
import { Web3Job, JobFilter } from "@/types/job";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { AnimatePresence, motion } from "framer-motion";

interface JobsDashboardProps {
    initialJobs: Web3Job[];
    error?: string;
    initialFilters?: Partial<JobFilter>;
}

export function JobsDashboard({ initialJobs, error, initialFilters = {} }: JobsDashboardProps) {
    const [filters, setFilters] = useState<Partial<JobFilter>>({
        remoteOnly: false,
        tag: "",
        ...initialFilters
    });

    // Client-side filtering for "Instant feedback"
    const filteredJobs = useMemo(() => {
        return initialJobs.filter((job) => {
            // Remote Filter
            if (filters.remoteOnly && !job.remote) {
                return false;
            }

            // Tag/Search Filter (Merged concept for simplicity or split if needed)
            if (filters.tag && filters.tag !== "all") {
                const searchLower = filters.tag.toLowerCase();
                const matchesTag = job.tags.some(t => t.toLowerCase().includes(searchLower));
                const matchesTitle = job.title.toLowerCase().includes(searchLower);
                const matchesCompany = job.company.toLowerCase().includes(searchLower);

                if (!matchesTag && !matchesTitle && !matchesCompany) {
                    return false;
                }
            }

            return true;
        });
    }, [initialJobs, filters]);

    const handleFilterChange = (newFilters: Partial<JobFilter>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    if (error === "MISSING_TOKEN") {
        return (
            <div className="container py-20 max-w-4xl mx-auto px-4 text-center">
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-destructive mb-2">Configuration Required</h2>
                    <p className="text-muted-foreground mb-4">
                        The <code>WEB3_CAREER_TOKEN</code> is missing from your environment variables.
                    </p>
                    <div className="bg-background/50 p-4 rounded-md inline-block text-left text-sm font-mono overflow-x-auto max-w-full">
                        WEB3_CAREER_TOKEN=your_token_here
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                {/* Top Center Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40" />
                {/* Bottom Left Splash */}
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="container py-12 max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Section */}
                <div className="mb-12 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {filters.tag && filters.tag !== "all" ? `${filters.tag} Jobs` : "Web3 Jobs"}
                            </span>{" "}
                            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                & Careers
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Discover the future of work. Browse <span className="text-foreground font-semibold">{initialJobs.length}</span> active listings in Blockchain, DeFi, and Crypto.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <JobFilters onFilterChange={handleFilterChange} />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <JobCard job={job} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-dashed p-10 max-w-md mx-auto">
                            <p className="text-xl font-semibold text-muted-foreground mb-4">No jobs match your search.</p>
                            <button
                                onClick={() => setFilters({ remoteOnly: false, tag: "" })}
                                className="text-primary font-medium hover:underline underline-offset-4"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
