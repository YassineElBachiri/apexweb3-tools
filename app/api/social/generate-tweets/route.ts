import { NextResponse } from 'next/server';
import { scrapeEVMWhales } from '@/lib/whales/scrapers/evmScraper';
import { scrapeSolanaWhales } from '@/lib/whales/scrapers/solanaScraper';

// This endpoint can be triggered by a cron job (e.g., Vercel Cron)
// It generates tweets based on recent market data and the ApexWeb3 persona.

export const revalidate = 0; // Disable cache

const SYSTEM_PROMPT = `
You are ApexWeb3's automated market intelligence bot. Your job is to write 2 high-impact crypto tweet per day based on the provided data context.

TONE: Data-driven, confident, no hype. Like a sharp analyst, not an influencer.

RULES:
- Max 240 characters per tweet.
- Always lead with a number, stat, or data point.
- End with a subtle CTA pointing to apexweb3.com.
- No emojis except max 1 if it adds clarity.
- No financial advice language ("buy", "sell", "guaranteed").
- No hashtag spam — max 2 relevant hashtags.
- Return ONLY a JSON array of 2 strings, representing the tweets.

FORMATS TO ROTATE:
1. Whale Alert — "Whale just moved $X of [token]..."
2. Meme Coin Signal — "Our scanner flagged [token]: [key metric]..."
3. Market Insight — "When BTC does X, historically Y happens..."
4. Warning/Risk — "3 red flags we're seeing in [sector] right now..."
5. Data Drop — "This week's on-chain data shows..."
`;

export async function GET(req: Request) {
  // 1. Gather context data using real scrapers
  const ethWhales = await scrapeEVMWhales(1, 1000000); // 1M+ transfers on ETH
  const solWhales = await scrapeSolanaWhales(1000000); // 1M+ transfers on Solana

  const recentEth = ethWhales.slice(0, 3).map(w => `$${(w.amountUSD / 1e6).toFixed(1)}M ${w.symbol} from ${w.from.label || 'Unknown'} to ${w.to.label || 'Unknown'}`).join(', ');
  const recentSol = solWhales.slice(0, 3).map(w => `$${(w.amountUSD / 1e6).toFixed(1)}M ${w.symbol} from ${w.from.label || 'Unknown'} to ${w.to.label || 'Unknown'}`).join(', ');

  const marketContext = `
  Recent Whale Activity (Ethereum): ${recentEth || 'Normal levels'}
  Recent Whale Activity (Solana): ${recentSol || 'Normal levels'}
  `;

  // 2. Call Groq API (free tier, OpenAI-compatible)
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return NextResponse.json({ error: "Missing GROQ_API_KEY environment variable" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Generate 2 daily tweets based on this data context:\n${marketContext}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API error");
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No content returned from Groq API");
    }

    let tweets: string[] = [];
    try {
      const parsed = JSON.parse(rawContent);
      // Groq returns JSON object, extract the array from it
      tweets = Array.isArray(parsed) ? parsed : parsed.tweets ?? Object.values(parsed);
    } catch (parseError) {
      console.error("Failed to parse AI output:", rawContent);
      return NextResponse.json({ error: "Invalid JSON format from AI" }, { status: 500 });
    }

    // 3. Post to Twitter automatically (if credentials are set)
    const { TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET } = process.env;

    let posted = false;
    if (TWITTER_API_KEY && TWITTER_API_SECRET && TWITTER_ACCESS_TOKEN && TWITTER_ACCESS_SECRET) {
      try {
        // Dynamic import so it doesn't crash if the package isn't installed yet
        const { TwitterApi } = await import('twitter-api-v2');
        
        const twitterClient = new TwitterApi({
          appKey: TWITTER_API_KEY,
          appSecret: TWITTER_API_SECRET,
          accessToken: TWITTER_ACCESS_TOKEN,
          accessSecret: TWITTER_ACCESS_SECRET,
        });

        // We post the first tweet. (If you prefer a thread, use twitterClient.v2.tweetThread(tweets))
        await twitterClient.v2.tweet(tweets[0]);
        console.log("Successfully posted tweet to X!");
        posted = true;
      } catch (twitterError: any) {
        console.error("Failed to post to Twitter:", twitterError);
      }
    }

    return NextResponse.json({
      success: true,
      data: tweets,
      postedToX: posted,
      contextUsed: marketContext
    });
  } catch (error: any) {
    console.error("Tweet Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
