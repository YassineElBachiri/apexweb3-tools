/**
 * AI × Web3 Jobs — unified data fetcher
 *
 * Sources:
 *   1. Remotive API  — remote AI/ML jobs pre-filtered for Web3 keywords
 *   2. web3.career   — existing integration, used as-is (all jobs have Web3 context)
 *
 * Pipeline:
 *   fetch → normalize → deduplicate → Claude filter → sort by score
 *
 * NOTE: The Claude filter step calls /api/jobs/ai-filter which is a POST route.
 * In production (server components) we call the filter logic directly, not via HTTP,
 * to avoid internal fetch loops in Next.js. The API route is for client-side usage.
 */

import { fetchRemotiveAIJobs, normalizeRemotiveJob, NormalizedAIJob, AIJobEvaluation } from './remotive'
import { fetchWeb3Jobs } from './web3Career'
import { slugify } from './slugify'
import { callAI } from './ai-client'

// Re-export types so the page can import from one place
export type { NormalizedAIJob, AIJobEvaluation }

/**
 * Fetch ALL jobs from all sources (Remotive + Web3.career)
 * Unified for the main /jobs board.
 */
export async function fetchUnifiedJobs(): Promise<{ jobs: NormalizedAIJob[], error?: string }> {
    const [remotiveRaw, web3Result] = await Promise.allSettled([
        fetchRemotiveAIJobs(),
        fetchWeb3Jobs(),
    ])

    const allJobs: NormalizedAIJob[] = []

    if (remotiveRaw.status === 'fulfilled') {
        allJobs.push(...remotiveRaw.value.map(normalizeRemotiveJob))
    }

    if (web3Result.status === 'fulfilled' && web3Result.value.jobs.length > 0) {
        allJobs.push(...web3Result.value.jobs.map(j => ({
            ...j,
            source: 'web3career' as const
        } as NormalizedAIJob)))
    }

    // Deduplicate and ensure slugs
    const seen = new Set<string>()
    const deduped = allJobs.filter(job => {
        const key = `${job.title?.toLowerCase().trim()}-${job.company?.toLowerCase().trim()}`
        if (seen.has(key)) return false
        seen.add(key)
        if (!job.slug) job.slug = makeAIJobSlug(job)
        return true
    })

    return { jobs: deduped }
}

/**
 * Fetch a single job by slug from all available sources
 * This ensures that jobs from Remotive and the refined AI list 
 * can be displayed on the shared detail page.
 */
export async function fetchUnifiedJobBySlug(slug: string): Promise<NormalizedAIJob | null> {
    // 1. Try finding in the AI-filtered list (includes Remotive)
    const { jobs: aiJobs } = await fetchAIWeb3Jobs();
    const aiJob = aiJobs.find(j => j.slug === slug);
    if (aiJob) return aiJob;

    // 2. Fallback to general web3 jobs if not found in AI list
    const { jobs: web3Jobs } = await fetchWeb3Jobs();
    const w3Job = web3Jobs.find(j => j.slug === slug);
    if (w3Job) {
        return {
            ...w3Job,
            source: 'web3career'
        } as NormalizedAIJob;
    }

    return null;
}

// --- Cache TTLs (ms) ---
export const CACHE_TTL = {
    jobFilter: 6 * 60 * 60 * 1000,         // 6 hours
    intelligenceBanner: 24 * 60 * 60 * 1000, // 24 hours
    seoMeta: 7 * 24 * 60 * 60 * 1000,       // 7 days
}

export const CACHE_KEYS = {
    jobFilter: 'apexweb3_ai_jobs_filtered_v7',
    banner: 'apexweb3_ai_jobs_banner',
    seoMeta: (page: string) => `apexweb3_seo_${page}`,
}

// --- AI Filter system prompt (duplicated here for direct server-side calls) ---
const AI_FILTER_SYSTEM = `You are a Web3 recruitment specialist and AI industry expert working for ApexWeb3.

Evaluate whether a job listing belongs on an "AI x Web3 Jobs" board.

WHAT BELONGS: AI agents for blockchain, decentralized AI (Bittensor/Fetch.ai/Akash/Ocean), ML engineers at crypto companies, AI tooling for crypto, smart contract auditing with AI, on-chain data science, AI product managers at Web3 companies, LLM specialists at blockchain companies.

WHAT DOES NOT BELONG: Pure AI/ML at traditional tech companies with zero Web3 connection, blockchain roles with no AI component, general SWE at AI companies unrelated to crypto.

Return JSON only:
{ "relevant": true|false, "score": 0-100, "category": "AI Agents"|"Decentralized AI"|"ML Engineering"|"AI Tooling"|"Data Science"|"AI Product"|"Other", "tags": ["tag1","tag2"], "rewrittenTitle": null|"cleaner title", "oneLiner": "one sentence max 15 words" }

Be strict. score below 40 = relevant false.`

function getHeuristicCategory(job: NormalizedAIJob): 'AI Agents' | 'Decentralized AI' | 'ML Engineering' | 'Data Science' | 'AI Product' | 'Other' {
    const text = `${job.title} ${job.tags?.join(' ')}`.toLowerCase();
    if (text.includes('agent')) return 'AI Agents';
    if (text.includes('decentralized') || text.includes('fetch.ai') || text.includes('bittensor') || text.includes('akash')) return 'Decentralized AI';
    if (text.includes('ml') || text.includes('machine learning') || text.includes('llm') || text.includes('model')) return 'ML Engineering';
    if (text.includes('data')) return 'Data Science';
    if (text.includes('product') || text.includes('pm')) return 'AI Product';
    return 'Other';
}

async function evaluateOneJob(job: NormalizedAIJob): Promise<AIJobEvaluation> {
    try {
        const { text } = await callAI({
            systemPrompt: AI_FILTER_SYSTEM,
            userContent: `TITLE: ${job.title}\nCOMPANY: ${job.company}\nDESCRIPTION: ${job.description?.replace(/<[^>]+>/g, ' ').slice(0, 600) || ''}\nTAGS: ${job.tags?.join(', ') || 'none'}\nLOCATION: ${job.location}\n\nReturn JSON only.`,
            maxTokens: 250,
        })
        return JSON.parse(text) as AIJobEvaluation
    } catch (err) {
        console.warn('Individual job evaluation failed, falling back to heuristic safe defaults:', err)
        return { relevant: true, score: 50, category: getHeuristicCategory(job), tags: job.tags || [], rewrittenTitle: null, oneLiner: 'AI Role (Unverified)' }
    }
}

async function filterJobsWithAI(jobs: NormalizedAIJob[]): Promise<NormalizedAIJob[]> {
    const BATCH = 5
    const results: NormalizedAIJob[] = []

    for (let i = 0; i < jobs.length; i += BATCH) {
        const batch = jobs.slice(i, i + BATCH)
        const evaluated = await Promise.all(
            batch.map(async (job) => {
                const evaluation = await evaluateOneJob(job)
                return { ...job, aiEvaluation: evaluation }
            })
        )
        results.push(...evaluated.filter(j => j.aiEvaluation?.relevant === true))
    }

    return results
}

function makeAIJobSlug(job: NormalizedAIJob): string {
    const base = `${slugify(job.title)}-${slugify(job.company)}`
    return base.slice(0, 100)
}

export interface FetchAIJobsResult {
    jobs: NormalizedAIJob[]
    error?: string
    sources: { remotive: number; web3career: number }
}

import { unstable_cache } from 'next/cache'

async function _fetchAIWeb3Jobs(): Promise<FetchAIJobsResult> {
    const sources = { remotive: 0, web3career: 0 }

    // 1. Fetch both sources in parallel
    const [remotiveRaw, web3Result] = await Promise.allSettled([
        fetchRemotiveAIJobs(),
        fetchWeb3Jobs(),
    ])

    const allJobs: NormalizedAIJob[] = []

    // 2. Process Remotive jobs
    if (remotiveRaw.status === 'fulfilled') {
        const normalized = remotiveRaw.value.map(normalizeRemotiveJob)
        sources.remotive = normalized.length
        allJobs.push(...normalized)
    }

    // 3. Process web3.career jobs — cast to NormalizedAIJob shape
    if (web3Result.status === 'fulfilled' && web3Result.value.jobs.length > 0) {
        const w3jobs: NormalizedAIJob[] = web3Result.value.jobs.map(j => ({
            id: j.id,
            slug: j.slug,
            title: j.title,
            company: j.company,
            location: j.location,
            remote: j.remote,
            salary: j.salary || null,
            description: j.description || '',
            tags: j.tags || [],
            url: j.url,
            apply_url: j.apply_url,
            created_at: j.created_at,
            logo: j.logo,
            source: 'web3career' as const,
        }))
        sources.web3career = w3jobs.length
        allJobs.push(...w3jobs)
    }

    // 4. Deduplicate by title+company key
    const seen = new Set<string>()
    const deduped = allJobs.filter(job => {
        const key = `${job.title?.toLowerCase().trim()}-${job.company?.toLowerCase().trim()}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })

    // Ensure slugs are set
    deduped.forEach(job => {
        if (!job.slug) job.slug = makeAIJobSlug(job)
    })

    if (deduped.length === 0) {
        return { jobs: [], error: 'No jobs fetched from any source', sources }
    }

    // 5. Claude filter — only pass jobs without prior evaluation
    try {
        const filtered = await filterJobsWithAI(deduped)

        // Sort by relevance score desc
        filtered.sort((a, b) => (b.aiEvaluation?.score || 0) - (a.aiEvaluation?.score || 0))

        return { jobs: filtered, sources }
    } catch (err) {
        console.error('AI filter failed, returning unfiltered:', err)
        // Graceful degradation: return all jobs unfiltered
        return {
            jobs: deduped.map(j => ({
                ...j,
                aiEvaluation: { relevant: true, score: 50, category: 'Other' as const, tags: j.tags, rewrittenTitle: null, oneLiner: '' }
            })),
            error: 'AI filter unavailable',
            sources,
        }
    }
}

// Export a cached version of the fetcher
export const fetchAIWeb3Jobs = unstable_cache(
    async () => _fetchAIWeb3Jobs(),
    [CACHE_KEYS.jobFilter],
    {
        revalidate: 6 * 3600, // 6 hours
        tags: [CACHE_KEYS.jobFilter]
    }
)
