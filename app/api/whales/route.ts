import { NextResponse } from "next/server";
import { WhaleWatchData, WhaleTransaction } from "@/types";
import { fetchLatestBlockNumber, fetchBlockTransactions, EtherscanTx } from "@/lib/api/etherscan";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const minValue = Number(searchParams.get("minValue")) || 10000; // Default $10k for testing

        // 1. Get latest block
        const latestBlock = await fetchLatestBlockNumber();
        if (!latestBlock) {
            throw new Error("Failed to fetch latest block");
        }

        // 2. Get transactions from the latest block (and maybe previous if needed)
        // For speed, let's just check the latest block first.
        const etherscanTxs = await fetchBlockTransactions(latestBlock);

        // 3. Filter and Format
        const whaleTransactions: WhaleTransaction[] = [];

        // Approximate ETH Price for filtering (could fetch real price but let's use a static safe lower bound or fetch if possible)
        // For now, let's assume ETH = $2500 for fast filtering, or use CoinGecko if handy. 
        // Better: Just use the value in Wei and convert.
        const ETH_PRICE_USD = 2500; // Fallback

        for (const tx of etherscanTxs) {
            // Skip 0 value txs
            if (tx.value === "0" || tx.value === "0x0") continue;

            // Etherscan proxy returns values in HEX
            const valueWei = parseInt(tx.value, 16);
            if (isNaN(valueWei)) continue;

            const valueEth = valueWei / 1e18;
            const valueUsd = valueEth * ETH_PRICE_USD;

            if (valueUsd >= minValue) {
                whaleTransactions.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: valueEth,
                    valueUsd: valueUsd,
                    token: "ETH", // Currently only scanning native ETH transfers
                    amount: valueEth,
                    timestamp: parseInt(tx.timeStamp) * 1000 || Date.now(),
                    type: "transfer", // Hard to distinguish buy/sell without internal DEX logic, keeping as transfer
                });
            }
        }

        const data: WhaleWatchData = {
            transactions: whaleTransactions.sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0)).slice(0, 50),
            lastUpdated: Date.now()
        };

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Whale API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch whale data" },
            { status: 500 }
        );
    }
}
