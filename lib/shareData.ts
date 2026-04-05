// lib/shareData.ts
import { ScanResult } from './types/scan';

export interface ShareData {
  tweetUrl: string;
  publicPageUrl: string;
  copyText: string;
  shareCardData: ShareCardData;
}

export interface ShareCardData {
  tokenName: string;
  symbol: string;
  chain: string;
  score: number;
  level: ScanResult['riskLevel'];
  isHoneypot: boolean;
  sellTax: number;
  buyTax: number;
  liquidityUSD: number;
  holderCount: number;
  priceUSD: number | null;
  priceChange24h: number | null;
}

const LEVEL_EMOJI: Record<ScanResult['riskLevel'], string> = {
  HIGH: '🔴',
  MEDIUM: '🟡',
  LOW: '🟢',
  SAFE: '✅',
};

const formatLiquidity = (n: number): string => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

export function generateShareData(result: ScanResult): ShareData {
  const emoji = LEVEL_EMOJI[result.riskLevel] ?? '❓';

  const tweet =
    `I just scanned ${result.tokenName} (${result.tokenSymbol}) on @ApexWeb3 🔍\n\n` +
    `${emoji} Risk Score: ${result.riskScore}/100\n` +
    `🍯 Honeypot: ${result.isHoneypot ? 'DANGER ⚠️' : 'SAFE ✅'}\n` +
    `💰 Sell Tax: ${result.sellTax.toFixed(1)}%\n` +
    `💧 Liquidity: ${formatLiquidity(result.liquidityUSD)}\n\n` +
    `Full report 👇\n` +
    `${result.publicUrl}\n\n` +
    `#Web3 #CryptoSafety #DeFi #${result.tokenSymbol}`;

  return {
    tweetUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
    publicPageUrl: result.publicUrl,
    copyText: result.publicUrl,
    shareCardData: {
      tokenName: result.tokenName,
      symbol: result.tokenSymbol,
      chain: result.chainName,
      score: result.riskScore,
      level: result.riskLevel,
      isHoneypot: result.isHoneypot,
      sellTax: result.sellTax,
      buyTax: result.buyTax,
      liquidityUSD: result.liquidityUSD,
      holderCount: result.holderCount,
      priceUSD: result.priceUSD,
      priceChange24h: result.priceChange24h,
    },
  };
}
