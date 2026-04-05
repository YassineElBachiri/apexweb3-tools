// lib/providers/goplus.ts
import { ChainDetection, ScanResult } from '../types/scan';
import { fetchWithRetry } from '../utils/fetchWithRetry';

const GOPLUS_BASE = 'https://api.gopluslabs.io/api/v1';

export const GOPLUS_CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  bsc: 56,
  base: 8453,
  arbitrum: 42161,
  polygon: 137,
  optimism: 10,
  avalanche: 43114,
  fantom: 250,
  cronos: 25,
  gnosis: 100,
  tron: 728126428,
  zksync: 324,
  linea: 59144,
  scroll: 534352,
  blast: 81457,
  mantle: 5000,
  manta: 169,
  berachain: 80094,
  sonic: 146,
  abstract: 2741,
  worldchain: 480,
  soneium: 1868,
  morphl2: 2818,
};

export async function fetchGoPlus(
  detection: ChainDetection
): Promise<Partial<ScanResult>> {
  const { detectedChain, contractAddress, inputType } = detection;

  try {
    if (inputType === 'solana_address') {
      const url = `${GOPLUS_BASE}/solana/token_security?contract_addresses=${contractAddress}`;
      const res = await fetchWithRetry(url);
      if (!res?.result) {
        console.warn('[GoPlus] Solana: empty result');
        return { dataSource: [] };
      }
      return normalizeGoPlusSolana(res.result[contractAddress]);
    }

    if (inputType === 'sui_address') {
      const url = `${GOPLUS_BASE}/sui/token_security?contract_addresses=${contractAddress}`;
      const res = await fetchWithRetry(url);
      if (!res?.result) {
        console.warn('[GoPlus] Sui: empty result');
        return { dataSource: [] };
      }
      return normalizeGoPlusSui(res.result[contractAddress]);
    }

    // EVM
    const chainId = GOPLUS_CHAIN_IDS[detectedChain] ?? 1;
    const url = `${GOPLUS_BASE}/token_security/${chainId}?contract_addresses=${contractAddress}`;
    const res = await fetchWithRetry(url);

    if (!res?.result) {
      console.warn(`[GoPlus] EVM chain ${chainId}: empty result for ${contractAddress}`);
      return { dataSource: [] };
    }

    const data = res.result[contractAddress.toLowerCase()];
    return normalizeGoPlusEVM(data);
  } catch (err) {
    console.error(`[GoPlus] Provider failed — ${err}`);
    return { dataSource: [] };
  }
}

// ─── EVM normaliser ────────────────────────────────────────────────────────────
function normalizeGoPlusEVM(raw: any): Partial<ScanResult> {
  if (!raw) return { dataSource: [] };

  const holders = Array.isArray(raw.holders) ? raw.holders : [];
  const top10Percent = holders
    .slice(0, 10)
    .reduce((sum: number, h: any) => sum + parseFloat(h.percent || '0'), 0);

  const dexList = (raw.dex ?? []).map((d: any) => ({
    name: d.name ?? d.dex_name ?? 'Unknown',
    liquidity: d.liquidity ?? '0',
    pairAddress: d.pair ?? '',
  }));

  const totalLiquidity = dexList.reduce(
    (sum: number, d: any) => sum + parseFloat(d.liquidity || '0'),
    0
  );

  const lpHolders: any[] = raw.lp_holders ?? [];

  return {
    isHoneypot: raw.is_honeypot === '1',
    honeypotReason: raw.honeypot_with_same_creator
      ? 'Same creator has deployed honeypots before'
      : null,
    buyTax: parseFloat(raw.buy_tax || '0') * 100,
    sellTax: parseFloat(raw.sell_tax || '0') * 100,
    isMintable: raw.is_mintable === '1',
    ownerRenounced:
      raw.owner_address === '0x0000000000000000000000000000000000000000',
    hasHiddenOwner: raw.hidden_owner === '1',
    canSelfDestruct: raw.selfdestruct === '1',
    transferPausable: raw.transfer_pausable === '1',
    isAntiWhale: raw.is_anti_whale === '1',
    isBlacklisted: raw.is_blacklisted === '1',
    isProxy: raw.is_proxy === '1',
    isOpenSource: raw.is_open_source === '1',
    isContractVerified: raw.is_open_source === '1',
    holderCount: parseInt(raw.holder_count || '0', 10),
    totalSupply: raw.total_supply ?? null,
    top10HoldersPercent: top10Percent,
    holders: holders.slice(0, 20).map((h: any) => ({
      address: h.address,
      percent: h.percent,
      isContract: h.is_contract === 1,
    })),
    liquidityUSD: totalLiquidity,
    liquidityLocked: lpHolders.some((lp: any) => lp.is_locked === 1),
    lpHolderCount: parseInt(raw.lp_holder_count || '0', 10),
    dexList,
    dataSource: ['goplus'],
  };
}

// ─── Solana normaliser ─────────────────────────────────────────────────────────
function normalizeGoPlusSolana(raw: any): Partial<ScanResult> {
  if (!raw) return { dataSource: [] };

  return {
    isHoneypot: raw.is_honeypot === '1',
    honeypotReason: null,
    isMintable: raw.is_mintable === '1',
    transferPausable: raw.freezeable === '1',
    isOpenSource: true, // Solana programs are always on-chain readable
    isContractVerified: false,
    holderCount: parseInt(raw.holder_count || '0', 10),
    totalSupply: raw.total_supply ?? null,
    top10HoldersPercent: 0,
    holders: [],
    liquidityUSD: 0,
    liquidityLocked: false,
    lpHolderCount: 0,
    dexList: [],
    dataSource: ['goplus'],
  };
}

// ─── Sui normaliser ────────────────────────────────────────────────────────────
function normalizeGoPlusSui(raw: any): Partial<ScanResult> {
  if (!raw) return { dataSource: [] };

  return {
    isHoneypot: false,
    honeypotReason: null,
    isMintable: raw.is_mintable === '1',
    transferPausable: false,
    isOpenSource: raw.is_open_source === '1',
    isContractVerified: raw.is_open_source === '1',
    holderCount: 0,
    totalSupply: raw.total_supply ?? null,
    top10HoldersPercent: 0,
    holders: [],
    liquidityUSD: 0,
    liquidityLocked: false,
    lpHolderCount: 0,
    dexList: [],
    dataSource: ['goplus'],
  };
}
