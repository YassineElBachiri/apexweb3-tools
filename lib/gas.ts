import { createPublicClient, http, formatGwei, Chain } from 'viem';
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'viem/chains';
import { getRpcUrl, RPC_CONFIG } from './config/rpc';

// --- Types ---
export interface GasPriceData {
    chainId: number | string;
    chainName: string;
    currency: string;
    standard: {
        maxFeePerGas: string; // Gwei (or Lamports/MIST for others)
        maxPriorityFeePerGas: string;
    };
    fast: {
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
    };
    instant: {
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
    };
    baseFee: string;
    lastUpdated: string; // ISO
    tokenPrice?: number;
}

export type SupportedChainId = 1 | 137 | 42161 | 10 | 8453 | "solana" | "sui";

// --- EVM Config ---
const EVM_CHAINS: Record<number, Chain> = {
    1: mainnet,
    137: polygon,
    42161: arbitrum,
    10: optimism,
    8453: base,
};

/**
 * Fetches gas/fee data for any supported chain.
 * Dispatches to specific logic based on chain type.
 */
export async function fetchGasFees(chainId: SupportedChainId): Promise<GasPriceData> {
    if (chainId === "solana") return fetchSolanaFees();
    if (chainId === "sui") return fetchSuiFees();
    return fetchEvmFees(chainId as number);
}

// --- EVM Implementation ---
async function fetchEvmFees(chainId: number): Promise<GasPriceData> {
    const rpcUrl = getRpcUrl(chainId);
    const client = createPublicClient({
        chain: EVM_CHAINS[chainId],
        transport: http(rpcUrl),
    });

    try {
        const block = await client.getBlock();
        const baseFeeWei = block.baseFeePerGas || BigInt(0);
        const fees = await client.estimateFeesPerGas();

        const maxPriorityFeePerGas = fees.maxPriorityFeePerGas || BigInt(0);

        // Multipliers
        const standardPriority = maxPriorityFeePerGas;
        const fastPriority = (standardPriority * 120n) / 100n;
        const instantPriority = (standardPriority * 150n) / 100n;

        const format = (val: bigint) => parseFloat(formatGwei(val)).toFixed(2);

        return {
            chainId,
            chainName: RPC_CONFIG[String(chainId)].chainName,
            currency: RPC_CONFIG[String(chainId)].currency,
            baseFee: format(baseFeeWei),
            standard: {
                maxFeePerGas: format(baseFeeWei + standardPriority),
                maxPriorityFeePerGas: format(standardPriority),
            },
            fast: {
                maxFeePerGas: format(baseFeeWei + fastPriority),
                maxPriorityFeePerGas: format(fastPriority),
            },
            instant: {
                maxFeePerGas: format(baseFeeWei + instantPriority),
                maxPriorityFeePerGas: format(instantPriority),
            },
            lastUpdated: new Date().toISOString(),
        };
    } catch (error) {
        console.error(`Error fetching EVM gas for chain ${chainId}:`, error);
        throw error;
    }
}

// --- Solana Implementation (JSON-RPC) ---
async function fetchSolanaFees(): Promise<GasPriceData> {
    const rpcUrl = getRpcUrl("solana");

    try {
        // Fetch recent priority fees
        // Note: Solana fees are deterministic (5000 lamports per sig) + priority fees for compute units
        // We will fetch `getRecentPrioritizationFees` for a set of writable accounts if possible, or just strict global avg
        // For simplicity in this tool, we will use a baseline.

        const response = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getRecentPrioritizationFees",
                params: [[]] // Global
            })
        });

        const data = await response.json();
        // Calculate average of recent fees
        const fees = data.result as { prioritizationFee: number, slot: number }[];

        // Default base fee is 5000 lamports per signature (micro-lamports? No, just lamports usually)
        // Actually, prioritizatoinFee is in micro-lamports.
        const baseFeeMicroLamports = 0; // The base fee is separate (5000 lamports)

        let avgPriority = 0;
        if (fees.length > 0) {
            // Take last 20
            const recent = fees.sort((a, b) => b.slot - a.slot).slice(0, 20);
            avgPriority = recent.reduce((acc, curr) => acc + curr.prioritizationFee, 0) / recent.length;
        }

        // Convert to "Gwei-like" readable format? Or just display distinct units.
        // Let's normalize display to "Micro-Lamports" since users might expect that for priority.

        // 1 SOL = 10^9 Lamports. 
        // We will return data in Micro-Lamports for display consistency? 
        // Actually, user wants "Estimated cost".

        return {
            chainId: "solana",
            chainName: "Solana",
            currency: "SOL",
            baseFee: "5000 (Lamports)",
            standard: {
                maxFeePerGas: (avgPriority).toFixed(0), // Micro-Lamports
                maxPriorityFeePerGas: (avgPriority).toFixed(0)
            },
            fast: {
                maxFeePerGas: (avgPriority * 1.2).toFixed(0),
                maxPriorityFeePerGas: (avgPriority * 1.2).toFixed(0)
            },
            instant: {
                maxFeePerGas: (avgPriority * 1.5).toFixed(0),
                maxPriorityFeePerGas: (avgPriority * 1.5).toFixed(0)
            },
            lastUpdated: new Date().toISOString()
        };

    } catch (error) {
        console.error("Error fetching Solana fees:", error);
        return {
            chainId: "solana",
            chainName: "Solana",
            currency: "SOL",
            baseFee: "5000",
            standard: { maxFeePerGas: "0", maxPriorityFeePerGas: "0" },
            fast: { maxFeePerGas: "0", maxPriorityFeePerGas: "0" },
            instant: { maxFeePerGas: "0", maxPriorityFeePerGas: "0" },
            lastUpdated: new Date().toISOString()
        };
    }
}

// --- Sui Implementation (JSON-RPC) ---
async function fetchSuiFees(): Promise<GasPriceData> {
    const rpcUrl = getRpcUrl("sui");
    try {
        const response = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "suix_getReferenceGasPrice",
                params: []
            })
        });
        const data = await response.json();
        const price = BigInt(data.result); // MIST

        // Sui gas price is usually stable per epoch
        return {
            chainId: "sui",
            chainName: "Sui",
            currency: "SUI",
            baseFee: price.toString(), // MIST
            standard: { maxFeePerGas: price.toString(), maxPriorityFeePerGas: "0" },
            fast: { maxFeePerGas: price.toString(), maxPriorityFeePerGas: "0" }, // Stable
            instant: { maxFeePerGas: price.toString(), maxPriorityFeePerGas: "0" },
            lastUpdated: new Date().toISOString()
        };

    } catch (error) {
        console.error("Error fetching Sui fees:", error);
        return {
            chainId: "sui",
            chainName: "Sui",
            currency: "SUI",
            baseFee: "1000",
            standard: { maxFeePerGas: "1000", maxPriorityFeePerGas: "0" },
            fast: { maxFeePerGas: "1000", maxPriorityFeePerGas: "0" },
            instant: { maxFeePerGas: "1000", maxPriorityFeePerGas: "0" },
            lastUpdated: new Date().toISOString()
        };
    }
}

// --- Token Price Fetcher (Mock/Simple) ---
export async function fetchNativeTokenPrice(chainId: SupportedChainId): Promise<number> {
    const idMap: Record<string, string> = {
        "1": "ethereum",
        "137": "matic-network",
        "42161": "ethereum",
        "10": "ethereum",
        "8453": "ethereum",
        "solana": "solana",
        "sui": "sui"
    };

    try {
        const id = idMap[String(chainId)] || "ethereum";
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
        const data = await res.json();
        return data[id]?.usd || 0;
    } catch (e) {
        return 0;
    }
}
