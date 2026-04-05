// lib/providers/dexscreener.ts
import { ChainDetection, ScanResult } from '../types/scan';
import { fetchWithRetry } from '../utils/fetchWithRetry';

const DEX_BASE = 'https://api.dexscreener.com/latest/dex';

export async function fetchDexScreener(
  detection: ChainDetection
): Promise<Partial<ScanResult> | null> {
  const { contractAddress } = detection;

  try {
    const url = `${DEX_BASE}/tokens/${contractAddress}`;
    const res = await fetchWithRetry(url);

    if (!res?.pairs || res.pairs.length === 0) {
      console.warn(`[DexScreener] No pairs found for ${contractAddress}`);
      return null;
    }

    // Sort by liquidity descending — take the highest-liquidity pair as canonical
    const pairs: any[] = [...res.pairs].sort(
      (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
    );
    const best = pairs[0];

    return {
      tokenName: best.baseToken?.name ?? 'Unknown',
      tokenSymbol: best.baseToken?.symbol ?? '???',
      priceUSD: parseFloat(best.priceUsd ?? '0') || null,
      marketCapUSD: best.marketCap ?? null,
      fdvUSD: best.fdv ?? null,
      volume24hUSD: best.volume?.h24 ?? null,
      priceChange24h: best.priceChange?.h24 ?? null,
      liquidityUSD: best.liquidity?.usd ?? 0,
      txns24h: {
        buys: best.txns?.h24?.buys ?? 0,
        sells: best.txns?.h24?.sells ?? 0,
      },
      pairCreatedAt: best.pairCreatedAt
        ? new Date(best.pairCreatedAt).toISOString()
        : null,
      // Build dexList from up to 5 best pairs
      dexList: pairs.slice(0, 5).map((p: any) => ({
        name: p.dexId ?? 'Unknown',
        liquidity: String(p.liquidity?.usd ?? '0'),
        pairAddress: p.pairAddress ?? '',
      })),
      dataSource: ['dexscreener'],
    };
  } catch (err) {
    console.error(`[DexScreener] Provider failed — ${err}`);
    return null;
  }
}
