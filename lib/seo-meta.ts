import { Metadata } from 'next';
import { capitalize } from './seo-params';
import { ALL_CURRENCIES } from './country-config';

const SITE_NAME = 'ApexWeb3';

// ─── Calculator ───────────────────────────────────────────────────────────────

export function getCalculatorMetadata(coin?: string): Metadata {
  const cName = coin ? capitalize(coin) : 'Crypto';
  return {
    title: `${cName} Average Cost Calculator — Track Your Entry Price | ${SITE_NAME}`,
    description: `Calculate your average buy price for ${cName} across multiple purchases. Track DCA performance, break-even price, and P&L in real time.`,
    alternates: {
      canonical: coin ? `/finance/calculator?coin=${coin}` : '/finance/calculator',
    },
    openGraph: {
      title: `${cName} Average Cost Calculator`,
      description: `Track your ${cName} entry price and DCA performance`,
      images: [`/api/og/calculator?coin=${coin || 'crypto'}`],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

// ─── Converter ────────────────────────────────────────────────────────────────

export async function getConverterMetadata(from: string, to: string): Promise<Metadata> {
  const cFrom = capitalize(from);
  const cTo = capitalize(to);
  
  return {
    title: `${cFrom} to ${cTo} Converter — Live Rate | ${SITE_NAME}`,
    description: `Convert ${cFrom} to ${cTo} instantly. Real-time rate, fee breakdown, historical chart, and exchange comparison.`,
    alternates: {
      canonical: `/finance/converter/${from}/${to}`,
    },
    openGraph: {
      title: `${cFrom} to ${cTo} Converter`,
      description: `Live ${cFrom} to ${cTo} exchange rate`,
      images: [`/api/og/converter?from=${from}&to=${to}`],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

// ─── Fiat Exchange ────────────────────────────────────────────────────────────

export async function getFiatMetadata(crypto: string, countryStr: string): Promise<Metadata> {
  const cCrypto = capitalize(crypto);
  const cCountry = capitalize(countryStr);
  
  // Find the currency code for this country
  const countryConfig = ALL_CURRENCIES.find(c => c.country.toLowerCase() === countryStr.toLowerCase());
  const currencyCode = countryConfig?.code || 'USD';

  return {
    title: `${cCrypto} Price in ${cCountry} (${currencyCode}) — Today's Rate | ${SITE_NAME}`,
    description: `How much is 1 ${cCrypto} worth in ${countryConfig?.name || cCountry} today? Live ${cCrypto}/${currencyCode} rate, purchasing power context, and cheapest way to buy ${cCrypto} in ${cCountry}.`,
    alternates: {
      canonical: `/finance/fiat-converter/${crypto}/${countryStr}`,
    },
    openGraph: {
      title: `${cCrypto} Price in ${cCountry} (${currencyCode})`,
      description: `Live ${cCrypto} price in ${cCountry}`,
      images: [`/api/og/fiat?crypto=${crypto}&country=${countryStr}`],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
