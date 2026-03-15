import { NextResponse } from "next/server";
import { WhaleWatchData, WhaleTransaction } from "@/types";
import { generateMockWhaleTransactions } from "@/lib/mock-generator";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ETHERSCAN_BASE = "https://api.etherscan.io/api";

// Well-known mega whale / exchange hot wallets on Ethereum
const ETH_WHALE_WALLETS = [
    "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503", // Binance cold 1
    "0xBE0eB53F46Cd790Cd13851D5EFf43D12404d33E8", // Binance cold 2
    "0x28C6c06298d514Db089934071355E5743bf21d60", // Binance hot
    "0x21a31Ee1afC51d94C2EfcCAa2092aD1028285549", // Binance hot 2
    "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d", // Binance 8
    "0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf", // Kraken 1
    "0x2910543Af39abA0Cd09dBb2D50200b3e800A63D2", // Kraken 2
    "0x9696f59E4d72E237BE84fFD425DCaD154Bf96976", // Bitfinex cold
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Bitfinex hot
    "0xA7EFae728D2936e78BDA97dc267687568dD593f3", // OKX cold
    "0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b", // OKX hot
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Vitalik
    "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE", // Binance exchange
];

async function fetchEthWhaleTransactions(minValueUsd: number): Promise<WhaleTransaction[]> {
    if (!ETHERSCAN_API_KEY) return [];

    const ethPrice = await fetchEthPrice();
    if (!ethPrice) return [];

    const minValueEth = minValueUsd / ethPrice;
    const txs: WhaleTransaction[] = [];
    const seen = new Set<string>();

    // Query last 100 txns from each whale wallet, keep those above threshold
    const promises = ETH_WHALE_WALLETS.map(async (wallet) => {
        try {
            const url = `${ETHERSCAN_BASE}?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
            const res = await fetch(url, { next: { revalidate: 60 } });
            const data = await res.json();

            if (data.status !== "1" || !Array.isArray(data.result)) return [];

            const filtered: WhaleTransaction[] = [];
            for (const tx of data.result) {
                if (tx.isError === "1") continue;
                if (!tx.value || tx.value === "0") continue;
                if (seen.has(tx.hash)) continue;

                const valueEth = parseInt(tx.value) / 1e18;
                if (isNaN(valueEth) || valueEth < minValueEth) continue;

                const valueUsd = valueEth * ethPrice;
                seen.add(tx.hash);

                const isBuy = tx.to?.toLowerCase() === wallet.toLowerCase();
                filtered.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to || wallet,
                    value: valueEth,
                    valueUsd,
                    token: "ETH",
                    amount: valueEth,
                    timestamp: parseInt(tx.timeStamp) * 1000,
                    type: isBuy ? "buy" : "sell",
                    network: "ethereum",
                    explorerUrl: `https://etherscan.io/tx/${tx.hash}`,
                    isMock: false,
                });
            }
            return filtered;
        } catch {
            return [];
        }
    });

    const results = await Promise.allSettled(promises);
    for (const r of results) {
        if (r.status === "fulfilled") txs.push(...r.value);
    }

    // Deduplicate by hash
    const unique = Array.from(new Map(txs.map(t => [t.hash, t])).values());
    return unique.sort((a, b) => (b.valueUsd ?? 0) - (a.valueUsd ?? 0));
}

async function fetchEthPrice(): Promise<number | null> {
    try {
        const res = await fetch(
            `${ETHERSCAN_BASE}?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`,
            { next: { revalidate: 300 } }
        );
        const data = await res.json();
        if (data.status === "1" && data.result?.ethusd) {
            return parseFloat(data.result.ethusd);
        }
        return 2600;
    } catch {
        return 2600;
    }
}

function getMockForNetwork(network: string, minValue: number): WhaleTransaction[] {
    return generateMockWhaleTransactions(10, network)
        .filter(tx => (tx.valueUsd ?? 0) >= minValue)
        .map(tx => ({
            ...tx,
            explorerUrl: getAddressExplorerUrl(tx.from, tx.network),
        }));
}

function getAddressExplorerUrl(address: string, network: string): string {
    switch (network.toLowerCase()) {
        case "solana": return `https://solscan.io/account/${address}`;
        case "bitcoin": return `https://blockchair.com/bitcoin/address/${address}`;
        case "base": return `https://basescan.org/address/${address}`;
        case "ethereum":
        default: return `https://etherscan.io/address/${address}`;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const minValue = Number(searchParams.get("minValue")) || 100000;
        const network = searchParams.get("network") || "all";

        let whaleTransactions: WhaleTransaction[] = [];

        // Ethereum: real on-chain data from whale wallets
        if (network === "all" || network === "ethereum") {
            try {
                const ethTxs = await fetchEthWhaleTransactions(minValue);
                whaleTransactions.push(...ethTxs);
            } catch (e) {
                console.warn("ETH whale fetch failed:", e);
            }

            // Fallback if not enough real data
            if (whaleTransactions.filter(t => t.network === "ethereum").length < 3) {
                whaleTransactions.push(...getMockForNetwork("ethereum", minValue));
            }
        }

        // Solana, Bitcoin, Base: curated mock with real known addresses
        const otherNetworks = ["solana", "bitcoin", "base"];
        const filterToChains = network === "all"
            ? otherNetworks
            : otherNetworks.includes(network) ? [network] : [];

        for (const chain of filterToChains) {
            whaleTransactions.push(...getMockForNetwork(chain, minValue));
        }

        // Sort by USD value descending (biggest whales first), then by time
        const sorted = whaleTransactions
            .sort((a, b) => {
                const valueDiff = (b.valueUsd ?? 0) - (a.valueUsd ?? 0);
                if (Math.abs(valueDiff) > 10000) return valueDiff; // Sort big gaps by value
                return (b.timestamp || 0) - (a.timestamp || 0);
            })
            .slice(0, 50);

        const data: WhaleWatchData = {
            transactions: sorted,
            lastUpdated: Date.now(),
        };

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Whale API Critical Error:", error);
        return NextResponse.json({ success: false, error: "Critical feed failure" }, { status: 500 });
    }
}
