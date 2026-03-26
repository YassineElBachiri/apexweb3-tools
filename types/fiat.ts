// ─── Fiat Converter TypeScript Interfaces ─────────────────────────────────────

export type Region = 'africa' | 'middle-east' | 'asia' | 'europe' | 'americas' | 'oceania';

export interface PPPBenchmarks {
  avg_monthly_salary: number;
  coffee: number;
  fuel_liter: number;
  rent_1br: number;
}

export interface OnRampOption {
  method: string;
  spread_pct: number;
  fee_flat?: number; // optional flat fee in USD
  rating: 'best' | 'good' | 'average' | 'expensive';
}

export interface CountryConfig {
  code: string;       // ISO 3166-1 alpha-2
  name: string;       // Human-readable country name
  currency: string;   // ISO 4217
  flag: string;       // emoji
  region: Region;
  ppp: PPPBenchmarks;
  onRampOptions: OnRampOption[];
}

export interface CurrencyMeta {
  code: string;
  name: string;
  flag: string;
  country: string;
  region: Region;
}

export interface ConversionResult {
  crypto: string;
  amount: number;
  rates: Record<string, number>;           // currencyCode → converted amount
  priceUSD: number;                        // raw price in USD
  change24h: Record<string, number>;       // currencyCode → 24h % change
  sparklines: Record<string, number[]>;    // currencyCode → 7-day price points (USD based)
  updatedAt: number;
}

export interface UserPreferences {
  pinnedCurrencies: string[];   // up to 3 ISO 4217 codes
  homeCurrency: string;
  homeCountry: string;          // ISO 3166-1 alpha-2
  lastCrypto: string;           // CoinGecko ID
  lastAmount: number;
  geoDetectedAt?: number;       // timestamp for 24h cache
}

export interface GeoData {
  country_code: string;
  currency: string;
  country_name: string;
}
