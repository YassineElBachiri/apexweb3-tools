import { fetchUnifiedJobs } from "@/lib/ai-web3-jobs";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { SeoContent } from "@/components/jobs/SeoContent";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Web3 Jobs Board — Blockchain & Crypto Careers | ApexWeb3",
    description: "Browse 200+ live Web3 jobs. Remote blockchain engineering, DeFi, Solidity, Rust, AI × Web3, and crypto careers. Updated daily. Apply directly — no middlemen.",
    keywords: "web3 jobs, blockchain jobs, crypto jobs, solidity engineer, defi jobs, remote web3, AI web3 jobs",
    alternates: {
        canonical: "https://www.apexweb3.com/jobs",
    },
    openGraph: {
        title: "Web3 & AI × Web3 Jobs | ApexWeb3",
        description: "Live blockchain and AI × Web3 job listings. Remote-first. Updated daily.",
        url: "https://www.apexweb3.com/jobs",
        siteName: "ApexWeb3",
        images: [{
            url: "https://www.apexweb3.com/api/og/jobs",
            width: 1200,
            height: 630,
            alt: "ApexWeb3 Web3 Jobs Board",
        }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Web3 & AI × Web3 Jobs | ApexWeb3",
        description: "Browse 200+ live blockchain and AI × Web3 jobs. Remote-first.",
        images: ["https://www.apexweb3.com/api/og/jobs"],
    },
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
