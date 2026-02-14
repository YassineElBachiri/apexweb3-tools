import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export interface CoinSearchResult {
    id: string;
    symbol: string;
    name: string;
    platforms?: {
        ethereum?: string;
    };
}

// Cache for popular ERC-20 tokens on Ethereum
const POPULAR_COINS = [
    { id: "ethereum", symbol: "ETH", name: "Ethereum", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
    { id: "uniswap", symbol: "UNI", name: "Uniswap", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" },
    { id: "chainlink", symbol: "LINK", name: "Chainlink", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA" },
    { id: "aave", symbol: "AAVE", name: "Aave", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" },
    { id: "maker", symbol: "MKR", name: "Maker", address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2" },
    { id: "compound-governance-token", symbol: "COMP", name: "Compound", address: "0xc00e94Cb662C3520282E6f5717214004A7f26888" },
    { id: "the-graph", symbol: "GRT", name: "The Graph", address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7" },
    { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE" },
    { id: "usd-coin", symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
    { id: "tether", symbol: "USDT", name: "Tether USD", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
    { id: "pepe", symbol: "PEPE", name: "Pepe", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933" },
    { id: "floki", symbol: "FLOKI", name: "Floki", address: "0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E" },
    { id: "render-token", symbol: "RNDR", name: "Render", address: "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24" },
    { id: "fetch-ai", symbol: "FET", name: "Fetch.ai", address: "0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85" },
    { id: "weth", symbol: "WETH", name: "Wrapped Ether", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
];

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.toLowerCase() || "";

        if (!query || query.length < 2) {
            return NextResponse.json<ApiResponse<CoinSearchResult[]>>({
                success: true,
                data: POPULAR_COINS.slice(0, 5),
                timestamp: Date.now(),
            });
        }

        // Search in popular coins first
        const results = POPULAR_COINS.filter(
            (coin) =>
                coin.name.toLowerCase().includes(query) ||
                coin.symbol.toLowerCase().includes(query) ||
                coin.id.toLowerCase().includes(query)
        );

        // Try fetching from CoinGecko API
        try {
            const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
            const options = COINGECKO_API_KEY ? {
                headers: {
                    'x-cg-demo-api-key': COINGECKO_API_KEY
                }
            } : undefined;

            const response = await fetch(
                `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
                options
            );

            if (response.ok) {
                const data = await response.json();
                if (data.coins && Array.isArray(data.coins)) {
                    // Note: CoinGecko search API doesn't return contract addresses
                    // We'll only use API results to enhance local matches, not replace them
                    const apiCoinIds = new Set(data.coins.map((c: any) => c.id));

                    // Merge with popular coins that match, avoiding duplicates
                    const combined = [
                        ...results, // Local matches first (they have addresses)
                    ].slice(0, 10);

                    return NextResponse.json<ApiResponse<CoinSearchResult[]>>({
                        success: true,
                        data: combined,
                        timestamp: Date.now(),
                    });
                }
            }
        } catch (error) {
            console.error("CoinGecko search error:", error);
            // Fallback to local results if API fails
        }

        // Return local results (all have valid addresses)
        return NextResponse.json<ApiResponse<CoinSearchResult[]>>({
            success: true,
            data: results.slice(0, 10),
            timestamp: Date.now(),
        });

        return NextResponse.json<ApiResponse<CoinSearchResult[]>>({
            success: true,
            data: results.slice(0, 10),
            cached: true,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: "Internal server error",
            timestamp: Date.now(),
        }, { status: 500 });
    }
}
