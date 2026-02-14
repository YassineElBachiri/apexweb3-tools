// Token and Portfolio Types
export interface TokenData {
    address: string;
    symbol: string;
    name: string;
    logo?: string;
    price: number;
    marketCap: number;
    totalSupply: number;
    circulatingSupply: number;
    fdv: number;
    priceChange24h: number;
    // Extra fields needed for full compatibility
    id?: string;
    image?: string;
    current_price?: number;
    market_cap?: number;
    market_cap_rank?: number;
    total_volume?: number;
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
    ath?: number;
    atl?: number;
}

export interface PortfolioAsset {
    id: string;
    token: TokenData;
    entryPrice: number;
    investedAmount?: number;
    entryDate?: string;
}

export interface TokenSearchResult {
    id: string;
    symbol: string;
    name: string;
    thumb: string;
}

export interface TokenHolding {
    token: string; // Symbol or ID
    name: string;
    balance: number;
    value: number; // USD Value
    price: number;
    change24h: number;
    logo?: string;
    // Compatibility fields
    valueUsd?: number;
}

// Alias for compatibility
export type PortfolioHolding = TokenHolding;

export interface PortfolioData {
    address: string;
    totalValueUsd: number;
    holdings: PortfolioHolding[];
    lastUpdated: number;
}

// Tokenomics Analysis Types
export interface TokenomicsAnalysis {
    token: TokenData;
    inflationRisk: number; // 0-100
    sustainabilityScore: number; // 0-100
    riskLevel: "low" | "medium" | "high";
    fdvToMarketCapRatio: number;
    supplyDistribution: {
        circulating: number;
        locked: number;
        unvested: number;
    };
    investmentScore?: InvestmentScore;

    // Price Performance
    priceChange7d?: number;
    priceChange30d?: number;
    allTimeHigh?: number;
    allTimeLow?: number;
    athChangePercentage?: number;
    atlChangePercentage?: number;

    // Volume & Liquidity
    volume24h?: number;
    volumeChange24h?: number;
    liquidityScore?: number; // 0-100

    // Holder Distribution
    topHoldersConcentration?: number; // % held by top 10 holders
    holderCount?: number;

    // Advanced Metrics
    burnRate?: number; // % burned per year
    stakingAPY?: number; // Annual staking yield
    priceHistory?: Array<{ timestamp: number; price: number }>; // Last 7 days
}

export interface InvestmentScore {
    marketCapMaturity: number; // 0-25
    tokenomicsHealth: number;  // 0-25
    volatilityScore: number;   // 0-20
    pricePerformance: number;  // 0-20
    trendMomentum: number;     // 0-10
    totalScore: number;        // 0-100
    verdict: 'Strong Hold' | 'Speculative' | 'High Risk' | 'Overvalued';
}

// Security Scan Types
export interface SecurityCheck {
    name: string;
    passed: boolean;
    riskLevel: "low" | "medium" | "high";
    description: string;
    details?: string;
}

export interface SecurityScanResult {
    address: string;
    overallRisk: "low" | "medium" | "high";
    checks: SecurityCheck[];
    isHoneypot: boolean;
    ownershipRenounced: boolean;
    contractVerified: boolean;
    liquidityLocked: boolean;
    lastScanned: number;
}

// Whale Watch Types
export interface WhaleTransaction {
    hash: string;
    from: string;
    to: string;
    value: number; // Amount of tokens
    valueUsd?: number; // USD Value
    token: string; // Symbol
    amount: number;
    timestamp: number;
    walletLabel?: string;
    type: "buy" | "sell" | "transfer";
}

export interface WhaleWatchData {
    transactions: WhaleTransaction[];
    lastUpdated?: number;
    filters?: {
        minValue: number;
        tokenAddress?: string;
    };
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    cached?: boolean;
    timestamp?: number;
}

// Search Types
export type SearchInputType = "wallet" | "token" | "unknown";

export interface SearchResult {
    type: SearchInputType;
    value: string;
    isValid: boolean;
    route?: string;
}

// Risk Calculation Types
export interface RiskMetrics {
    inflationRiskRatio: number;
    dilutionRisk: "low" | "medium" | "high";
    fdvMcapRatio: number;
    liquidityScore: number;
}
