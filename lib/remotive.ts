/**
 * Remotive API integration for AI × Web3 Jobs
 * Fetches remote AI/ML jobs and pre-filters for Web3 relevance
 * before Claude does the final evaluation.
 */

export interface RemotiveJob {
    id: number
    url: string
    title: string
    company_name: string
    company_logo?: string
    category: string
    tags?: string[]
    job_type: string
    publication_date: string
    candidate_required_location: string
    salary: string
    description: string
}

// Pre-filter keywords — reduces Claude API calls by ~60%
// Jobs must match at least one of these to be forwarded to Claude
const WEB3_KEYWORDS = [
    'blockchain', 'crypto', 'web3', 'defi', 'nft', 'solidity', 'ethereum',
    'solana', 'bitcoin', 'on-chain', 'decentralized', 'dao', 'protocol',
    'token', 'wallet', 'smart contract', 'bittensor', 'fetch.ai', 'ocean protocol',
    'akash', 'langchain', 'llm agent', 'ai agent', 'autonomous agent',
    'onchain', 'layer 2', 'layer2', 'l2', 'evm', 'substrate', 'cosmos',
    'polkadot', 'near', 'aptos', 'sui', 'avalanche', 'chainlink'
]

const AI_KEYWORDS = [
    ' ai ', 'artificial intelligence', 'machine learning', ' ml ', 'llm', 'language model',
    'nlp', 'neural network', 'data science', 'agent', 'bittensor', 'fetch.ai', 'openai', 'anthropic'
]

export async function fetchRemotiveAIJobs(): Promise<RemotiveJob[]> {
    try {
        // Fetch ALL jobs across all categories to avoid missing data/product/design Web3 roles
        const res = await fetch(
            `https://remotive.com/api/remote-jobs`,
            { next: { revalidate: 3600 } }
        )
        if (!res.ok) return []
        const data = await res.json()
        const allJobs = (data.jobs || []) as RemotiveJob[]

        // 1. Filter for Web3 relevance (search the ENTIRE description, no slicing)
        const web3Filtered = allJobs.filter(job => {
            const tagsStr = job.tags ? job.tags.join(' ') : ''
            const text = `${job.title} ${job.description || ''} ${tagsStr}`.toLowerCase()
            return WEB3_KEYWORDS.some(kw => text.includes(kw))
        })

        // 2. Filter for AI relevance using word boundaries to catch 'AI,' 'AI/ML' etc.
        const aiRegex = /\b(ai|ml|llm|nlp)\b/i;
        const preFiltered = web3Filtered.filter(job => {
            const tagsStr = job.tags ? job.tags.join(' ') : ''
            const text = `${job.title} ${job.description || ''} ${tagsStr}`.toLowerCase()
            return aiRegex.test(text) || AI_KEYWORDS.some(kw => text.includes(kw))
        })

        return preFiltered
    } catch {
        return []
    }
}

export interface NormalizedAIJob {
    id: string
    slug: string
    title: string
    company: string
    location: string
    remote: boolean
    salary: string | null
    description: string
    tags: string[]
    url: string
    apply_url: string
    created_at: string
    logo?: string
    source: 'remotive' | 'web3career'
    // Populated after Claude evaluation
    aiEvaluation?: AIJobEvaluation
}

export interface AIJobEvaluation {
    relevant: boolean
    score: number
    category: 'AI Agents' | 'Decentralized AI' | 'ML Engineering' | 'AI Tooling' | 'Data Science' | 'AI Product' | 'Other'
    tags: string[]
    rewrittenTitle: string | null
    oneLiner: string
}

export function normalizeRemotiveJob(job: RemotiveJob): NormalizedAIJob {
    const slug = `${job.title}-${job.company_name}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 100)

    return {
        id: `remotive-${job.id}`,
        slug: `remotive-${slug}`,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || 'Remote',
        remote: true, // Remotive is remote-only platform
        salary: job.salary || null,
        description: job.description || '',
        tags: job.tags || [],
        url: job.url,
        apply_url: job.url,
        created_at: job.publication_date || new Date().toISOString(),
        logo: job.company_logo,
        source: 'remotive',
    }
}
