import { NextResponse } from 'next/server';

// Server-side simple cache
interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds for live prices

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const ids = searchParams.get('ids');

    if (!action || !ids) {
        return NextResponse.json({ error: 'Missing action or ids parameters' }, { status: 400 });
    }

    try {
        if (action === 'live') {
            const cacheKey = `live_${ids}`;
            const cached = cache.get(cacheKey);
            if (cached && cached.expiresAt > Date.now()) {
                return NextResponse.json(cached.data);
            }

            // Fetch live prices from CoinGecko
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`, {
                next: { revalidate: 30 } // Next.js fetch cache supplement
            });
            
            if (!res.ok) throw new Error('Failed to fetch from CoinGecko');
            const data = await res.json();
            
            cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
            return NextResponse.json(data);
        }

        if (action === 'historical') {
            const date = searchParams.get('date'); // format dd-mm-yyyy
            if (!date) return NextResponse.json({ error: 'Missing date for historical fetch' }, { status: 400 });
            
            const cacheKey = `hist_${ids}_${date}`;
            const cached = cache.get(cacheKey);
            // Historical data never changes, cache indefinitely (in memory until server restart)
            if (cached) return NextResponse.json(cached.data);

            const res = await fetch(`https://api.coingecko.com/api/v3/coins/${ids}/history?date=${date}`);
            if (!res.ok) throw new Error('Failed to fetch historical data');
            const data = await res.json();
            
            // Extract just the USD price to save bandwidth
            const priceUsd = data?.market_data?.current_price?.usd || 0;
            const result = { id: ids, date, price: priceUsd };
            
            cache.set(cacheKey, { data: result, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365 }); // 1 year
            return NextResponse.json(result);
        }

        if (action === 'chart') {
            const days = searchParams.get('days') || '7';
            const cacheKey = `chart_${ids}_${days}`;
            const cached = cache.get(cacheKey);
            if (cached && cached.expiresAt > Date.now()) return NextResponse.json(cached.data);

            const res = await fetch(`https://api.coingecko.com/api/v3/coins/${ids}/market_chart?vs_currency=usd&days=${days}`);
            if (!res.ok) throw new Error('Chart API failed');
            const data = await res.json();
            
            cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS * 4 }); // 2 mins chart cache
            return NextResponse.json(data);
        }

        if (action === 'allCoins') {
            const cacheKey = 'all_coins_list';
            const cached = cache.get(cacheKey);
            if (cached) return NextResponse.json(cached.data);

            const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
            if (!res.ok) throw new Error('Coins list API failed');
            const data = await res.json();
            
            cache.set(cacheKey, { data, expiresAt: Date.now() + 1000 * 60 * 60 * 24 }); // Cache for 24 hours
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Crypto API Route Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
