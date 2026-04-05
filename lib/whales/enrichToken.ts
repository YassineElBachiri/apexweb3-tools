export async function enrichTokenData(address: string) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`, {
      signal: controller.signal
    });
    clearTimeout(id);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.pairs && data.pairs.length > 0) {
      // Find highest liquidity pair
      const bestPair = data.pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
      return {
        priceUsd: parseFloat(bestPair.priceUsd || "0"),
        logoUrl: bestPair.info?.imageUrl || undefined,
        symbol: bestPair.baseToken?.symbol || undefined,
      };
    }
  } catch (e) {
    console.warn("DexScreener enrich failed:", e);
  }
  return null;
}
