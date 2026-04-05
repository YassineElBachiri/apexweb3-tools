import { WhaleTransaction } from '../../types/whale';

function formatAge(timestampUnix: number): string {
  const diffMs = Date.now() - (timestampUnix * 1000);
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function normalizeWhaleAlert(raw: any): WhaleTransaction {
  return {
    id:          raw.id,
    hash:        raw.hash,
    chain:       raw.blockchain,
    symbol:      raw.symbol?.toUpperCase() || 'UNKNOWN',
    amount:      raw.amount || 0,
    amountUSD:   raw.amount_usd || 0,
    type:        raw.transaction_type,
    from: {
      address:   raw.from?.address || 'Unknown',
      label:     raw.from?.owner ?? null,
      type:      raw.from?.owner_type ?? null,
    },
    to: {
      address:   raw.to?.address || 'Unknown',
      label:     raw.to?.owner ?? null,
      type:      raw.to?.owner_type ?? null,
    },
    timestamp:   raw.timestamp * 1000,
    age:         formatAge(raw.timestamp),
    chainId:     null,
  }
}
