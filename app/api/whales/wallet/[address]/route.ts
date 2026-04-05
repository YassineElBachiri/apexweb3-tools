import { NextResponse } from 'next/server';
import { labelAddress, formatAge } from '@/lib/whales/utils';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || '';

async function fetchEVMHistory(address: string, chainId: number, apiKey: string) {
    const domain = chainId === 1 ? 'api.etherscan.io/v2/api' : 'api.basescan.org/api';
    const baseUrl = chainId === 1 ? `https://${domain}?chainid=1` : `https://${domain}`;
    
    // We'll fetch the last 20 token transfers (ERC20)
    const url = `${baseUrl}&module=account&action=tokentx&address=${address}&page=1&offset=20&sort=desc&apikey=${apiKey}`;
    
    try {
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        if (data.status !== '1' || !Array.isArray(data.result)) return [];

        return data.result.map((tx: any) => {
            const amount = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal));
            const fromLabel = labelAddress(tx.from);
            const toLabel = labelAddress(tx.to);

            return {
                id: `${tx.hash}-${tx.contractAddress}`,
                hash: tx.hash,
                chain: chainId === 1 ? 'ethereum' : 'base',
                symbol: tx.tokenSymbol,
                amount,
                amountUSD: amount, // simplify for stables
                timestamp: parseInt(tx.timeStamp) * 1000,
                age: formatAge(parseInt(tx.timeStamp)),
                from: { address: tx.from, label: fromLabel === 'Unknown' ? null : fromLabel, type: fromLabel === 'Unknown' ? 'unknown' : 'exchange' },
                to: { address: tx.to, label: toLabel === 'Unknown' ? null : toLabel, type: toLabel === 'Unknown' ? 'unknown' : 'exchange' },
            };
        });
    } catch (e) {
        console.error(`Failed to fetch history for ${address} on chain ${chainId}`, e);
        return [];
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ address: string }> }) {
    const { address } = await params;
    const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);

    if (isSolana) {
        // For now, Solana wallet history is complex to scrape via RPC without a dedicated indexer
        // Return empty or mock for now
        return NextResponse.json({ transactions: [], address, chain: 'solana' });
    }

    // Fetch from ETH and Base in parallel
    const [ethResults, baseResults] = await Promise.all([
        fetchEVMHistory(address, 1, ETHERSCAN_API_KEY),
        fetchEVMHistory(address, 8453, BASESCAN_API_KEY)
    ]);

    const all = [...ethResults, ...baseResults].sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
        address,
        transactions: all,
        count: all.length,
        fetchedAt: new Date().toISOString()
    });
}
