import { NextResponse } from 'next/server';
import { scrapeEVMWhales } from '@/lib/whales/scrapers/evmScraper';
import { scrapeSolanaWhales } from '@/lib/whales/scrapers/solanaScraper';

export const revalidate = 25;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threshold = parseInt(searchParams.get('min') ?? '100000');
  const chain     = searchParams.get('chain') ?? 'all';

  const includeEVM    = chain === 'all' || chain === 'ethereum';
  const includeSolana = chain === 'all' || chain === 'solana';

  const [evmResult, solanaResult] = await Promise.allSettled([
    includeEVM ? scrapeEVMWhales(1, threshold, false) : Promise.resolve([]),
    includeSolana ? scrapeSolanaWhales(threshold) : Promise.resolve([]),
  ]);

  const evmTxs = evmResult.status === 'fulfilled' ? evmResult.value : [];
  const solTxs = solanaResult.status === 'fulfilled' ? solanaResult.value : [];

  const all = [...evmTxs, ...solTxs]
    .sort((a, b) => b.amountUSD - a.amountUSD)
    .slice(0, 100);

  return NextResponse.json({
    transactions: all,
    count:        all.length,
    threshold,
    chain,
    fetchedAt:    new Date().toISOString(),
  });
}
