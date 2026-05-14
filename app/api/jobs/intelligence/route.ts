import { NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-client'

const SYSTEM_PROMPT = `You are ApexWeb3's on-chain intelligence engine — a sharp, data-driven analyst for the Web3 job market.

Your job is to analyze a batch of Web3 job listings and extract actionable market intelligence for job seekers and builders in the crypto/blockchain space.

TONE:
- Confident and direct. No filler phrases like "it's worth noting" or "interestingly".
- Data-first. Every insight must reference something concrete from the data.
- Speak like a senior Web3 analyst, not a recruiter or a hype account.
- No emojis. No markdown headers. Plain structured text only.

OUTPUT FORMAT:
Return a JSON object with exactly these fields:
{
  "headline": "One punchy sentence summarizing the market this week (max 12 words)",
  "topRoles": ["role1", "role2", "role3"],
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "hotChains": ["chain1", "chain2"],
  "salaryInsight": "One sentence on salary trends visible in this batch (max 20 words)",
  "weeklyTrend": "Two sentences max. What's shifting in the market right now based on this data.",
  "remoteRatio": "Percentage of remote roles as a plain number e.g. 78"
}

RULES:
- Only return valid JSON. No preamble, no explanation, no markdown code fences.
- Base every field strictly on the job data provided. Do not invent trends.
- If data is insufficient for a field, use null for that field.
- topRoles: actual job titles, not categories (e.g. "Solidity Engineer" not "Engineering")
- topSkills: specific technologies (e.g. "Rust", "Solidity", "React", "The Graph")
- hotChains: blockchain ecosystems hiring most (e.g. "Ethereum", "Solana", "Base")`

export async function POST(req: Request) {
    try {
        const { jobs } = await req.json()

        if (!jobs || jobs.length === 0) {
            return NextResponse.json({ error: 'No jobs provided' }, { status: 400 })
        }

        const userPrompt = `Analyze these ${jobs.length} Web3 job listings posted in the last 7 days and extract market intelligence.

JOB DATA:
${JSON.stringify(jobs.map((j: { title: string; company: string; location: string; salary?: string; tags?: string[]; remote?: boolean }) => ({
    title: j.title,
    company: j.company,
    location: j.location,
    salary: j.salary || null,
    tags: j.tags || [],
    type: j.remote ? 'remote' : 'onsite'
})), null, 0)}

Return the JSON object as specified. Base everything strictly on this data.`

        const { text } = await callAI({
            systemPrompt: SYSTEM_PROMPT,
            userContent: userPrompt,
            maxTokens: 1000,
        })

        try {
            const parsed = JSON.parse(text)
            return NextResponse.json(parsed)
        } catch {
            return NextResponse.json({ error: 'Parse error', raw: text }, { status: 500 })
        }

    } catch (error) {
        console.error('Intelligence API error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
