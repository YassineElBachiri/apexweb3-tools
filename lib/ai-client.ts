/**
 * Shared AI client for ApexWeb3 job intelligence features.
 * Primary: Anthropic Claude (claude-sonnet-4-5)
 * Fallback: Groq (llama-3.3-70b-versatile) — OpenAI-compatible endpoint
 *
 * Fallback activates when ANTHROPIC_API_KEY is absent OR when Anthropic
 * returns a non-2xx response (key invalid, quota exceeded, etc.)
 */

interface CallAIOptions {
    systemPrompt: string
    userContent: string
    maxTokens?: number
}

interface AIResult {
    text: string
    provider: 'anthropic' | 'groq'
}

// --- Anthropic ---
async function callAnthropic(
    apiKey: string,
    { systemPrompt, userContent, maxTokens = 1000 }: CallAIOptions
): Promise<AIResult> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [{ role: 'user', content: userContent }],
        }),
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(`Anthropic error ${response.status}: ${err?.error?.message || 'Unknown'}`)
    }

    const data = await response.json()
    const text: string = data.content?.[0]?.text || ''
    return { text, provider: 'anthropic' }
}

// --- Groq (OpenAI-compatible) ---
async function callGroq(
    apiKey: string,
    { systemPrompt, userContent, maxTokens = 1000 }: CallAIOptions
): Promise<AIResult> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: maxTokens,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent },
            ],
            // Ask the model to respond with raw JSON
            response_format: { type: 'json_object' },
        }),
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(`Groq error ${response.status}: ${err?.error?.message || 'Unknown'}`)
    }

    const data = await response.json()
    const text: string = data.choices?.[0]?.message?.content || ''
    return { text, provider: 'groq' }
}

/**
 * Call Anthropic first; fall back to Groq if Anthropic key is missing or fails.
 * Throws only if both providers fail.
 */
export async function callAI(options: CallAIOptions): Promise<AIResult> {
    const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim()
    const groqKey = process.env.GROQ_API_KEY?.trim()

    // Try Anthropic if key exists
    if (anthropicKey) {
        try {
            return await callAnthropic(anthropicKey, options)
        } catch (err) {
            console.warn('[ai-client] Anthropic failed, trying Groq fallback:', err)
        }
    }

    // Fall back to Groq
    if (groqKey) {
        return await callGroq(groqKey, options)
    }

    throw new Error('No AI provider available. Set ANTHROPIC_API_KEY or GROQ_API_KEY in .env.local')
}
