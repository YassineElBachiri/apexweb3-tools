// lib/providers/moralis.ts
// Used as FALLBACK only when DexScreener returns no price data
import { ChainDetection, ScanResult } from '../types/scan';
import { fetchWithRetry, extractSettled } from '../utils/fetchWithRetry';

const MORALIS_EVM = 'https://deep-index.moralis.io/api/v2.2';
const MORALIS_SOL = 'https://solana-gateway.moralis.io/token/mainnet';

const MORALIS_CHAIN_MAP: Record<number, string> = {
  1: 'eth',
  56: 'bsc',
  137: 'polygon',
  42161: 'arbitrum',
  10: 'optimism',
  43114: 'avalanche',
  8453: 'base',
  250: 'fantom',
  25: 'cronos',
};

export async function fetchMoralis(
  detection: ChainDetection
): Promise<Partial<ScanResult> | null> {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) {
    console.warn('[Moralis] MORALIS_API_KEY not set — skipping fallback');
    return null;
  }

  const headers = { 'X-API-Key': apiKey };
  const { contractAddress, chainId, detectedChain } = detection;

  try {
    // ── Solana ──────────────────────────────────────────────────────────────────
    if (detectedChain === 'solana') {
      const [meta, price] = await Promise.allSettled([
        fetchWithRetry(`${MORALIS_SOL}/${contractAddress}/metadata`, { headers }),
        fetchWithRetry(`${MORALIS_SOL}/${contractAddress}/price`, { headers }),
      ]);

      const m = extractSettled(meta);
      const p = extractSettled(price);

      if (!m && !p) return null;

      return {
        tokenName: m?.name ?? null,
        tokenSymbol: m?.symbol ?? null,
        tokenLogo: m?.logo ?? null,
        priceUSD: p?.usdPrice ?? null,
        dataSource: ['moralis'],
      };
    }

    // ── EVM ─────────────────────────────────────────────────────────────────────
    const chain = MORALIS_CHAIN_MAP[chainId ?? 1] ?? 'eth';

    const [meta, price] = await Promise.allSettled([
      fetchWithRetry(
        `${MORALIS_EVM}/erc20/metadata?chain=${chain}&addresses[]=${contractAddress}`,
        { headers }
      ),
      fetchWithRetry(
        `${MORALIS_EVM}/erc20/${contractAddress}/price?chain=${chain}`,
        { headers }
      ),
    ]);

    const m = extractSettled(meta)?.[0];
    const p = extractSettled(price);

    if (!m && !p) return null;

    return {
      tokenName: m?.name ?? null,
      tokenSymbol: m?.symbol ?? null,
      tokenLogo: m?.logo ?? null,
      totalSupply: m?.total_supply_formatted ?? null,
      priceUSD: p?.usdPrice ?? null,
      priceChange24h: p?.['24hrPercentChange']
        ? parseFloat(p['24hrPercentChange'])
        : null,
      dataSource: ['moralis'],
    };
  } catch (err) {
    console.error(`[Moralis] Provider failed — ${err}`);
    return null;
  }
}
