// lib/index-now.ts
// Utilities: IndexNow ping, share text generation, OG token URL builder

const SITE_URL = 'https://www.apexweb3.com';
const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY || '';

/**
 * Ping IndexNow API so Google/Bing index the new token page instantly.
 * Call this server-side after a scan is persisted.
 */
export async function pingIndexNow(url: string): Promise<void> {
    if (!INDEX_NOW_KEY) return; // silent no-op in dev

    try {
        await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                host: 'www.apexweb3.com',
                key: INDEX_NOW_KEY,
                keyLocation: `${SITE_URL}/${INDEX_NOW_KEY}.txt`,
                urlList: [url],
            }),
        });
    } catch (e) {
        console.warn('[IndexNow] Ping failed:', e);
    }
}

/**
 * Build the canonical public token result URL.
 */
export function buildTokenUrl(chain: string, address: string): string {
    return `${SITE_URL}/token/${chain}/${address}`;
}

/**
 * Build a pre-filled X/Twitter share URL.
 */
export function buildTwitterShareUrl(opts: {
    tokenName: string;
    tokenSymbol: string;
    chain: string;
    address: string;
    score: number;
    isHoneypot: boolean;
    sellTax?: number;
}): string {
    const { tokenName, tokenSymbol, chain, address, score, isHoneypot, sellTax } = opts;
    const pageUrl = buildTokenUrl(chain, address);
    const verdict = isHoneypot ? '🚨 HONEYPOT' : score >= 80 ? '✅ SAFE' : score >= 50 ? '⚠️ CAUTION' : '🔴 HIGH RISK';

    const text = [
        `I just scanned ${tokenName} (${tokenSymbol}) on @ApexWeb3 🔍`,
        `Risk Score: ${score}/100`,
        `Honeypot: ${isHoneypot ? 'DANGER 🚨' : 'SAFE ✅'}`,
        sellTax !== undefined ? `Sell Tax: ${sellTax.toFixed(1)}%` : null,
        `Verdict: ${verdict}`,
        `Full report 👇`,
        pageUrl,
        `#Web3 #CryptoSafety #DeFi #TokenScan`,
    ]
        .filter(Boolean)
        .join('\n');

    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

/**
 * Get verdic label from score.
 */
export function getVerdict(score: number): {
    label: string;
    emoji: string;
    color: string;
} {
    if (score <= 30) return { label: 'HIGH RISK — Avoid', emoji: '🔴', color: 'text-rose-400' };
    if (score <= 60) return { label: 'MODERATE RISK — Proceed with caution', emoji: '🟡', color: 'text-yellow-400' };
    if (score <= 85) return { label: 'LOW RISK — Looks clean, still DYOR', emoji: '🟢', color: 'text-emerald-400' };
    return { label: 'VERY SAFE — No major flags found', emoji: '✅', color: 'text-emerald-300' };
}
