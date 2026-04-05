// lib/cache.ts
// Next.js built-in caching via unstable_cache — no Redis, no extra cost.
import { unstable_cache } from 'next/cache';
import { scanToken } from './scanToken';
import { ScanResult } from './types/scan';

const CACHE_TAG = 'token-scan';

/**
 * Standard cache — 1 hour TTL for established tokens.
 */
export const getCachedScan = unstable_cache(
  async (input: string): Promise<ScanResult> => scanToken(input),
  [CACHE_TAG],
  {
    revalidate: 3600, // 1 hour
    tags: [CACHE_TAG],
  }
);

/**
 * Fresh cache — 5 minute TTL for new or high-risk tokens.
 * Caller decides which to use based on contractAgeDays / riskLevel.
 */
export const getCachedScanFresh = unstable_cache(
  async (input: string): Promise<ScanResult> => scanToken(input),
  [`${CACHE_TAG}-fresh`],
  {
    revalidate: 300, // 5 minutes
    tags: [`${CACHE_TAG}-fresh`],
  }
);

/**
 * Convenience: pick cache strategy based on token age and risk.
 * Tokens younger than 7 days or HIGH risk get the short TTL.
 */
export async function getCachedScanSmart(
  input: string,
  hint?: { ageDays?: number | null; riskLevel?: ScanResult['riskLevel'] }
): Promise<ScanResult> {
  const useFresh =
    (hint?.ageDays !== undefined &&
      hint.ageDays !== null &&
      hint.ageDays < 7) ||
    hint?.riskLevel === 'HIGH';

  return useFresh ? getCachedScanFresh(input) : getCachedScan(input);
}
