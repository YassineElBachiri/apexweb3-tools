import { NextResponse } from 'next/server'
import { callAI } from '@/lib/ai-client'

const SYSTEM_PROMPT = `You are ApexWeb3's smart contract risk analyst — a no-nonsense Web3 security expert.

A job seeker is considering working for a Web3 company and wants to know if the company's token contract looks legitimate before accepting an offer.

Your job is to analyze the contract data provided and give a clear, honest risk verdict. This is not financial advice — it's a due diligence snapshot for employment decisions.

TONE:
- Direct and honest. Don't soften bad news.
- Practical. Focus on what matters for someone deciding whether to join a company.
- No hype, no FUD. Just the facts and what they mean.

OUTPUT FORMAT:
Return a JSON object with exactly these fields:
{
  "verdict": "SAFE" | "CAUTION" | "RISK",
  "score": number between 0 and 100 (100 = safest),
  "summary": "One sentence plain-English verdict (max 20 words)",
  "flags": [
    { "label": "Flag name", "status": "clear" | "warning" | "risk", "detail": "One sentence explanation" }
  ],
  "advice": "One sentence of practical advice for the job seeker (max 25 words)"
}

FLAGS TO ALWAYS CHECK (include all that apply from the data):
- Honeypot detection
- Liquidity lock status
- Mint function present
- Owner privileges / admin keys
- Contract verified on-chain
- Token age
- Holder concentration

RULES:
- Only return valid JSON. No preamble, no markdown.
- If contract data is limited, be honest about what you can and cannot determine.
- verdict SAFE = score 75-100, CAUTION = 40-74, RISK = 0-39
- Never recommend buying or selling the token. This is purely an employment due diligence tool.`

export async function POST(req: Request) {
    try {
        const { contractAddress, network, contractData, jobTitle, company } = await req.json()

        if (!contractAddress || !network) {
            return NextResponse.json({ error: 'contractAddress and network are required' }, { status: 400 })
        }

        const userPrompt = `A job seeker found this role: "${jobTitle || 'Unknown Role'}" at "${company || 'Unknown Company'}".
They want to know if this company's token contract looks legitimate.

CONTRACT ADDRESS: ${contractAddress}
NETWORK: ${network}

CONTRACT DATA FROM SECURITY SCANNER:
${JSON.stringify(contractData || {}, null, 0)}

Give a trust score and verdict for this company from an employment due diligence perspective.
Return only the JSON object.`

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
        console.error('Trust score API error:', error)
        const message = error instanceof Error ? error.message : 'Internal server error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
