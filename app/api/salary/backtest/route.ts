
import { NextResponse } from 'next/server';
import { getTokenHistoricalData } from '@/lib/coingecko';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cryptoId = searchParams.get('crypto');
    const daysParam = searchParams.get('days');

    if (!cryptoId) {
        return NextResponse.json({ error: 'Missing crypto parameter' }, { status: 400 });
    }

    const days = daysParam ? parseInt(daysParam, 10) : 365;

    if (isNaN(days) || days <= 0 || days > 3650) { // Limit to 10 years
        return NextResponse.json({ error: 'Invalid days parameter' }, { status: 400 });
    }

    try {
        const prices = await getTokenHistoricalData(cryptoId, days);
        return NextResponse.json({ prices });
    } catch (error) {
        console.error('Backtest API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
    }
}
