import { PortfolioData, PortfolioHolding } from "@/types";

// Simulated fetch function - in a real app, this would call Covalent or Etherscan API
export async function fetchPortfolio(address: string): Promise<PortfolioData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate deterministic-looking data based on address hash (simple simulation)
    const addressSum = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const isRich = addressSum % 2 === 0;

    const holdings: PortfolioHolding[] = [
        {
            token: "ETH",
            name: "Ethereum",
            balance: isRich ? 15.5 : 0.45,
            price: 3500,
            value: (isRich ? 15.5 : 0.45) * 3500,
            change24h: 2.5,
            logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
        },
        {
            token: "USDC",
            name: "USD Coin",
            balance: isRich ? 50000 : 150,
            price: 1,
            value: (isRich ? 50000 : 150) * 1,
            change24h: 0.01,
            logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
        },
        {
            token: "UNI",
            name: "Uniswap",
            balance: isRich ? 250 : 0,
            price: 12,
            value: (isRich ? 250 : 0) * 12,
            change24h: -1.2,
            logo: "https://cryptologos.cc/logos/uniswap-uni-logo.png"
        }
    ].filter(h => h.balance > 0);

    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

    return {
        address,
        totalValueUsd: totalValue,
        holdings,
        lastUpdated: Date.now()
    };
}
