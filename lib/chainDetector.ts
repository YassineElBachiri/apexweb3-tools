// lib/chainDetector.ts
import { ChainDetection } from './types/scan';
import { fetchWithRetry } from './utils/fetchWithRetry';

// Chains to probe in priority order when we see a 0x EVM address
const EVM_PROBE_ORDER: Array<{ name: string; id: number }> = [
  { name: 'ethereum', id: 1 },
  { name: 'bsc', id: 56 },
  { name: 'base', id: 8453 },
  { name: 'arbitrum', id: 42161 },
  { name: 'polygon', id: 137 },
  { name: 'optimism', id: 10 },
  { name: 'avalanche', id: 43114 },
  { name: 'fantom', id: 250 },
  { name: 'cronos', id: 25 },
  { name: 'gnosis', id: 100 },
];

// Chains that Routescan supports for free (no paywall)
const ROUTESCAN_SUPPORTED_CHAIN_IDS = new Set([
  8453, 56, 10, 42161, 137, 43114, 250, 25, 100,
]);

const GOPLUS_BASE = 'https://api.gopluslabs.io/api/v1';
const DEX_SEARCH_URL = 'https://api.dexscreener.com/latest/dex/search';

// ─── Regex patterns ────────────────────────────────────────────────────────────
const EVM_RE = /^0x[0-9a-fA-F]{40}$/;
// Sui addresses start with 0x but are longer (typically 64 hex chars after 0x)
const SUI_RE = /^0x[0-9a-fA-F]{62,}$/;
const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Detects which chain a token address/name belongs to.
 * Returns a fully-resolved ChainDetection object.
 */
export async function chainDetector(input: string): Promise<ChainDetection> {
  const trimmed = input.trim();

  // ── Sui (must check before EVM because both start with 0x) ──────────────────
  if (SUI_RE.test(trimmed)) {
    return {
      inputType: 'sui_address',
      detectedChain: 'sui',
      chainId: null,
      contractAddress: trimmed,
      confidence: 'high',
      routescanSupported: false,
    };
  }

  // ── EVM ─────────────────────────────────────────────────────────────────────
  if (EVM_RE.test(trimmed)) {
    return await detectEVMChain(trimmed);
  }

  // ── Solana ──────────────────────────────────────────────────────────────────
  if (SOLANA_RE.test(trimmed)) {
    return {
      inputType: 'solana_address',
      detectedChain: 'solana',
      chainId: null,
      contractAddress: trimmed,
      confidence: 'high',
      routescanSupported: false,
    };
  }

  // ── Token name / symbol ─────────────────────────────────────────────────────
  return await detectByName(trimmed);
}

// ─── EVM: probe GoPlus on each chain until we get a hit ───────────────────────
async function detectEVMChain(address: string): Promise<ChainDetection> {
  for (const chain of EVM_PROBE_ORDER) {
    try {
      const url = `${GOPLUS_BASE}/token_security/${chain.id}?contract_addresses=${address}`;
      const res = await fetchWithRetry(url, {}, 2, 300);
      // GoPlus returns code:1 with result when found
      if (res?.code === 1 && res?.result?.[address.toLowerCase()]) {
        return {
          inputType: 'evm_address',
          detectedChain: chain.name,
          chainId: chain.id,
          contractAddress: address,
          confidence: 'high',
          routescanSupported: ROUTESCAN_SUPPORTED_CHAIN_IDS.has(chain.id),
        };
      }
    } catch {
      // silent — try next chain
    }
  }

  // GoPlus found nothing — default to Ethereum with low confidence
  console.warn(`[chainDetector] EVM address ${address} not found on any chain — defaulting to Ethereum`);
  return {
    inputType: 'evm_address',
    detectedChain: 'ethereum',
    chainId: 1,
    contractAddress: address,
    confidence: 'low',
    routescanSupported: false,
  };
}

// ─── Token name: resolve via DexScreener search ───────────────────────────────
async function detectByName(query: string): Promise<ChainDetection> {
  const res = await fetchWithRetry(`${DEX_SEARCH_URL}?q=${encodeURIComponent(query)}`);

  if (res?.pairs?.length) {
    const best = res.pairs.sort(
      (a: any, b: any) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
    )[0];

    const resolvedAddress = best.baseToken?.address ?? '';
    const dexChainId = best.chainId as string;

    // Map DexScreener chainId string to our known chain entries
    const chainEntry = EVM_PROBE_ORDER.find(
      (c) => c.name === dexChainId || c.name === dexChainId?.toLowerCase()
    );

    if (dexChainId === 'solana') {
      return {
        inputType: 'solana_address',
        detectedChain: 'solana',
        chainId: null,
        contractAddress: resolvedAddress,
        confidence: 'medium',
        routescanSupported: false,
      };
    }

    if (chainEntry && EVM_RE.test(resolvedAddress)) {
      return {
        inputType: 'evm_address',
        detectedChain: chainEntry.name,
        chainId: chainEntry.id,
        contractAddress: resolvedAddress,
        confidence: 'medium',
        routescanSupported: ROUTESCAN_SUPPORTED_CHAIN_IDS.has(chainEntry.id),
      };
    }
  }

  // Fallback — return minimal object so caller can still try providers
  console.warn(`[chainDetector] Could not resolve "${query}" via DexScreener`);
  return {
    inputType: 'token_name',
    detectedChain: 'unknown',
    chainId: null,
    contractAddress: query,
    confidence: 'low',
    routescanSupported: false,
  };
}
