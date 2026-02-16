export interface RpcConfig {
    chainId: number | string; // String for non-EVM like 'solana'
    chainName: string;
    currency: string;
    primary: string;
    fallback?: string;
    paidEnvKey?: string; // Key for process.env that holds the paid URL
}

export const RPC_CONFIG: Record<string, RpcConfig> = {
    // --- EVM Chains ---
    "1": {
        chainId: 1,
        chainName: "Ethereum Mainnet",
        currency: "ETH",
        primary: "https://eth.llamarpc.com",
        fallback: "https://rpc.ankr.com/eth",
        paidEnvKey: "ETH_RPC_URL"
    },
    "137": {
        chainId: 137,
        chainName: "Polygon PoS",
        currency: "POL",
        primary: "https://polygon-rpc.com",
        fallback: "https://rpc.ankr.com/polygon",
        paidEnvKey: "POLYGON_RPC_URL"
    },
    "42161": {
        chainId: 42161,
        chainName: "Arbitrum One",
        currency: "ETH",
        primary: "https://arb1.arbitrum.io/rpc",
        fallback: "https://rpc.ankr.com/arbitrum",
        paidEnvKey: "ARBITRUM_RPC_URL"
    },
    "10": {
        chainId: 10,
        chainName: "Optimism",
        currency: "ETH",
        primary: "https://mainnet.optimism.io",
        fallback: "https://rpc.ankr.com/optimism",
        paidEnvKey: "OPTIMISM_RPC_URL"
    },
    "8453": {
        chainId: 8453,
        chainName: "Base",
        currency: "ETH",
        primary: "https://mainnet.base.org",
        fallback: "https://1rpc.io/base",
        paidEnvKey: "BASE_RPC_URL"
    },

    // --- Non-EVM Chains ---
    "solana": {
        chainId: "solana",
        chainName: "Solana",
        currency: "SOL",
        primary: "https://api.mainnet-beta.solana.com",
        fallback: "https://solana-rpc.publicnode.com",
        paidEnvKey: "SOLANA_RPC_URL"
    },
    "sui": {
        chainId: "sui",
        chainName: "Sui",
        currency: "SUI",
        primary: "https://fullnode.mainnet.sui.io:443",
        fallback: "https://sui-rpc.publicnode.com",
        paidEnvKey: "SUI_RPC_URL"
    }
};

/**
 * Returns the best available RPC URL for a given chain ID.
 * Priority: Env Var (Paid) > Primary Public > Fallback Public
 */
export function getRpcUrl(chainId: string | number): string {
    const config = RPC_CONFIG[String(chainId)];
    if (!config) throw new Error(`Unsupported chain ID: ${chainId}`);

    // Check for Paid RPC in Env
    if (config.paidEnvKey && process.env[config.paidEnvKey]) {
        return process.env[config.paidEnvKey] as string;
    }

    // Return Primary
    return config.primary;
}

/**
 * Returns the fallback RPC URL if available
 */
export function getFallbackRpcUrl(chainId: string | number): string | undefined {
    return RPC_CONFIG[String(chainId)]?.fallback;
}
