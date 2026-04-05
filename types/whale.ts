export interface WhaleTransaction {
  id: string
  hash: string
  chain: string
  chainId: number | null
  symbol: string
  amount: number
  amountUSD: number
  type: 'transfer' | 'mint' | 'burn' | 'lock' | 'unlock' | string
  from: { address: string; label: string | null; type: string | null }
  to:   { address: string; label: string | null; type: string | null }
  timestamp: number   // ms
  age: string         // '2m ago'
  tokenAddress?: string
}
