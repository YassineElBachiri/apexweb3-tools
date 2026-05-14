import { Metadata } from "next";
import { Suspense } from "react";
import { fetchAIWeb3Jobs } from "@/lib/ai-web3-jobs";
import { AIJobsDashboard } from "@/components/jobs/AIJobsDashboard";
import { InlineSubscribe } from "@/components/subscribe/InlineSubscribe";
import { callAI } from "@/lib/ai-client";
import { unstable_cache } from "next/cache";

// Cache SEO metadata logic separately so it doesn't block job fetching
const getCachedSEOMeta = unstable_cache(
    async (pagePath: string, categoryName: string, sampleTitles: string, topTags: string) => {
        const systemPrompt = `You are an SEO strategist specializing in Web3 and AI job boards.
Given a job category and a list of current job listings, generate SEO-optimized page metadata for ApexWeb3.
OUTPUT FORMAT: JSON with { "title": "...", "metaDescription": "...", "h1": "..." }
title max 60 chars. metaDescription max 155 chars. Make them different.`;

        const userContent = `Generate SEO metadata for this ApexWeb3 category page:
PAGE: ${pagePath}
CATEGORY: ${categoryName}
SAMPLE JOB TITLES: ${sampleTitles}
TOP TAGS IN THIS CATEGORY: ${topTags}
Return the JSON metadata object.`;

        try {
            const { text } = await callAI({ systemPrompt, userContent, maxTokens: 400 });
            return JSON.parse(text);
        } catch {
            return null;
        }
    },
    ['apexweb3_seo_ai_jobs'],
    { revalidate: 7 * 24 * 3600 } // 7 days cache
);

export async function generateMetadata(): Promise<Metadata> {
    const { jobs } = await fetchAIWeb3Jobs();
    
    // Fallback if no jobs
    if (!jobs || jobs.length === 0) {
        return {
            title: "AI × Web3 Jobs | ApexWeb3",
            description: "Curated roles at the intersection of AI agents, decentralized AI, and on-chain machine learning.",
        };
    }

    const sampleTitles = jobs.slice(0, 5).map(j => j.title).join(', ');
    
    // Extract top tags
    const tagCounts: Record<string, number> = {};
    jobs.forEach(j => {
        const tags = j.aiEvaluation?.tags || j.tags || [];
        tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
    });
    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(t => t[0])
        .join(', ');

    const seo = await getCachedSEOMeta("/jobs/ai", "AI x Web3 Jobs", sampleTitles, topTags);

    if (seo?.title) {
        return {
            title: seo.title,
            description: seo.metaDescription,
        };
    }

    return {
        title: "AI × Web3 Jobs | ApexWeb3",
        description: "Curated roles at the intersection of AI agents, decentralized AI, and on-chain machine learning.",
    };
}

export default async function AIJobsPage() {
    const { jobs, error, sources } = await fetchAIWeb3Jobs();

    return (
        <main className="min-h-screen bg-background border-t border-white/5">
            <Suspense fallback={
                <div className="container py-20 text-center font-mono text-muted-foreground">
                    <p className="mt-4">Loading AI × Web3 Jobs...</p>
                </div>
            }>
                <AIJobsDashboard initialJobs={jobs} error={error} sources={sources} />
            </Suspense>
            
            <div className="container max-w-4xl mx-auto px-4 pb-16">
                <InlineSubscribe source="ai-web3-jobs" />
            </div>
        </main>
    );
}
