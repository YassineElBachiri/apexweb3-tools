import { fetchUnifiedJobs } from "@/lib/ai-web3-jobs";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { SeoContent } from "@/components/jobs/SeoContent";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Web3 Jobs Board — Blockchain & Crypto Careers | ApexWeb3",
    description: "Discover thousands of Web3 jobs. Remote crypto jobs, blockchain engineering, DeFi, NFT, and smart contract roles.",
    openGraph: {
        title: "Web3 Jobs Board | ApexWeb3",
        description: "Discover thousands of Web3 jobs.",
    }
};

export default async function JobsPage() {
    const { jobs, error } = await fetchUnifiedJobs();

    return (
        <main className="min-h-screen bg-[#080C10]">
            <Suspense fallback={<div className="container py-12 text-center text-[#4A6A8A] font-mono">Loading the Web3 Jobs Board...</div>}>
                <JobsDashboard initialJobs={jobs} error={error ?? null} />
            </Suspense>
            
            <SeoContent />
        </main>
    );
}
