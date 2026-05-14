import { NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-client'

const SYSTEM_PROMPT = `You are ApexWeb3's AI x Web3 market analyst — an expert who tracks the intersection of artificial intelligence and blockchain technology from a hiring and talent perspective.

Your audience: Web3-native engineers, researchers, and operators who want to move into AI x Web3 roles, and AI professionals curious about Web3.

Analyze the provided batch of AI x Web3 job listings and return a market intelligence snapshot.

TONE:
- Authoritative and specific. This audience is technical and will spot vague claims.
- Forward-looking. Connect current hiring patterns to where the space is going.
- No hype. No "exciting" or "revolutionary". Just signal.

OUTPUT FORMAT:
Return a JSON object with exactly these fields:
{
  "headline": "One sharp sentence on what this week's AI x Web3 hiring signal means (max 14 words)",
  "hotCategories": [
    { "name": "Category name", "count": number, "trend": "up" | "stable" | "new" }
  ],
  "topSkillStack": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "emergingRole": "The most interesting new role type appearing in this batch (one role title), or null",
  "salaryRange": {
    "low": number or null,
    "high": number or null,
    "currency": "USD"
  },
  "marketSignal": "Two sentences max. What does this hiring data tell us about where AI x Web3 is heading?",
  "remoteRatio": number
}

RULES:
- Only return valid JSON. No preamble, no markdown.
- hotCategories: group by role type (AI Agents, Decentralized AI, ML Engineering, etc.)
- topSkillStack: specific technologies, not generic terms
- emergingRole: only if you genuinely see something new; otherwise null
- marketSignal: grounded in the data. No speculation beyond what the listings show.`

export async function POST(req: Request) {
    try {
        const { jobs } = await req.json()

        if (!jobs || jobs.length === 0) {
            return NextResponse.json({ error: 'No jobs provided' }, { status: 400 })
        }

        const userContent = `Analyze these ${jobs.length} AI x Web3 job listings and return the market intelligence snapshot.

LISTINGS:
${JSON.stringify(jobs.map((j: {
    title: string; company: string;
    aiEvaluation?: { category?: string; score?: number };
    tags?: string[]; salary?: string | null; location: string;
}) => ({
    title: j.title,
    company: j.company,
    category: j.aiEvaluation?.category,
    tags: j.tags,
    salary: j.salary,
    location: j.location,
    score: j.aiEvaluation?.score
})))}

Return only the JSON object.`

        const { text } = await callAI({
            systemPrompt: SYSTEM_PROMPT,
            userContent,
            maxTokens: 800,
        })

        try {
            const parsed = JSON.parse(text)
            return NextResponse.json(parsed)
        } catch {
            return NextResponse.json({ error: 'Parse error', raw: text }, { status: 500 })
        }

    } catch (error) {
        console.error('AI Intel error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
