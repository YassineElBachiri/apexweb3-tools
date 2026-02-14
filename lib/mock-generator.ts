import { SecurityScanResult, TokenomicsAnalysis, TokenData, SecurityCheck, InvestmentScore } from "@/types";

// Simple seeded random number generator
class SeededRandom {
    private seed: number;

    constructor(seed: string) {
        this.seed = this.hashString(seed);
    }

    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Returns a random number between 0 (inclusive) and 1 (exclusive)
    next(): number {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    // Returns a random integer between min (inclusive) and max (inclusive)
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    // Returns a random boolean with specified probability of being true
    nextBoolean(probability: number = 0.5): boolean {
        return this.next() < probability;
    }

    // Returns a random element from an array
    pick<T>(array: T[]): T {
        return array[this.nextInt(0, array.length - 1)];
    }
}

// Map of known token IDs to ensure correct mock data
const KNOWN_TOKENS: Record<string, { symbol: string; name: string; logo?: string; address?: string }> = {
    // By token ID (most common)
    "bitcoin": { symbol: "BTC", name: "Bitcoin", logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
    "ethereum": { symbol: "ETH", name: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
    "solana": { symbol: "SOL", name: "Solana", logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
    "binancecoin": { symbol: "BNB", name: "BNB", logo: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" },
    "cardano": { symbol: "ADA", name: "Cardano", logo: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
    "ripple": { symbol: "XRP", name: "XRP", logo: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
    "polkadot": { symbol: "DOT", name: "Polkadot", logo: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
    "avalanche-2": { symbol: "AVAX", name: "Avalanche", logo: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png" },
    "matic-network": { symbol: "MATIC", name: "Polygon", logo: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png" },
    "chainlink": { symbol: "LINK", name: "Chainlink", logo: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
    "uniswap": { symbol: "UNI", name: "Uniswap", logo: "https://assets.coingecko.com/coins/images/12504/large/uniswap-logo.png" },
    "aave": { symbol: "AAVE", name: "Aave", logo: "https://assets.coingecko.com/coins/images/12645/large/AAVE.png" },
    "pepe": { symbol: "PEPE", name: "Pepe", logo: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933" },
    "shiba-inu": { symbol: "SHIB", name: "Shiba Inu", logo: "https://assets.coingecko.com/coins/images/11939/large/shiba.png", address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce" },
    "weth": { symbol: "WETH", name: "Wrapped Ether", logo: "https://assets.coingecko.com/coins/images/2518/large/weth.png", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
    "usd-coin": { symbol: "USDC", name: "USD Coin", logo: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
    "tether": { symbol: "USDT", name: "Tether", logo: "https://assets.coingecko.com/coins/images/325/large/Tether.png", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },

    // By Ethereum addresses (for backward compatibility)
    "0x6982508145454ce325ddbe47a25d4ec3d2311933": { symbol: "PEPE", name: "Pepe", logo: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg" },
    "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce": { symbol: "SHIB", name: "Shiba Inu", logo: "https://assets.coingecko.com/coins/images/11939/large/shiba.png" },
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": { symbol: "WETH", name: "Wrapped Ether", logo: "https://assets.coingecko.com/coins/images/2518/large/weth.png" },
};

export function generateTokenData(identifier: string): TokenData {
    const rng = new SeededRandom(identifier);

    // Check if it's a known token (by ID or address)
    const knownToken = KNOWN_TOKENS[identifier] || KNOWN_TOKENS[identifier.toLowerCase()];

    const symbols = ["PEPE", "DOGE", "SHIB", "FLOKI", "BONK", "WIF", "MOG", "TURBO", "LADYS", "COQ"];
    const names = ["Pepe", "Dogecoin", "Shiba Inu", "Floki", "Bonk", "dogwifhat", "Mog Coin", "Turbo", "Milady", "Coq Inu"];

    // Use known data or random selection
    let symbol, name, logo, address;

    if (knownToken) {
        symbol = knownToken.symbol;
        name = knownToken.name;
        logo = knownToken.logo || `https://placehold.co/64?text=${knownToken.symbol}`;
        address = knownToken.address || identifier;
    } else {
        const idx = rng.nextInt(0, symbols.length - 1);
        symbol = symbols[idx];
        name = names[idx];
        logo = `https://placehold.co/64?text=${symbol}`;
        address = identifier;
    }

    // Generate deterministic random values
    const price = rng.next() * 10 + 0.01; // $0.01 - $10
    const marketCap = price * (rng.next() * 1000000000 + 10000000); // 10M - 1B
    const totalSupply = marketCap / price;
    const circulatingSupply = totalSupply * (rng.next() * 0.4 + 0.6); // 60-100% of total

    return {
        address,
        symbol,
        name,
        logo,
        price,
        marketCap,
        totalSupply,
        circulatingSupply,
        fdv: price * totalSupply,
        priceChange24h: (rng.next() - 0.5) * 20, // -10% to +10%
    };
}

export function generateTokenomicsData(identifier: string): TokenomicsAnalysis {
    const tokenData = generateTokenData(identifier);
    const rng = new SeededRandom(identifier);

    const inflationRatio = tokenData.totalSupply > 0
        ? ((tokenData.totalSupply - tokenData.circulatingSupply) / tokenData.circulatingSupply) * 100
        : 0;

    const inflationRisk = Math.min(100, Math.max(0, inflationRatio));
    const sustainabilityScore = Math.max(0, 100 - (inflationRisk / 2));

    let riskLevel: "low" | "medium" | "high" = "low";
    if (inflationRatio > 100) riskLevel = "high";
    else if (inflationRatio > 50) riskLevel = "medium";

    // Generate price history (last 7 days)
    const priceHistory: Array<{ timestamp: number; price: number }> = [];
    const now = Date.now();
    const basePrice = tokenData.price;
    for (let i = 6; i >= 0; i--) {
        const dayPrice = basePrice * (1 + (rng.next() - 0.5) * 0.2); // ±10% variation
        priceHistory.push({
            timestamp: now - (i * 24 * 60 * 60 * 1000),
            price: dayPrice
        });
    }

    // Calculate price changes
    const priceChange7d = (rng.next() - 0.5) * 60; // -30% to +30%
    const priceChange30d = (rng.next() - 0.5) * 100; // -50% to +50%

    // ATH/ATL
    const athMultiplier = 1 + rng.next() * 5; // 1x to 6x current price
    const atlMultiplier = 0.1 + rng.next() * 0.5; // 0.1x to 0.6x current price
    const allTimeHigh = tokenData.price * athMultiplier;
    const allTimeLow = tokenData.price * atlMultiplier;
    const athChangePercentage = ((tokenData.price - allTimeHigh) / allTimeHigh) * 100;
    const atlChangePercentage = ((tokenData.price - allTimeLow) / allTimeLow) * 100;

    // Volume & Liquidity
    const volume24h = tokenData.marketCap * (0.01 + rng.next() * 0.5); // 1-50% of mcap
    const volumeChange24h = (rng.next() - 0.5) * 80; // -40% to +40%
    const liquidityScore = rng.nextInt(40, 95);

    // Holder Distribution
    const topHoldersConcentration = 10 + rng.next() * 60; // 10-70%
    const holderCount = rng.nextInt(1000, 500000);

    // Advanced Metrics
    const burnRate = rng.next() * 5; // 0-5% per year
    const stakingAPY = rng.nextBoolean(0.3) ? 5 + rng.next() * 20 : undefined; // 5-25% or none

    return {
        token: tokenData,
        supplyDistribution: {
            circulating: tokenData.circulatingSupply,
            locked: Math.max(0, tokenData.totalSupply - tokenData.circulatingSupply),
            unvested: 0,
        },
        inflationRisk: inflationRisk,
        sustainabilityScore: sustainabilityScore,
        riskLevel: riskLevel,
        fdvToMarketCapRatio: tokenData.fdv > 0 && tokenData.marketCap > 0 ? tokenData.fdv / tokenData.marketCap : 1,
        investmentScore: {
            marketCapMaturity: tokenData.marketCap > 1000000000 ? 20 : tokenData.marketCap > 100000000 ? 15 : 10,
            tokenomicsHealth: Math.round(sustainabilityScore / 4),
            volatilityScore: rng.nextInt(10, 20),
            pricePerformance: rng.nextInt(10, 20),
            trendMomentum: rng.nextInt(5, 10),
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
        topHoldersConcentration,
        holderCount,
        burnRate,
        stakingAPY,
        priceHistory
    };
}

export function generateSecurityData(address: string): SecurityScanResult {
    const rng = new SeededRandom(address);

    const contractVerified = rng.nextBoolean(0.7);
    const noHoneypot = rng.nextBoolean(0.9);
    const ownershipOk = rng.nextBoolean(0.5);
    const liquidityOk = rng.nextBoolean(0.6);
    const noHiddenOwner = rng.nextBoolean(0.8);
    const noCooldown = rng.nextBoolean(0.7);

    const checks: SecurityCheck[] = [
        {
            name: "Contract Verified",
            passed: contractVerified,
            riskLevel: contractVerified ? "low" : "high",
            description: contractVerified ? "Contract source code is verified on Etherscan" : "Source code not verified"
        },
        {
            name: "Honeypot Check",
            passed: noHoneypot,
            riskLevel: noHoneypot ? "low" : "high",
            description: noHoneypot ? "No honeypot behavior detected" : "Potential honeypot detected"
        },
        {
            name: "Ownership Renounced",
            passed: ownershipOk,
            riskLevel: ownershipOk ? "low" : "medium",
            description: ownershipOk ? "Ownership has been renounced" : "Owner can modify contract"
        },
        {
            name: "Liquidity Locked",
            passed: liquidityOk,
            riskLevel: liquidityOk ? "low" : "high",
            description: liquidityOk ? "Liquidity is locked" : "Liquidity pool not locked"
        },
        {
            name: "Hidden Owner",
            passed: noHiddenOwner,
            riskLevel: noHiddenOwner ? "low" : "high",
            description: noHiddenOwner ? "No hidden owner found" : "Potential hidden owner detected"
        },
        {
            name: "Trading Cooldown",
            passed: noCooldown,
            riskLevel: noCooldown ? "low" : "medium",
            description: noCooldown ? "No restrictive cooldown" : "Trading cooldown present"
        }
    ];

    const passCount = checks.filter(c => c.passed).length;
    const totalScore = Math.round((passCount / checks.length) * 100);

    let overallRisk: "low" | "medium" | "high" = "low";
    if (totalScore < 50) overallRisk = "high";
    else if (totalScore < 75) overallRisk = "medium";

    return {
        address,
        overallRisk,
        checks,
        contractVerified,
        isHoneypot: !noHoneypot,
        ownershipRenounced: ownershipOk,
        liquidityLocked: liquidityOk,
        lastScanned: Date.now(),
    };
}
