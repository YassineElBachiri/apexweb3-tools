import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, buildUserPrompt, AffiliateContext, AffiliateResponse } from '@/lib/affiliate-prompt';

export async function POST(req: Request) {
  const context: AffiliateContext = await req.json();

  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return NextResponse.json({ recommendations: [] }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(context) },
        ],
        temperature: 0.3, // Low temp for consistent, rule-following output
        response_format: { type: 'json_object' },
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Groq affiliate error:', err);
      return NextResponse.json({ recommendations: [] }, { status: 500 });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json({ recommendations: [] });
    }

    const result: AffiliateResponse = JSON.parse(rawContent);

    // Safety: never return more than 2
    result.recommendations = result.recommendations.slice(0, 2);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Affiliate API error:', error);
    return NextResponse.json({ recommendations: [] });
  }
}
