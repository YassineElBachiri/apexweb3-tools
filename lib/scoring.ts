import { TokenData, InvestmentScore } from "@/types";

/**
 * Calculate Market Cap Maturity Score (max 25)
 * Higher market cap = higher score (stability)
 */
function calculateMarketCapScore(marketCap: number): number {
    if (marketCap > 100_000_000_000) return 25; // > $100B (Mega Cap)
    if (marketCap > 10_000_000_000) return 22;  // > $10B (Large Cap)
    if (marketCap > 1_000_000_000) return 18;   // > $1B (Mid Cap)
    if (marketCap > 100_000_000) return 12;     // > $100M (Small Cap)
    if (marketCap > 10_000_000) return 6;       // > $10M (Micro Cap)
    return 2;                                   // < $10M (Nano Cap)
}

/**
 * Calculate Tokenomics Health Score (max 25)
 * Based on inflation risk and supply distribution
 */
function calculateTokenomicsScore(inflationRisk: number, fdvToMcap: number): number {
    let score = 25;

    // Penalize for high inflation risk
    if (inflationRisk > 200) score -= 15;
    else if (inflationRisk > 100) score -= 10;
    else if (inflationRisk > 50) score -= 5;

    // Penalize for high FDV/Mcap ratio (dilution overhang)
    if (fdvToMcap > 10) score -= 10;
    else if (fdvToMcap > 5) score -= 5;
    else if (fdvToMcap > 2) score -= 2;

    return Math.max(0, score);
}

/**
 * Calculate Volatility Score (max 20)
 * Lower volatility = higher score (for this stability-focused model)
 * NOTE: Since we don't have real 30d vol data in mock, we simulate based on market cap inverse
 */
function calculateVolatilityScore(marketCap: number): number {
    // Assumption: Larger caps are less volatile
    if (marketCap > 10_000_000_000) return 20;
    if (marketCap > 1_000_000_000) return 16;
    if (marketCap > 100_000_000) return 12;
    return 8;
}

/**
 * Calculate Price Performance Score (max 20)
 * Based on 24h change and distance from ATH (simulated)
 */
function calculatePerformanceScore(priceChange24h: number): number {
    let score = 10; // Start middle

    // Reward positive short term momentum but penalize extreme pumps (FOMO risk)
    if (priceChange24h > 50) score = 5;      // Too hot
    else if (priceChange24h > 20) score = 15; // Strong
    else if (priceChange24h > 0) score = 18;  // Steady
    else if (priceChange24h > -10) score = 12; // Correction
    else score = 6;                           // Dumping

    return Math.min(20, Math.max(0, score));
}

/**
 * Calculate Trend/Momentum Score (max 10)
 * Simple momentum indicator
 */
function calculateTrendScore(priceChange24h: number): number {
    if (priceChange24h > 10) return 10;
    if (priceChange24h > 0) return 7;
    if (priceChange24h > -5) return 4;
    return 2;
}

/**
 * Determine Investment Verdict based on Total Score
 */
function getVerdict(score: number): InvestmentScore['verdict'] {
    if (score >= 75) return 'Strong Hold';
    if (score >= 55) return 'Speculative';
    if (score >= 40) return 'High Risk';
    return 'Overvalued';
}

/**
 * Main function to calculate complete Investment Score
 */
export function calculateInvestmentScore(
    token: TokenData,
    inflationRisk: number,
    fdvToMarketCapRatio: number
): InvestmentScore {
    const marketCapMaturity = calculateMarketCapScore(token.marketCap);
    const tokenomicsHealth = calculateTokenomicsScore(inflationRisk, fdvToMarketCapRatio);
    const volatilityScore = calculateVolatilityScore(token.marketCap);
    const pricePerformance = calculatePerformanceScore(token.priceChange24h);
    const trendMomentum = calculateTrendScore(token.priceChange24h);

    const totalScore = marketCapMaturity + tokenomicsHealth + volatilityScore + pricePerformance + trendMomentum;

    return {
        marketCapMaturity,
        tokenomicsHealth,
        volatilityScore,
        pricePerformance,
        trendMomentum,
        totalScore,
        verdict: getVerdict(totalScore)
    };
}

/**
 * Format currency with appropriate precision
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value < 0.01 ? 6 : 2,
        maximumFractionDigits: value < 0.01 ? 6 : 2,
    }).format(value);
}

/**
 * Calculate volatility level label
 */
export function calculateVolatilityLevel(token: TokenData): "Low" | "Medium" | "High" {
    // Simplified simulation based on market cap instead of real vol
    // In real app, we would use stddev of price history
    if (token.marketCap > 10_000_000_000) return "Low";
    if (token.marketCap > 100_000_000) return "Medium";
    return "High";
}
