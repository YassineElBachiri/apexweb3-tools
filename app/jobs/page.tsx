import { fetchWeb3Jobs } from "@/lib/web3Career";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { SeoContent } from "@/components/jobs/SeoContent";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Web3 Jobs Board — Blockchain & Crypto Careers | ApexWeb3",
    description: "Browse thousands of live Web3, Crypto, and Blockchain jobs. Filter by role, tech stack, and remote-readiness. Your gateway to the decentralized workforce.",
    keywords: ["web3 jobs", "blockchain jobs", "crypto careers", "solidity jobs", "remote web3 jobs"],
    alternates: {
        canonical: "https://apexweb3.com/jobs",
    },
};

export default async function JobsPage() {
    const { jobs, error } = await fetchWeb3Jobs();

    return (
        <main className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <Suspense fallback={<div className="container py-12 text-center text-muted-foreground">Loading the Web3 Jobs Board...</div>}>
                <JobsDashboard initialJobs={jobs} error={error} />
            </Suspense>
            <SeoContent />
        </main>
    );
}

export const revalidate = 3600; // Revalidate every hour
