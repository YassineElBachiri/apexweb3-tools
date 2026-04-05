// lib/providers/helius.ts
// Solana-only deep data provider (used when GoPlus Solana data is insufficient)
import { ChainDetection, ScanResult } from '../types/scan';
import { fetchWithRetry, extractSettled } from '../utils/fetchWithRetry';

const HELIUS_RPC = 'https://mainnet.helius-rpc.com';
const HELIUS_API = 'https://api.helius.xyz/v0';

export async function fetchHelius(
  detection: ChainDetection
): Promise<Partial<ScanResult> | null> {
  // Only applicable for Solana
  if (detection.inputType !== 'solana_address') return null;

  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    console.warn('[Helius] HELIUS_API_KEY not set — skipping Solana deep data');
    return null;
  }

  const { contractAddress } = detection;

  try {
    // Fire asset data + token holders in parallel
    const [assetRes, holdersRes] = await Promise.allSettled([
      fetchWithRetry(`${HELIUS_RPC}/?api-key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getAsset',
          params: { id: contractAddress },
        }),
      }),
      fetchWithRetry(
        `${HELIUS_API}/token-accounts?api-key=${apiKey}&mint=${contractAddress}&limit=20`
      ),
    ]);

    const asset = extractSettled(assetRes);
    const holdersData = extractSettled(holdersRes);

    const assetResult = asset?.result;
    const tokenAccounts: any[] = holdersData?.token_accounts ?? [];

    // Calculate basic holder concentration from returned accounts
    const totalBalance = tokenAccounts.reduce(
      (sum: number, acc: any) => sum + (acc.amount ?? 0),
      0
    );

    const holders = tokenAccounts.map((acc: any) => ({
      address: acc.owner ?? acc.address ?? '',
      percent:
        totalBalance > 0
          ? ((acc.amount / totalBalance) * 100).toFixed(4)
          : '0',
      isContract: false,
    }));

    const top10Percent = holders
      .slice(0, 10)
      .reduce((sum: number, h) => sum + parseFloat(h.percent), 0);

    return {
      tokenName: assetResult?.content?.metadata?.name ?? null,
      tokenSymbol: assetResult?.content?.metadata?.symbol ?? null,
      tokenLogo:
        assetResult?.content?.links?.image ??
        assetResult?.content?.json_uri ??
        null,
      holderCount: tokenAccounts.length,
      holders,
      top10HoldersPercent: top10Percent,
      dataSource: ['helius'],
    };
  } catch (err) {
    console.error(`[Helius] Provider failed — ${err}`);
    return null;
  }
}
