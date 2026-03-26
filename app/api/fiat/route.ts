import { NextRequest, NextResponse } from 'next/server';
import { ALL_VS_CURRENCIES } from '@/lib/country-config';

// ─── In-memory cache (survives hot-reload in dev) ─────────────────────────────

const cache = new Map<string, { data: unknown; expiresAt: number }>();

function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) return Promise.resolve(entry.data as T);
  return fn().then(data => {
    cache.set(key, { data, expiresAt: Date.now() + ttlMs });
    return data;
  });
}

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const HEADERS = { 'Accept': 'application/json', 'User-Agent': 'ApexWeb3/1.0' };

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'prices': {
        const coinId = searchParams.get('coinId') ?? 'bitcoin';
        const currencies = searchParams.get('currencies') ?? ALL_VS_CURRENCIES;
        const data = await cached(`prices:${coinId}:${currencies}`, 60_000, async () => {
          const url = `${COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=${currencies}&include_24hr_change=true`;
          const res = await fetch(url, { headers: HEADERS, next: { revalidate: 60 } });
          if (!res.ok) throw new Error(`CoinGecko prices failed: ${res.status}`);
          return res.json();
        });
        return NextResponse.json(data);
      }

      case 'sparkline': {
        const coinId = searchParams.get('coinId') ?? 'bitcoin';
        const data = await cached(`sparkline:${coinId}`, 3_600_000, async () => {
          // 7 days of daily data, in USD — we convert client-side using live rates
          const url = `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`;
          const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
          if (!res.ok) throw new Error(`CoinGecko sparkline failed: ${res.status}`);
          const raw = await res.json();
          // Flatten to just price array (7-8 points)
          return (raw.prices as [number, number][]).map(([, price]) => price);
        });
        return NextResponse.json({ prices: data });
      }

      case 'geo': {
        // Called once per session, cached 24h in localStorage client-side.
        // Server-side proxy avoids CORS issues and protects the API.
        try {
          const data = await cached('geo', 86_400_000, async () => {
            const res = await fetch('https://ipapi.co/json/', {
              headers: { ...HEADERS, 'Accept': 'application/json' },
              signal: AbortSignal.timeout(4000),
            });
            if (!res.ok) throw new Error('Geo lookup failed');
            const raw = await res.json();
            return {
              country_code: raw.country_code ?? 'US',
              currency: raw.currency ?? 'USD',
              country_name: raw.country_name ?? 'United States',
            };
          });
          return NextResponse.json(data);
        } catch {
          // Return a graceful default — client will use US/USD as baseline
          return NextResponse.json({
            country_code: 'US',
            currency: 'USD',
            country_name: 'United States',
          });
        }
      }

      case 'coin-list': {
        // Top 100 coins for the coin selector
        const data = await cached('coin-list', 3_600_000, async () => {
          const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
          const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
          if (!res.ok) throw new Error(`CoinGecko coin-list failed: ${res.status}`);
          const raw = await res.json();
          return raw.map((c: { id: string; symbol: string; name: string; image: string }) => ({
            id: c.id, symbol: c.symbol, name: c.name, image: c.image,
          }));
        });
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
