import { WhaleTransaction } from '../../../types/whale';
import { labelAddress, chainIdToName, formatAge, dedupeAndSort } from '../utils';

// Known large wallet addresses to monitor for outgoing/incoming transfers
// These are major exchange hot wallets that move large volumes
const WHALE_WALLETS: { addr: string; label: string }[] = [
  { addr: '0x28c6c06298d514db089934071355e5743bf21d60', label: 'Binance' },
  { addr: '0x21a31ee1afc51d94c2efccaa2092ad1028285549', label: 'Binance' },
  { addr: '0xdfd5293d8e347dfe59e90efd55b2956a1343963d', label: 'Binance' },
  { addr: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503', label: 'Binance' },
  { addr: '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43', label: 'Coinbase' },
  { addr: '0x71660c4005ba85c37ccec55d0c4493e66fe775d3', label: 'Coinbase' },
  { addr: '0x0d0707963952f2fba59dd06f2b425ace40b492fe', label: 'Gate.io' },
  { addr: '0x2b5634c42055806a59e9107ed44d43c426e58258', label: 'KuCoin' },
  { addr: '0xa1d8d972560c2f8144af871db508f0b0b10a3fbf', label: 'Kraken' },
  { addr: '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b', label: 'OKX' },
  { addr: '0x236f9f97e0e62388479bf9e5ba4889e46b0273c3', label: 'Bybit' },
  { addr: '0x55fe002aeff02f77364de339a1292923a15844b8', label: 'Circle' },
  { addr: '0x5754284f345afc66a98fbb0a0afe71e0f007b949', label: 'Tether Treasury' },
];

// USDC and USDT on Ethereum
const ETH_TOKENS = [
  { addr: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', decimals: 6 },
  { addr: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', decimals: 6 },
];

const ETHERSCAN_V2 = 'https://api.etherscan.io/v2/api';

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' } as RequestInit);
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function fetchWalletTokenTx(
  wallet: { addr: string; label: string },
  token: { addr: string; symbol: string; decimals: number },
  threshold: number,
  chainId: number,
  apiKey: string
): Promise<WhaleTransaction[]> {
  const url = `${ETHERSCAN_V2}?chainid=${chainId}&module=account&action=tokentx` +
    `&address=${wallet.addr}` +
    `&contractaddress=${token.addr}` +
    `&page=1&offset=50&sort=desc&apikey=${apiKey}`;

  try {
    const res = await fetchWithTimeout(url);
    const data = await res.json();
    if (data.status !== '1' || !Array.isArray(data.result)) return [];

    const whales: WhaleTransaction[] = [];
    for (const tx of data.result) {
      const amount = parseFloat(tx.value) / Math.pow(10, token.decimals);
      const amountUSD = amount; // stablecoins = $1

      if (amountUSD < threshold) continue;

      const fromLabel = labelAddress(tx.from);
      const toLabel   = labelAddress(tx.to);

      whales.push({
        id:        `${tx.hash}-${token.symbol}`,
        hash:      tx.hash,
        chain:     chainIdToName(chainId),
        chainId,
        symbol:    token.symbol,
        amount,
        amountUSD,
        type:      'transfer',
        from: {
          address: tx.from,
          label:   fromLabel === 'Unknown' ? null : fromLabel,
          type:    fromLabel === 'Unknown' ? 'unknown' : 'exchange',
        },
        to: {
          address: tx.to,
          label:   toLabel === 'Unknown' ? null : toLabel,
          type:    toLabel === 'Unknown' ? 'unknown' : 'exchange',
        },
        timestamp: parseInt(tx.timeStamp) * 1000,
        age:       formatAge(parseInt(tx.timeStamp)),
        tokenAddress: token.addr,
      });
    }
    return whales;
  } catch (e) {
    console.warn(`Etherscan fetch failed [${wallet.label} ${token.symbol}]:`, e);
    return [];
  }
}

export async function scrapeEVMWhales(
  chainId: number,
  threshold: number,
  _useRoutescan = false
): Promise<WhaleTransaction[]> {
  const apiKey = process.env.ETHERSCAN_API_KEY ?? '';
  if (!apiKey && chainId === 1) return [];

  // For chain 1 (ETH), query each whale wallet x each stablecoin in parallel
  const jobs = WHALE_WALLETS.flatMap(wallet =>
    ETH_TOKENS.map(token => fetchWalletTokenTx(wallet, token, threshold, chainId, apiKey))
  );

  const results = await Promise.allSettled(jobs);
  const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
  return dedupeAndSort(all);
}
