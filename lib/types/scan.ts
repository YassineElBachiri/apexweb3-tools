// lib/types/scan.ts
// Central type definitions for the token security scanner

export interface ChainDetection {
  inputType: 'evm_address' | 'solana_address' | 'sui_address' | 'token_name';
  detectedChain: string;
  chainId: number | null;
  contractAddress: string;
  confidence: 'high' | 'medium' | 'low';
  routescanSupported: boolean;
}

export interface DexEntry {
  name: string;
  liquidity: string;
  pairAddress: string;
}

export interface HolderEntry {
  address: string;
  percent: string;
  isContract: boolean;
}

export interface ScanResult {
  // Identity
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string | null;
  chainName: string;
  chainId: number | null;

  // Security — from GoPlus
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  isHoneypot: boolean;
  honeypotReason: string | null;
  buyTax: number;
  sellTax: number;
  isContractVerified: boolean;
  isProxy: boolean;
  isMintable: boolean;
  ownerRenounced: boolean;
  hasHiddenOwner: boolean;
  canSelfDestruct: boolean;
  transferPausable: boolean;
  isAntiWhale: boolean;
  isBlacklisted: boolean;

  // Liquidity — from GoPlus + DexScreener
  liquidityUSD: number;
  liquidityLocked: boolean;
  lpHolderCount: number;
  dexList: DexEntry[];

  // Holders — from GoPlus
  holderCount: number;
  top10HoldersPercent: number;
  holders: HolderEntry[];

  // Market — from DexScreener → Moralis fallback
  priceUSD: number | null;
  marketCapUSD: number | null;
  fdvUSD: number | null;
  volume24hUSD: number | null;
  priceChange24h: number | null;
  txns24h: { buys: number; sells: number } | null;
  totalSupply: string | null;
  pairCreatedAt: string | null;

  // Contract — from Routescan → Etherscan (ETH only)
  contractCreator: string | null;
  contractCreatedAt: string | null;
  isOpenSource: boolean;
  contractAgeDays: number | null;

  // Meta
  scannedAt: string;
  dataSource: string[];
  scanDuration: number;
  pageSlug: string;
  publicUrl: string;
}
