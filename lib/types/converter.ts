export interface ConversionResult {
    fromAmount: number;
    toAmount: number;
    exchangeRate: number;
    fromCurrency: string;
    toCurrency: string;
    timestamp: string;
}

export interface FeeBreakdown {
    exchangeName: string;
    exchangeFeePct: number;
    exchangeFeeUsd: number;
    networkFeeUsd: number;
    totalFeeUsd: number;
    grossAmount: number; // The amount before fees
    netAmount: number; // The amount after fees are deducted
}

export interface BasketItem {
    id: string; // unique internal id for list rendering
    coinId: string; // coingecko id
    amount: number;
    usdValue?: number; // Fetched and calculated live
}

export interface HistoricalResult {
    date: string; // Selected historical date
    historicalPriceFrom: number; // the price of fromCoin on that date
    historicalPriceTo: number; // the price of toCoin on that date
    currentPriceFrom: number; // their prices today
    currentPriceTo: number;
    
    amountConverted: number; // How many fromCoins were converted
    coinsReceivedThen: number; // The amount of toCoins received ON THAT DATE
    
    valueUsdThen: number; // USD value of the position ON THAT DATE
    valueUsdToday: number; // USD value of those same `coinsReceivedThen` TODAY
    
    deltaUsd: number;
    deltaPct: number;
}
