import { NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-client'
import { NormalizedAIJob, AIJobEvaluation } from '@/lib/remotive'

const SYSTEM_PROMPT = `You are a Web3 recruitment specialist and AI industry expert working for ApexWeb3.

Your job is to evaluate whether a given job listing belongs on a board called "AI × Web3 Jobs" — a curated board for roles at the intersection of artificial intelligence and Web3/blockchain.

WHAT BELONGS ON THIS BOARD:
- AI agents for blockchain / on-chain automation
- Decentralized AI infrastructure (Bittensor, Fetch.ai, Akash, Ocean Protocol ecosystem)
- ML engineers at crypto companies or DeFi protocols
- AI tooling for crypto traders, analysts, or developers
- Smart contract auditing using AI
- On-chain data science and ML pipelines
- AI product managers at Web3 companies
- Prompt engineers or LLM specialists at blockchain companies
- AI safety researchers at crypto-native organizations
- Any role at a company whose core product combines AI and blockchain

WHAT DOES NOT BELONG:
- Pure AI/ML roles at traditional tech companies with zero Web3 connection
- Blockchain roles with no AI component
- General software engineering at AI companies unrelated to crypto
- Data science at fintech companies that are not crypto-native

OUTPUT FORMAT:
Return a JSON object with exactly these fields:
{
  "relevant": true | false,
  "score": number 0-100 (100 = perfectly on-theme),
  "category": "AI Agents" | "Decentralized AI" | "ML Engineering" | "AI Tooling" | "Data Science" | "AI Product" | "Other",
  "tags": ["tag1", "tag2", "tag3"],
  "rewrittenTitle": "Cleaner job title if the original is vague or generic, otherwise null",
  "oneLiner": "One sentence describing why this role is at the AI x Web3 intersection (max 15 words)"
}

RULES:
- Only return valid JSON. No preamble, no markdown.
- Be strict. When in doubt, relevant = false. Quality over quantity.
- score below 40 should always be relevant = false.
- tags should be specific technologies: "Solidity", "LangChain", "RAG", "Bittensor", "EVM", "PyTorch" etc.`

type JobInput = Pick<NormalizedAIJob, 'title' | 'company' | 'description' | 'tags' | 'location'>

async function evaluateJob(job: JobInput): Promise<AIJobEvaluation> {
    const userContent = `Evaluate this job listing for the ApexWeb3 "AI × Web3 Jobs" board:

TITLE: ${job.title}
COMPANY: ${job.company}
DESCRIPTION: ${job.description?.replace(/<[^>]+>/g, ' ').slice(0, 800) || 'Not provided'}
TAGS: ${job.tags?.join(', ') || 'none'}
LOCATION: ${job.location}

Is this role at the intersection of AI and Web3? Return the JSON evaluation object.`

    try {
        const { text } = await callAI({
            systemPrompt: SYSTEM_PROMPT,
            userContent,
            maxTokens: 300,
        })
        return JSON.parse(text) as AIJobEvaluation
    } catch {
        return { relevant: false, score: 0, category: 'Other', tags: [], rewrittenTitle: null, oneLiner: '' }
    }
}

export async function POST(req: Request) {
    try {
        const { jobs } = await req.json()

        if (!jobs || jobs.length === 0) {
            return NextResponse.json({ jobs: [], total: 0 })
        }

        // Process in parallel batches of 5 to respect rate limits
        const results: (NormalizedAIJob & { aiEvaluation: AIJobEvaluation })[] = []
        const BATCH_SIZE = 5

        for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
            const batch: NormalizedAIJob[] = jobs.slice(i, i + BATCH_SIZE)
            const batchResults = await Promise.all(
                batch.map(async (job: NormalizedAIJob) => {
                    const evaluation = await evaluateJob(job)
                    return { ...job, aiEvaluation: evaluation }
                })
            )
            results.push(...batchResults)
        }

        const relevant = results.filter(j => j.aiEvaluation?.relevant === true)

        return NextResponse.json({
            jobs: relevant,
            total: relevant.length,
            evaluated: results.length,
        })

    } catch (error) {
        console.error('AI Filter error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
