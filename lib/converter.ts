import { fetchCoinPrice } from './api/coingecko';

export interface ConversionResult {
    fromAmount: number;
    toAmount: number;
    exchangeRate: number;
    fromCurrency: string;
    toCurrency: string;
    timestamp: string;
}

export interface ConversionPair {
    currency: string;
    amount: Promise<ConversionResult>;
}

export async function convertCrypto(
    fromCurrency: string,
    toCurrency: string,
    amount: number
): Promise<ConversionResult> {
    // Fetch both currency prices in USD
    const fromPriceUSD = await fetchCoinPrice(fromCurrency);
    const toPriceUSD = await fetchCoinPrice(toCurrency);

    if (!fromPriceUSD || !toPriceUSD) {
        throw new Error('Failed to fetch price for one or both currencies');
    }

    // Calculate exchange rate
    const exchangeRate = fromPriceUSD / toPriceUSD;

    // Convert amount
    const convertedAmount = amount * exchangeRate;

    return {
        fromAmount: amount,
        toAmount: convertedAmount,
        exchangeRate,
        fromCurrency,
        toCurrency,
        timestamp: new Date().toISOString()
    };
}
