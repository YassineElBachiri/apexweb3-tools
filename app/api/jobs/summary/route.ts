import { NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-client'

const SYSTEM_PROMPT = `You are a concise Web3 job summarizer. Given a job description, extract the 3 most important things a candidate needs to know before reading the full listing.

OUTPUT FORMAT:
Return a JSON object:
{
  "tldr": ["bullet1", "bullet2", "bullet3"],
  "realRequirements": "One sentence on what they actually need (cutting through JD inflation)",
  "redFlags": "One sentence if anything in the JD seems off, or null if nothing stands out"
}

RULES:
- Only return valid JSON. No preamble.
- Each bullet max 12 words.
- realRequirements should be honest — most JDs list 15 requirements but only 5 are real blockers.
- redFlags: look for vague comp ("competitive salary"), unrealistic scope, or unclear team size.`

export async function POST(req: Request) {
    try {
        const { job } = await req.json()

        if (!job || !job.description) {
            return NextResponse.json({ error: 'Job with description is required' }, { status: 400 })
        }

        const userPrompt = `Summarize this Web3 job listing:

Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Salary: ${job.salary || 'Not specified'}
Skills: ${job.tags?.join(', ') || 'Not specified'}
Description: ${job.description.replace(/<[^>]+>/g, ' ').slice(0, 3000)}

Return only the JSON summary object.`

        const { text } = await callAI({
            systemPrompt: SYSTEM_PROMPT,
            userContent: userPrompt,
            maxTokens: 600,
        })

        try {
            const parsed = JSON.parse(text)
            return NextResponse.json(parsed)
        } catch {
            return NextResponse.json({ error: 'Parse error', raw: text }, { status: 500 })
        }

    } catch (error) {
        console.error('Job summary API error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
