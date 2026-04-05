// lib/riskScore.ts
import { ScanResult } from './types/scan';

/**
 * Compute a 0–100 security score for a token.
 * 100 = perfectly safe, 0 = confirmed rug/honeypot.
 *
 * Algorithm: start at 100, apply weighted deductions, then apply bonuses.
 * Final value is clamped to [0, 100].
 */
export function computeRiskScore(data: Partial<ScanResult>): number {
  let score = 100;

  // ── CRITICAL deductions ─────────────────────────────────────────────────────
  if (data.isHoneypot)       score -= 40;
  if (data.transferPausable) score -= 25;
  if (data.hasHiddenOwner)   score -= 20;

  // ── HIGH deductions ─────────────────────────────────────────────────────────
  if (data.isMintable)                         score -= 15;
  if (data.canSelfDestruct)                    score -= 15;
  if (data.ownerRenounced === false)           score -= 10;

  // ── MEDIUM deductions ───────────────────────────────────────────────────────
  if ((data.sellTax ?? 0) > 10)               score -= 10;
  if ((data.buyTax ?? 0) > 10)               score -= 10;
  if ((data.top10HoldersPercent ?? 0) > 80)  score -= 10;
  if ((data.liquidityUSD ?? 0) < 10_000)     score -= 10;
  if (data.isProxy)                           score -= 8;

  // ── LOW deductions ──────────────────────────────────────────────────────────
  if (!data.isOpenSource)                         score -= 5;
  if ((data.holderCount ?? 0) < 100)             score -= 5;
  if (!data.liquidityLocked)                      score -= 5;
  if ((data.contractAgeDays ?? 999) < 7)         score -= 5;

  // ── BONUSES ─────────────────────────────────────────────────────────────────
  if (data.isOpenSource && data.isContractVerified) score += 5;
  if (data.liquidityLocked)                         score += 5;
  if (data.ownerRenounced)                          score += 5;
  if ((data.holderCount ?? 0) > 10_000)            score += 3;

  return Math.max(0, Math.min(100, score));
}

/**
 * Convert a numeric score to a named risk level.
 */
export function scoreToLevel(score: number): ScanResult['riskLevel'] {
  if (score <= 30) return 'HIGH';
  if (score <= 60) return 'MEDIUM';
  if (score <= 85) return 'LOW';
  return 'SAFE';
}

/**
 * Return a human-readable summary of the biggest risk factors found.
 */
export function topRiskFlags(data: Partial<ScanResult>): string[] {
  const flags: string[] = [];
  if (data.isHoneypot)                         flags.push('Honeypot detected');
  if (data.transferPausable)                   flags.push('Transfer can be paused');
  if (data.hasHiddenOwner)                     flags.push('Hidden owner detected');
  if (data.isMintable)                         flags.push('Mintable supply');
  if (data.canSelfDestruct)                    flags.push('Self-destruct function');
  if (!data.ownerRenounced)                    flags.push('Owner not renounced');
  if ((data.sellTax ?? 0) > 10)               flags.push(`High sell tax (${data.sellTax?.toFixed(1)}%)`);
  if ((data.buyTax ?? 0) > 10)               flags.push(`High buy tax (${data.buyTax?.toFixed(1)}%)`);
  if ((data.top10HoldersPercent ?? 0) > 80)  flags.push('Top 10 hold >80% supply');
  if ((data.liquidityUSD ?? 0) < 10_000)     flags.push('Very low liquidity (<$10K)');
  if (!data.isOpenSource)                     flags.push('Unverified contract');
  if (!data.liquidityLocked)                  flags.push('Liquidity not locked');
  return flags;
}
