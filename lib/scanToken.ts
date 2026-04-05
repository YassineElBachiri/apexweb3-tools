import { chainDetector } from './chainDetector';
import { fetchGoPlus } from './providers/goplus';
import { fetchDexScreener } from './providers/dexscreener';
import { fetchMoralis } from './providers/moralis';
import { fetchHelius } from './providers/helius';
import { fetchContractData } from './providers/routescan';
import { computeRiskScore, scoreToLevel } from './riskScore';
import { ScanResult } from './types/scan';

export async function scanToken(input: string): Promise<ScanResult> {
  const t0 = Date.now();
  
  // 1. Detect chain and address
  const detection = await chainDetector(input);
  if (!detection.contractAddress) {
    throw new Error('Could not resolve token address');
  }

  // 2. Fetch parallel provider data
  const dataPromises: Array<Promise<Partial<ScanResult> | null>> = [];

  // GoPlus (EVM/Solana/Sui security)
  dataPromises.push(fetchGoPlus(detection));

  // DexScreener (Market/Liquidity globally)
  dataPromises.push(fetchDexScreener(detection));

  // Network-specific providers
  if (detection.detectedChain === 'solana') {
    dataPromises.push(fetchHelius(detection));
  } else if (detection.routescanSupported) {
    dataPromises.push(fetchContractData(detection));
  }
  
  // Moralis (Holders/Market fallback) if EVM
  if (detection.detectedChain !== 'solana' && detection.detectedChain !== 'sui') {
     dataPromises.push(fetchMoralis(detection));
  }

  const results = await Promise.all(dataPromises);

  // 3. Merge data
  let merged: Partial<ScanResult> = {
    contractAddress: detection.contractAddress,
    chainName: detection.detectedChain,
    chainId: detection.chainId,
    dataSource: [],
  };

  for (const res of results) {
    if (!res) continue;
    const ds = res.dataSource ?? [];
    merged = { 
      ...merged, 
      ...res, 
      // merge arrays safely
      dexList: res.dexList && res.dexList.length > 0 ? res.dexList : merged.dexList,
      holders: res.holders && res.holders.length > 0 ? res.holders : merged.holders,
      txns24h: res.txns24h ? res.txns24h : merged.txns24h,
    };
    // Special handling to merge dataSources uniquely
    merged.dataSource = Array.from(new Set([...(merged.dataSource ?? []), ...ds]));
  }

  // 4. Compute risk
  const score = computeRiskScore(merged);
  const level = scoreToLevel(score);

  // Default fallbacks
  const chainUrlComponent = merged.chainName?.toLowerCase() ?? 'unknown';
  const addrUrlComponent = merged.contractAddress ?? input;

  const finalResult: ScanResult = {
    contractAddress: merged.contractAddress ?? input,
    tokenName: merged.tokenName ?? 'Unknown Token',
    tokenSymbol: merged.tokenSymbol ?? '???',
    tokenLogo: merged.tokenLogo ?? null,
    chainName: merged.chainName ?? 'unknown',
    chainId: merged.chainId ?? null,
    
    riskScore: score,
    riskLevel: level,
    isHoneypot: merged.isHoneypot ?? false,
    honeypotReason: merged.honeypotReason ?? null,
    buyTax: merged.buyTax ?? 0,
    sellTax: merged.sellTax ?? 0,
    isContractVerified: merged.isContractVerified ?? false,
    isProxy: merged.isProxy ?? false,
    isMintable: merged.isMintable ?? false,
    ownerRenounced: merged.ownerRenounced ?? false,
    hasHiddenOwner: merged.hasHiddenOwner ?? false,
    canSelfDestruct: merged.canSelfDestruct ?? false,
    transferPausable: merged.transferPausable ?? false,
    isAntiWhale: merged.isAntiWhale ?? false,
    isBlacklisted: merged.isBlacklisted ?? false,

    liquidityUSD: merged.liquidityUSD ?? 0,
    liquidityLocked: merged.liquidityLocked ?? false,
    lpHolderCount: merged.lpHolderCount ?? 0,
    dexList: merged.dexList ?? [],

    holderCount: merged.holderCount ?? 0,
    top10HoldersPercent: merged.top10HoldersPercent ?? 0,
    holders: merged.holders ?? [],

    priceUSD: merged.priceUSD ?? null,
    marketCapUSD: merged.marketCapUSD ?? null,
    fdvUSD: merged.fdvUSD ?? null,
    volume24hUSD: merged.volume24hUSD ?? null,
    priceChange24h: merged.priceChange24h ?? null,
    txns24h: merged.txns24h ?? null,
    totalSupply: merged.totalSupply ?? null,
    pairCreatedAt: merged.pairCreatedAt ?? null,

    contractCreator: merged.contractCreator ?? null,
    contractCreatedAt: merged.contractCreatedAt ?? null,
    isOpenSource: merged.isOpenSource ?? false,
    contractAgeDays: merged.contractAgeDays ?? null,

    scannedAt: new Date().toISOString(),
    dataSource: merged.dataSource ?? [],
    scanDuration: Date.now() - t0,
    pageSlug: `${chainUrlComponent}/${addrUrlComponent}`,
    publicUrl: `https://apexweb3.com/token/${chainUrlComponent}/${addrUrlComponent}`,
  };

  return finalResult;
}
