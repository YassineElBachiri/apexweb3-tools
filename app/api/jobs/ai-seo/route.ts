import { NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-client'

const SYSTEM_PROMPT = `You are an SEO strategist specializing in Web3 and AI job boards.

Given a job category and a list of current job listings in that category, generate SEO-optimized page metadata for ApexWeb3.

TARGET PAGES:
- /jobs/ai — main AI x Web3 jobs index
- /jobs/ai/agents — AI agent roles
- /jobs/ai/ml-engineering — ML engineering at Web3 companies
- /jobs/ai/decentralized-ai — decentralized AI protocol roles
- /jobs/ai/remote — remote AI x Web3 jobs

OUTPUT FORMAT:
Return a JSON object with exactly these fields:
{
  "title": "Page title tag (max 60 chars, include primary keyword)",
  "metaDescription": "Meta description (max 155 chars, include CTA)",
  "h1": "Page H1 heading (max 70 chars, different from title)",
  "primaryKeyword": "The main keyword this page should rank for",
  "secondaryKeywords": ["kw1", "kw2", "kw3"],
  "internalLinkSuggestions": [
    { "anchor": "anchor text", "page": "/target-page", "reason": "why link here" }
  ]
}

RULES:
- Only return valid JSON.
- title and h1 must be different from each other.
- primaryKeyword must have realistic search volume (not too niche).
- internalLinkSuggestions: link to existing ApexWeb3 tools that are relevant
  (Salary Estimator at /tools/salary-calculator, Security Scanner at /token, 
  Tokenomics Analyzer at /tokenomics, Whale Watch at /intelligence, Jobs board at /jobs).
- Write for humans first, search engines second.`

export async function POST(req: Request) {
    try {
        const { pagePath, categoryName, jobs, topTags } = await req.json()

        if (!pagePath || !categoryName) {
            return NextResponse.json({ error: 'pagePath and categoryName required' }, { status: 400 })
        }

        const jobList = jobs || []
        const sampleTitles = jobList.slice(0, 5).map((j: { title: string }) => j.title).join(', ')

        const userContent = `Generate SEO metadata for this ApexWeb3 category page:

PAGE: ${pagePath}
CATEGORY: ${categoryName}
CURRENT JOB COUNT: ${jobList.length}
SAMPLE JOB TITLES: ${sampleTitles || 'Not available'}
TOP TAGS IN THIS CATEGORY: ${(topTags || []).join(', ') || 'AI, blockchain, ML, Web3'}

Return the JSON metadata object.`

        const { text } = await callAI({
            systemPrompt: SYSTEM_PROMPT,
            userContent,
            maxTokens: 600,
        })

        try {
            const parsed = JSON.parse(text)
            return NextResponse.json(parsed)
        } catch {
            return NextResponse.json({ error: 'Parse error', raw: text }, { status: 500 })
        }

    } catch (error) {
        console.error('AI SEO error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
