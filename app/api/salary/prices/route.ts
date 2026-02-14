import { NextResponse } from 'next/server';
import { getBulkPrices } from '@/lib/coingecko';

const ALLOWED_CRYPTOS = [
    'bitcoin', 'ethereum', 'solana', 'usd-coin', 'tether',
    'binancecoin', 'cardano', 'polygon', 'polkadot', 'litecoin'
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cryptoParam = searchParams.get('crypto');

    if (!cryptoParam) {
        return NextResponse.json({ error: 'Missing crypto parameter' }, { status: 400 });
    }

    const cryptos = cryptoParam.split(',').filter(id => id.trim().length > 0);

    // Validate cryptos to prevent abuse
    // In production, we might want to check against a full list of valid IDs
    // For now, we'll allow any ID but limit the number of IDs
    if (cryptos.length > 20) {
        return NextResponse.json({ error: 'Too many crypto IDs' }, { status: 400 });
    }

    try {
        const pricesMap = await getBulkPrices(cryptos);
        const prices: Record<string, number> = {};

        pricesMap.forEach((price, id) => {
            prices[id] = price;
        });

        return NextResponse.json({ prices });
    } catch (error) {
        console.error('Price API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
    }
}
