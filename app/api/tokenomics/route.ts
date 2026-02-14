import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, TokenomicsAnalysis } from "@/types";
import { generateTokenomicsData } from "@/lib/mock-generator";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tokenId = searchParams.get("tokenId");

        if (!tokenId) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                error: "TokenId parameter is required",
                timestamp: Date.now(),
            }, { status: 400 });
        }

        const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

        if (useMockData) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Generate mock data using token ID as seed
            const mockData = generateTokenomicsData(tokenId);

            return NextResponse.json<ApiResponse<TokenomicsAnalysis>>({
                success: true,
                data: mockData,
                cached: true,
                timestamp: Date.now(),
            });
        }

        // Fetch from CoinGecko API by token ID (works for all chains)
        try {
            const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
            const options = COINGECKO_API_KEY ? {
                headers: {
                    'x-cg-demo-api-key': COINGECKO_API_KEY
                }
            } : undefined;

            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
                options
            );

            if (response.ok) {
                const data = await response.json();

                // Extract market data
                const marketData = data.market_data;
                const price = marketData.current_price?.usd || 0;
                const totalSupply = marketData.total_supply || 0;
                const circulatingSupply = marketData.circulating_supply || 0;
                const marketCap = marketData.market_cap?.usd || 0;
                const fdv = marketData.fully_diluted_valuation?.usd || (price * totalSupply);

                // Calculate metrics
                const inflationRatio = circulatingSupply > 0
                    ? ((totalSupply - circulatingSupply) / circulatingSupply) * 100
                    : 0;

                const inflationRisk = Math.min(100, Math.max(0, inflationRatio));
                const sustainabilityScore = Math.max(0, 100 - (inflationRisk / 2));

                let riskLevel: "low" | "medium" | "high" = "low";
                if (inflationRatio > 100) riskLevel = "high";
                else if (inflationRatio > 50) riskLevel = "medium";

                // Get contract address if available (for display purposes)
                let contractAddress = tokenId;
                if (data.platforms) {
                    // Try to get Ethereum address first, fallback to any other platform
                    contractAddress = data.platforms.ethereum ||
                        data.platforms['binance-smart-chain'] ||
                        data.platforms.polygon ||
                        data.platforms.solana ||
                        Object.values(data.platforms)[0] ||
                        tokenId;
                }

                // Extract new data fields
                const priceChange7d = marketData.price_change_percentage_7d_in_currency?.usd;
                const priceChange30d = marketData.price_change_percentage_30d_in_currency?.usd;
                const allTimeHigh = marketData.ath?.usd;
                const allTimeLow = marketData.atl?.usd;
                const athChangePercentage = marketData.ath_change_percentage?.usd;
                const atlChangePercentage = marketData.atl_change_percentage?.usd;
                const volume24h = marketData.total_volume?.usd;
                const volumeChange24h = marketData.volume_change_percentage_24h;

                // Calculate liquidity score (simple heuristic based on volume/mcap ratio)
                const volumeToMcapRatio = volume24h && marketCap ? (volume24h / marketCap) * 100 : 0;
                const liquidityScore = Math.min(100, Math.max(0, volumeToMcapRatio * 200)); // 0.5% ratio = 100 score

                const realData: TokenomicsAnalysis = {
                    token: {
                        address: contractAddress as string,
                        symbol: data.symbol?.toUpperCase() || '',
                        name: data.name || '',
                        logo: data.image?.large || '',
                        price: price,
                        marketCap: marketCap,
                        totalSupply: totalSupply,
                        circulatingSupply: circulatingSupply,
                        fdv: fdv,
                        priceChange24h: marketData.price_change_percentage_24h || 0,
                    },
                    supplyDistribution: {
                        circulating: circulatingSupply,
                        locked: Math.max(0, totalSupply - circulatingSupply),
                        unvested: 0,
                    },
                    inflationRisk: inflationRisk,
                    sustainabilityScore: sustainabilityScore,
                    riskLevel: riskLevel,
                    fdvToMarketCapRatio: fdv > 0 && marketCap > 0 ? fdv / marketCap : 1,
                    investmentScore: {
                        marketCapMaturity: marketCap > 1000000000 ? 20 : marketCap > 100000000 ? 15 : 10,
                        tokenomicsHealth: Math.round(sustainabilityScore / 4),
                        volatilityScore: Math.abs(marketData.price_change_percentage_24h || 0) > 10 ? 10 : 15,
                        pricePerformance: priceChange7d && priceChange7d > 0 ? 15 : 10,
                        trendMomentum: priceChange7d && priceChange30d && priceChange7d > priceChange30d ? 8 : 5,
                        totalScore: Math.round(sustainabilityScore),
                        verdict: riskLevel === 'low' ? 'Strong Hold' : riskLevel === 'medium' ? 'Speculative' : 'High Risk'
                    },
                    // New fields
                    priceChange7d,
                    priceChange30d,
                    allTimeHigh,
                    allTimeLow,
                    athChangePercentage,
                    atlChangePercentage,
                    volume24h,
                    volumeChange24h,
                    liquidityScore,
                    // Note: CoinGecko doesn't provide holder data in basic endpoint
                    // These would require additional API calls or different data sources
                };

                return NextResponse.json<ApiResponse<TokenomicsAnalysis>>({
                    success: true,
                    data: realData,
                    timestamp: Date.now(),
                });
            }
        } catch (error) {
            console.error("CoinGecko API error:", error);
            // Fall through to mock data
        }

        // Fallback to mock data if API fails or returns error
        const mockData = generateTokenomicsData(tokenId);
        return NextResponse.json<ApiResponse<TokenomicsAnalysis>>({
            success: true,
            data: mockData,
            timestamp: Date.now(),
        });

    } catch (error) {
        console.error("Tokenomics route error:", error);
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: "Internal server error",
            timestamp: Date.now(),
        }, { status: 500 });
    }
}
