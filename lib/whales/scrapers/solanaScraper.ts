import { WhaleTransaction } from '../../../types/whale';
import { labelAddress, formatAge, dedupeAndSort, chunk } from '../utils';

const SOL_RPC  = 'https://api.mainnet-beta.solana.com';
const SOLANA_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOLANA_USDT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

async function rpc(method: string, params: unknown[]) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(SOL_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: controller.signal,
      next: { revalidate: 25 },
    } as RequestInit);
    clearTimeout(id);
    return res.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

export async function scrapeSolanaWhales(threshold: number): Promise<WhaleTransaction[]> {
  const whales: WhaleTransaction[] = [];

  for (const mint of [SOLANA_USDC, SOLANA_USDT]) {
    const symbol = mint === SOLANA_USDC ? 'USDC' : 'USDT';
    try {
      const sigData = await rpc('getSignaturesForAddress', [
        mint,
        { limit: 30, commitment: 'confirmed' }
      ]);

      const sigs: string[] = (sigData.result ?? [])
        .filter((s: any) => !s.err)
        .map((s: any) => s.signature);

      const batches = chunk(sigs, 10);
      for (const batch of batches) {
        const txResults = await Promise.allSettled(
          batch.map(sig =>
            rpc('getTransaction', [
              sig,
              { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }
            ])
          )
        );

        for (const result of txResults) {
          if (result.status !== 'fulfilled') continue;
          const tx = result.value?.result;
          if (!tx) continue;

          const instructions: any[] = tx.transaction?.message?.instructions ?? [];
          for (const ix of instructions) {
            if (ix.program !== 'spl-token') continue;
            if (ix.parsed?.type !== 'transfer' && ix.parsed?.type !== 'transferChecked') continue;

            const info = ix.parsed.info;
            const rawAmount = info.tokenAmount?.uiAmount ?? parseFloat(info.amount ?? '0') / 1e6;
            const amountUSD = rawAmount; // stablecoins ≈ $1

            if (amountUSD < threshold) continue;

            const fromAddr = info.source ?? info.authority ?? 'unknown';
            const toAddr   = info.destination ?? 'unknown';
            const fromLabel = labelAddress(fromAddr);
            const toLabel   = labelAddress(toAddr);

            whales.push({
              id:        `${tx.transaction.signatures[0]}-${symbol}`,
              hash:      tx.transaction.signatures[0],
              chain:     'solana',
              chainId:   null,
              symbol,
              amount:    rawAmount,
              amountUSD,
              type:      'transfer',
              from: {
                address: fromAddr,
                label:   fromLabel === 'Unknown' ? null : fromLabel,
                type:    fromLabel === 'Unknown' ? 'unknown' : 'exchange',
              },
              to: {
                address: toAddr,
                label:   toLabel === 'Unknown' ? null : toLabel,
                type:    toLabel === 'Unknown' ? 'unknown' : 'exchange',
              },
              timestamp: (tx.blockTime ?? 0) * 1000,
              age:       formatAge(tx.blockTime ?? 0),
            });
          }
        }
      }
    } catch (e) {
      console.warn(`Solana scrape failed for ${symbol}:`, e);
    }
  }

  return dedupeAndSort(whales);
}
