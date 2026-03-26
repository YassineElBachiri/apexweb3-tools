/**
 * Full country configuration: currency metadata, region grouping, PPP + on-ramp data.
 * Covers 60+ currencies grouped by region.
 */

import { CountryConfig, Region } from '@/types/fiat';
import { PPP_DATA, ONRAMP_CONFIG } from './fiat-data';

// ─── Currency metadata (code, name, flag, country, region) ───────────────────

export const ALL_CURRENCIES: {
  code: string;
  name: string;
  flag: string;
  country: string;
  region: Region;
}[] = [
  // Africa
  { code: 'NGN', name: 'Nigerian Naira',      flag: '🇳🇬', country: 'Nigeria',       region: 'africa' },
  { code: 'ZAR', name: 'South African Rand',  flag: '🇿🇦', country: 'South Africa',  region: 'africa' },
  { code: 'KES', name: 'Kenyan Shilling',      flag: '🇰🇪', country: 'Kenya',         region: 'africa' },
  { code: 'GHS', name: 'Ghanaian Cedi',        flag: '🇬🇭', country: 'Ghana',         region: 'africa' },
  { code: 'EGP', name: 'Egyptian Pound',       flag: '🇪🇬', country: 'Egypt',         region: 'africa' },
  { code: 'MAD', name: 'Moroccan Dirham',      flag: '🇲🇦', country: 'Morocco',       region: 'africa' },
  { code: 'DZD', name: 'Algerian Dinar',       flag: '🇩🇿', country: 'Algeria',       region: 'africa' },
  { code: 'TND', name: 'Tunisian Dinar',       flag: '🇹🇳', country: 'Tunisia',       region: 'africa' },
  { code: 'ETB', name: 'Ethiopian Birr',       flag: '🇪🇹', country: 'Ethiopia',      region: 'africa' },
  { code: 'TZS', name: 'Tanzanian Shilling',   flag: '🇹🇿', country: 'Tanzania',      region: 'africa' },
  { code: 'UGX', name: 'Ugandan Shilling',     flag: '🇺🇬', country: 'Uganda',        region: 'africa' },

  // Middle East
  { code: 'SAR', name: 'Saudi Riyal',          flag: '🇸🇦', country: 'Saudi Arabia',  region: 'middle-east' },
  { code: 'AED', name: 'UAE Dirham',           flag: '🇦🇪', country: 'UAE',           region: 'middle-east' },
  { code: 'QAR', name: 'Qatari Riyal',         flag: '🇶🇦', country: 'Qatar',         region: 'middle-east' },
  { code: 'KWD', name: 'Kuwaiti Dinar',        flag: '🇰🇼', country: 'Kuwait',        region: 'middle-east' },
  { code: 'IQD', name: 'Iraqi Dinar',          flag: '🇮🇶', country: 'Iraq',          region: 'middle-east' },
  { code: 'ILS', name: 'Israeli Shekel',       flag: '🇮🇱', country: 'Israel',        region: 'middle-east' },
  { code: 'JOD', name: 'Jordanian Dinar',      flag: '🇯🇴', country: 'Jordan',        region: 'middle-east' },

  // Asia
  { code: 'INR', name: 'Indian Rupee',         flag: '🇮🇳', country: 'India',         region: 'asia' },
  { code: 'IDR', name: 'Indonesian Rupiah',    flag: '🇮🇩', country: 'Indonesia',     region: 'asia' },
  { code: 'VND', name: 'Vietnamese Dong',      flag: '🇻🇳', country: 'Vietnam',       region: 'asia' },
  { code: 'PHP', name: 'Philippine Peso',      flag: '🇵🇭', country: 'Philippines',   region: 'asia' },
  { code: 'PKR', name: 'Pakistani Rupee',      flag: '🇵🇰', country: 'Pakistan',      region: 'asia' },
  { code: 'BDT', name: 'Bangladeshi Taka',     flag: '🇧🇩', country: 'Bangladesh',    region: 'asia' },
  { code: 'THB', name: 'Thai Baht',            flag: '🇹🇭', country: 'Thailand',      region: 'asia' },
  { code: 'MYR', name: 'Malaysian Ringgit',    flag: '🇲🇾', country: 'Malaysia',      region: 'asia' },
  { code: 'JPY', name: 'Japanese Yen',         flag: '🇯🇵', country: 'Japan',         region: 'asia' },
  { code: 'KRW', name: 'South Korean Won',     flag: '🇰🇷', country: 'South Korea',   region: 'asia' },
  { code: 'CNY', name: 'Chinese Yuan',         flag: '🇨🇳', country: 'China',         region: 'asia' },
  { code: 'TWD', name: 'Taiwan Dollar',        flag: '🇹🇼', country: 'Taiwan',        region: 'asia' },
  { code: 'HKD', name: 'Hong Kong Dollar',     flag: '🇭🇰', country: 'Hong Kong',     region: 'asia' },
  { code: 'SGD', name: 'Singapore Dollar',     flag: '🇸🇬', country: 'Singapore',     region: 'asia' },

  // Europe
  { code: 'EUR', name: 'Euro',                 flag: '🇪🇺', country: 'Eurozone',      region: 'europe' },
  { code: 'GBP', name: 'British Pound',        flag: '🇬🇧', country: 'UK',            region: 'europe' },
  { code: 'CHF', name: 'Swiss Franc',          flag: '🇨🇭', country: 'Switzerland',   region: 'europe' },
  { code: 'SEK', name: 'Swedish Krona',        flag: '🇸🇪', country: 'Sweden',        region: 'europe' },
  { code: 'NOK', name: 'Norwegian Krone',      flag: '🇳🇴', country: 'Norway',        region: 'europe' },
  { code: 'DKK', name: 'Danish Krone',         flag: '🇩🇰', country: 'Denmark',       region: 'europe' },
  { code: 'PLN', name: 'Polish Złoty',         flag: '🇵🇱', country: 'Poland',        region: 'europe' },
  { code: 'CZK', name: 'Czech Koruna',         flag: '🇨🇿', country: 'Czech Republic', region: 'europe' },
  { code: 'HUF', name: 'Hungarian Forint',     flag: '🇭🇺', country: 'Hungary',       region: 'europe' },
  { code: 'RON', name: 'Romanian Leu',         flag: '🇷🇴', country: 'Romania',       region: 'europe' },
  { code: 'UAH', name: 'Ukrainian Hryvnia',    flag: '🇺🇦', country: 'Ukraine',       region: 'europe' },
  { code: 'RUB', name: 'Russian Ruble',        flag: '🇷🇺', country: 'Russia',        region: 'europe' },
  { code: 'TRY', name: 'Turkish Lira',         flag: '🇹🇷', country: 'Turkey',        region: 'europe' },

  // Americas
  { code: 'USD', name: 'US Dollar',            flag: '🇺🇸', country: 'USA',           region: 'americas' },
  { code: 'CAD', name: 'Canadian Dollar',      flag: '🇨🇦', country: 'Canada',        region: 'americas' },
  { code: 'MXN', name: 'Mexican Peso',         flag: '🇲🇽', country: 'Mexico',        region: 'americas' },
  { code: 'BRL', name: 'Brazilian Real',       flag: '🇧🇷', country: 'Brazil',        region: 'americas' },
  { code: 'ARS', name: 'Argentine Peso',       flag: '🇦🇷', country: 'Argentina',     region: 'americas' },
  { code: 'COP', name: 'Colombian Peso',       flag: '🇨🇴', country: 'Colombia',      region: 'americas' },
  { code: 'CLP', name: 'Chilean Peso',         flag: '🇨🇱', country: 'Chile',         region: 'americas' },
  { code: 'PEN', name: 'Peruvian Sol',         flag: '🇵🇪', country: 'Peru',          region: 'americas' },

  // Oceania
  { code: 'AUD', name: 'Australian Dollar',    flag: '🇦🇺', country: 'Australia',     region: 'oceania' },
  { code: 'NZD', name: 'New Zealand Dollar',   flag: '🇳🇿', country: 'New Zealand',   region: 'oceania' },
];

// ─── Currency code → country code mapping (for PPP + on-ramp lookup) ─────────

export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  NGN: 'NG', ZAR: 'ZA', KES: 'KE', GHS: 'GH', EGP: 'EG', MAD: 'MA',
  DZD: 'DZ', TND: 'TN', ETB: 'ET', TZS: 'TZ', UGX: 'UG',
  SAR: 'SA', AED: 'AE', QAR: 'QA', KWD: 'KW', IQD: 'IQ',
  INR: 'IN', IDR: 'ID', VND: 'VN', PHP: 'PH', PKR: 'PK', BDT: 'BD',
  THB: 'TH', MYR: 'MY', JPY: 'JP', KRW: 'KR', CNY: 'CN', TWD: 'TW',
  HKD: 'HK', SGD: 'SG', EUR: 'DE', GBP: 'GB', CHF: 'CH', SEK: 'SE',
  NOK: 'NO', DKK: 'DK', PLN: 'PL', CZK: 'CZ', HUF: 'HU', RON: 'RO',
  UAH: 'UA', RUB: 'RU', TRY: 'TR', USD: 'US', CAD: 'CA', MXN: 'MX',
  BRL: 'BR', ARS: 'AR', COP: 'CO', AUD: 'AU', NZD: 'NZ',
};

// ─── Regional display labels ──────────────────────────────────────────────────

export const REGION_LABELS: Record<Region, string> = {
  'africa':      '🌍 Africa',
  'middle-east': '🕌 Middle East',
  'asia':        '🌏 Asia & Pacific',
  'europe':      '🌍 Europe',
  'americas':    '🌎 Americas',
  'oceania':     '🏝️ Oceania',
};

export const REGION_ORDER: Region[] = [
  'africa', 'middle-east', 'asia', 'europe', 'americas', 'oceania',
];

// Build CountryConfig from composed sources
export function buildCountryConfigs(): CountryConfig[] {
  return ALL_CURRENCIES.map(cur => {
    const countryCode = CURRENCY_TO_COUNTRY[cur.code] || 'US';
    const pppEntry = PPP_DATA[countryCode];
    const onRampOptions = ONRAMP_CONFIG[countryCode] ?? ONRAMP_CONFIG['_default'];

    return {
      code: countryCode,
      name: cur.country,
      currency: cur.code,
      flag: cur.flag,
      region: cur.region,
      ppp: pppEntry
        ? {
            avg_monthly_salary: pppEntry.avg_monthly_salary,
            coffee: pppEntry.coffee,
            fuel_liter: pppEntry.fuel_liter,
            rent_1br: pppEntry.rent_1br,
          }
        : { avg_monthly_salary: 0, coffee: 0, fuel_liter: 0, rent_1br: 0 },
      onRampOptions,
    };
  });
}

export const COUNTRY_CONFIGS: CountryConfig[] = buildCountryConfigs();

// Quick lookup by currency code
export function getCountryConfigByCurrency(currency: string): CountryConfig | null {
  return COUNTRY_CONFIGS.find(c => c.currency === currency) ?? null;
}

// Quick lookup by country code
export function getCountryConfigByCode(code: string): CountryConfig | null {
  return COUNTRY_CONFIGS.find(c => c.code === code) ?? null;
}

// All currencies in a region
export function getCurrenciesByRegion(region: Region) {
  return ALL_CURRENCIES.filter(c => c.region === region);
}

// The list of all CoinGecko-supported vs_currencies for the multi-fiat price call
export const ALL_VS_CURRENCIES = ALL_CURRENCIES.map(c => c.code.toLowerCase()).join(',');
