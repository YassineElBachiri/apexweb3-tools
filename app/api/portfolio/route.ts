import { NextResponse } from "next/server";
import { fetchEtherBalance } from "@/lib/api/etherscan"; // Use Etherscan
import { PortfolioData } from "@/types";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get("address");

        if (!address) {
            return NextResponse.json(
                { success: false, error: "Address is required" },
                { status: 400 }
            );
        }

        // Fetch ETH Balance
        const ethBalance = await fetchEtherBalance(address);

        // Construct simplified portfolio data (only ETH for now as free tier limit)
        // In a real app with better API (e.g. Moralils/Alchemy/Covalent), we'd get all tokens.
        const holdings = [];
        if (ethBalance !== null && ethBalance > 0) {
            holdings.push({
                token: "ETH",
                name: "Ethereum",
                balance: ethBalance,
                value: 0, // We need price to calc value, let's skip or fetch price if needed. 
                // Frontend might handle price fetching or we can quick-fetch from CoinGecko here?
                // For now, let's leave 0 and let frontend fetch price or we add a quick price check.
                price: 0,
                change24h: 0,
                logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
            });
        }

        const data: PortfolioData = {
            address,
            totalValueUsd: 0, // Calculated by frontend
            holdings,
            lastUpdated: Date.now()
        };

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Portfolio API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch portfolio data" },
            { status: 500 }
        );
    }
}
