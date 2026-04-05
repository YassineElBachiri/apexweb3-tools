import { WhaleTransaction } from '../../types/whale';

export const KNOWN_ADDRESSES: Record<string, string> = {
  // Ethereum
  '0x28c6c06298d514db089934071355e5743bf21d60': 'Binance',
  '0x21a31ee1afc51d94c2efccaa2092ad1028285549': 'Binance',
  '0xdfd5293d8e347dfe59e90efd55b2956a1343963d': 'Binance',
  '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503': 'Binance',
  '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8': 'Binance Cold',
  '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43': 'Coinbase',
  '0x71660c4005ba85c37ccec55d0c4493e66fe775d3': 'Coinbase',
  '0x503828976d22510aad0201ac7ec8829321d23da': 'Coinbase',
  '0x77696bb39917c91a0c3908d577d5e322095425ca': 'Coinbase Cold',
  '0x0d0707963952f2fba59dd06f2b425ace40b492fe': 'Gate.io',
  '0xd793281182a0e3e023116004778f45c29fc14f19': 'Gate.io',
  '0x2b5634c42055806a59e9107ed44d43c426e58258': 'KuCoin',
  '0xa1d8d972560c2f8144af871db508f0b0b10a3fbf': 'Kraken',
  '0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0': 'Kraken',
  '0x0a869d79a7052c7f1b55a8ebabbea3420f0d1e13': 'Kraken',
  '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b': 'OKX',
  '0x236f9f97e0e62388479bf9e5ba4889e46b0273c3': 'Bybit',
  '0xf89d7b9c864f589bbf53a82105107622b35eaa40': 'Bybit',
  // Tether Treasury
  '0x5754284f345afc66a98fbb0a0afe71e0f007b949': 'Tether Treasury',
  // Circle
  '0x55fe002aeff02f77364de339a1292923a15844b8': 'Circle',
};

export function labelAddress(address: string): string {
  return KNOWN_ADDRESSES[address.toLowerCase()] ?? 'Unknown';
}

export function chainIdToName(id: number): string {
  const map: Record<number, string> = {
    1: 'ethereum', 56: 'bsc', 8453: 'base',
    42161: 'arbitrum', 137: 'polygon', 10: 'optimism',
    43114: 'avalanche',
  };
  return map[id] ?? 'unknown';
}

export function formatAge(unixSeconds: number): string {
  const diff = Math.floor(Date.now() / 1000) - unixSeconds;
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function shortAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size));
}

export function dedupeAndSort(txs: WhaleTransaction[]): WhaleTransaction[] {
  const seen = new Set<string>();
  return txs
    .filter(tx => { const k = !seen.has(tx.id); seen.add(tx.id); return k; })
    .sort((a, b) => b.amountUSD - a.amountUSD);
}

const priceCache = new Map<string, { price: number; ts: number }>();

export async function getTokenPrice(address: string): Promise<number> {
  const cached = priceCache.get(address);
  if (cached && Date.now() - cached.ts < 5 * 60 * 1000) return cached.price;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 6000);
    const res  = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`, { signal: controller.signal });
    clearTimeout(id);
    const data = await res.json();
    const price = parseFloat(data.pairs?.[0]?.priceUsd ?? '0');
    priceCache.set(address, { price, ts: Date.now() });
    return price;
  } catch {
    return 0;
  }
}
