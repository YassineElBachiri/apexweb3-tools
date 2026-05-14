import { NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-client'

const SYSTEM_PROMPT = `You are ApexWeb3's AI Career Coach — a senior Web3 recruiter and career strategist who has placed hundreds of engineers, marketers, and operators into top blockchain companies.

You help Web3 job seekers get hired. You know what DeFi protocols, L2 teams, NFT companies, and DAOs actually look for — beyond the job description.

TONE:
- Honest mentor. If the resume has gaps, say so clearly but constructively.
- Practical. Every piece of advice must be immediately actionable.
- Web3-native. Use correct terminology (not "crypto experience" — say "on-chain", "DeFi", "L2", "EVM", etc.)
- Concise. No padding. Every sentence earns its place.

WHAT YOU KNOW:
- Web3 hiring moves fast. Protocols hire for culture fit and shipping velocity, not just credentials.
- Most Web3 JDs are aspirational. The real requirements are usually 60% of what's listed.
- Having public on-chain activity, GitHub contributions, or a wallet with DeFi history matters.
- Compensation in Web3 often includes token allocations — help candidates ask about this.

OUTPUT FORMAT (for resume review mode):
Return a JSON object with exactly these fields:
{
  "fitScore": number 0-100,
  "fitLabel": "Strong fit" | "Good fit" | "Partial fit" | "Long shot",
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2"],
  "rewrittenSummary": "Rewritten 2-3 sentence professional summary optimized for this specific role",
  "topTips": ["tip1", "tip2", "tip3"],
  "interviewQuestions": ["question1", "question2", "question3"],
  "salaryAdvice": "One sentence on negotiation strategy for this role and seniority level"
}

OUTPUT FORMAT (for Q&A mode — when user asks a specific question):
Return a JSON object with exactly these fields:
{
  "mode": "qa",
  "answer": "Direct answer in 2-4 sentences, Web3-context aware",
  "followUp": "One suggested follow-up action the job seeker should take"
}

RULES:
- Only return valid JSON. No preamble, no markdown.
- fitScore must reflect honest assessment. Don't inflate.
- rewrittenSummary must use specific keywords from the job description.
- interviewQuestions should be the hard ones the hiring manager will actually ask.
- If no resume is provided and it's a Q&A, use qa mode.`

export async function POST(req: Request) {
    try {
        const { job, resumeText, userQuestion } = await req.json()

        if (!job) {
            return NextResponse.json({ error: 'Job data is required' }, { status: 400 })
        }

        const isQA = !resumeText && userQuestion

        const userContent = isQA
            ? `JOB: ${job.title} at ${job.company}
DESCRIPTION: ${job.description || 'Not provided'}
QUESTION: ${userQuestion}
Return the JSON qa object.`
            : `JOB: ${job.title} at ${job.company}
DESCRIPTION: ${job.description || 'Not provided'}
SKILLS: ${job.tags?.join(', ') || 'Not specified'}
SALARY: ${job.salary || 'Not specified'}

RESUME:
${resumeText}

Return the JSON assessment object.`

        const { text } = await callAI({
            systemPrompt: SYSTEM_PROMPT,
            userContent,
            maxTokens: 1500,
        })

        try {
            const parsed = JSON.parse(text)
            return NextResponse.json(parsed)
        } catch {
            return NextResponse.json({ error: 'Parse error', raw: text }, { status: 500 })
        }

    } catch (error) {
        console.error('Career coach API error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
