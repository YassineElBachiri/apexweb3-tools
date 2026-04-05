export const EXPLORERS: Record<string, string> = {
  ethereum:  'https://etherscan.io/tx/',
  bsc:       'https://bscscan.com/tx/',
  base:      'https://basescan.org/tx/',
  arbitrum:  'https://arbiscan.io/tx/',
  polygon:   'https://polygonscan.com/tx/',
  optimism:  'https://optimistic.etherscan.io/tx/',
  avalanche: 'https://snowtrace.io/tx/',
  solana:    'https://solscan.io/tx/',
};

export function getTxUrl(chain: string, hash: string): string {
  return (EXPLORERS[chain.toLowerCase()] ?? 'https://blockchair.com/search?q=') + hash;
}
