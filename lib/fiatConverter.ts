import { fetchCoinPrice } from './api/coingecko';
import { getForexRate } from './forex';

export interface FiatConversionResult {
    cryptoAmount: number;
    cryptoSymbol: string;
    fiatAmount: number;
    fiatCurrency: string;
    cryptoPrice: number;
    forexRate: number;
    timestamp: number;
}

export interface MultiFiatResult {
    currency: string;
    amount: number;
}

export async function convertCryptoToFiat(
    cryptoSymbol: string,
    fiatCurrency: string,
    amount: number
): Promise<FiatConversionResult> {

    // Get crypto price in USD
    const cryptoPriceUSD = await fetchCoinPrice(cryptoSymbol);

    if (!cryptoPriceUSD) {
        throw new Error('Failed to fetch crypto price');
    }

    // Get forex rate (USD to target fiat)
    const forexRate = await getForexRate('USD', fiatCurrency);

    // Calculate fiat value
    const usdValue = amount * cryptoPriceUSD;
    const fiatValue = usdValue * forexRate;

    return {
        cryptoAmount: amount,
        cryptoSymbol,
        fiatAmount: fiatValue,
        fiatCurrency,
        cryptoPrice: cryptoPriceUSD,
        forexRate,
        timestamp: Date.now()
    };
}

export async function getMultiFiatConversion(
    cryptoSymbol: string,
    amount: number
): Promise<MultiFiatResult[]> {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'KRW'];

    const conversions = await Promise.all(
        currencies.map(async (fiat) => {
            try {
                const result = await convertCryptoToFiat(cryptoSymbol, fiat, amount);
                return { currency: fiat, amount: result.fiatAmount };
            } catch (e) {
                console.error(`Failed to convert to ${fiat}`, e);
                return { currency: fiat, amount: 0 };
            }
        })
    );

    return conversions;
}
