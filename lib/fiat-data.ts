/**
 * Static PPP benchmarks and on-ramp spread configs.
 * Sources: World Bank, Numbeo public data (2024).
 * These are approximate national averages — actual costs vary by city.
 */

import { PPPBenchmarks, OnRampOption } from '@/types/fiat';

// ─── PPP Benchmarks per country (ISO 3166-1 alpha-2) ─────────────────────────

export const PPP_DATA: Record<string, { currency: string } & PPPBenchmarks> = {
  MA: { currency: 'MAD', avg_monthly_salary: 4200,  coffee: 18,   fuel_liter: 14,  rent_1br: 3500  },
  NG: { currency: 'NGN', avg_monthly_salary: 120000, coffee: 1500, fuel_liter: 617, rent_1br: 95000 },
  BR: { currency: 'BRL', avg_monthly_salary: 3200,  coffee: 8,    fuel_liter: 6,   rent_1br: 1800  },
  ID: { currency: 'IDR', avg_monthly_salary: 4800000, coffee: 25000, fuel_liter: 10000, rent_1br: 4000000 },
  IN: { currency: 'INR', avg_monthly_salary: 25000, coffee: 120,  fuel_liter: 103, rent_1br: 15000 },
  TR: { currency: 'TRY', avg_monthly_salary: 30000, coffee: 80,   fuel_liter: 55,  rent_1br: 20000 },
  AR: { currency: 'ARS', avg_monthly_salary: 600000, coffee: 2000, fuel_liter: 1400, rent_1br: 350000 },
  EG: { currency: 'EGP', avg_monthly_salary: 7000,  coffee: 60,   fuel_liter: 14,  rent_1br: 6000  },
  KE: { currency: 'KES', avg_monthly_salary: 45000, coffee: 350,  fuel_liter: 215, rent_1br: 35000 },
  GH: { currency: 'GHS', avg_monthly_salary: 2300,  coffee: 35,   fuel_liter: 14,  rent_1br: 1800  },
  VN: { currency: 'VND', avg_monthly_salary: 8500000, coffee: 50000, fuel_liter: 24000, rent_1br: 6000000 },
  PH: { currency: 'PHP', avg_monthly_salary: 18000, coffee: 150,  fuel_liter: 65,  rent_1br: 12000 },
  PK: { currency: 'PKR', avg_monthly_salary: 55000, coffee: 450,  fuel_liter: 298, rent_1br: 40000 },
  ZA: { currency: 'ZAR', avg_monthly_salary: 25000, coffee: 45,   fuel_liter: 24,  rent_1br: 12000 },
  MX: { currency: 'MXN', avg_monthly_salary: 13000, coffee: 60,   fuel_liter: 23,  rent_1br: 9000  },
  CO: { currency: 'COP', avg_monthly_salary: 2000000, coffee: 3500, fuel_liter: 10500, rent_1br: 1200000 },
  TH: { currency: 'THB', avg_monthly_salary: 20000, coffee: 70,   fuel_liter: 43,  rent_1br: 12000 },
  MY: { currency: 'MYR', avg_monthly_salary: 3500,  coffee: 12,   fuel_liter: 2,   rent_1br: 1200  },
  BD: { currency: 'BDT', avg_monthly_salary: 25000, coffee: 140,  fuel_liter: 110, rent_1br: 15000 },
  ET: { currency: 'ETB', avg_monthly_salary: 5000,  coffee: 70,   fuel_liter: 72,  rent_1br: 4000  },
  SD: { currency: 'SDG', avg_monthly_salary: 90000, coffee: 1500, fuel_liter: 2500, rent_1br: 70000 },
  TZ: { currency: 'TZS', avg_monthly_salary: 700000, coffee: 5000, fuel_liter: 2800, rent_1br: 500000 },
  UG: { currency: 'UGX', avg_monthly_salary: 700000, coffee: 4000, fuel_liter: 4500, rent_1br: 600000 },
  DZ: { currency: 'DZD', avg_monthly_salary: 45000, coffee: 200,  fuel_liter: 42,  rent_1br: 35000 },
  TN: { currency: 'TND', avg_monthly_salary: 1100,  coffee: 5,    fuel_liter: 2,   rent_1br: 800   },
  SA: { currency: 'SAR', avg_monthly_salary: 7500,  coffee: 20,   fuel_liter: 2,   rent_1br: 3500  },
  AE: { currency: 'AED', avg_monthly_salary: 12000, coffee: 25,   fuel_liter: 3,   rent_1br: 6000  },
  QA: { currency: 'QAR', avg_monthly_salary: 15000, coffee: 30,   fuel_liter: 3,   rent_1br: 8000  },
  KW: { currency: 'KWD', avg_monthly_salary: 900,   coffee: 2,    fuel_liter: 0.1, rent_1br: 350   },
  IQ: { currency: 'IQD', avg_monthly_salary: 700000, coffee: 2500, fuel_liter: 750, rent_1br: 300000 },
  UA: { currency: 'UAH', avg_monthly_salary: 18000, coffee: 80,   fuel_liter: 60,  rent_1br: 12000 },
  RU: { currency: 'RUB', avg_monthly_salary: 70000, coffee: 200,  fuel_liter: 62,  rent_1br: 40000 },
  PL: { currency: 'PLN', avg_monthly_salary: 7000,  coffee: 15,   fuel_liter: 7,   rent_1br: 4000  },
  RO: { currency: 'RON', avg_monthly_salary: 4500,  coffee: 12,   fuel_liter: 8,   rent_1br: 2500  },
  HU: { currency: 'HUF', avg_monthly_salary: 600000, coffee: 1400, fuel_liter: 660, rent_1br: 300000 },
  CZ: { currency: 'CZK', avg_monthly_salary: 50000, coffee: 90,   fuel_liter: 42,  rent_1br: 20000 },
  JP: { currency: 'JPY', avg_monthly_salary: 280000, coffee: 500, fuel_liter: 175, rent_1br: 80000 },
  KR: { currency: 'KRW', avg_monthly_salary: 3200000, coffee: 5000, fuel_liter: 1700, rent_1br: 900000 },
  CN: { currency: 'CNY', avg_monthly_salary: 8000,  coffee: 30,   fuel_liter: 8,   rent_1br: 4000  },
  TW: { currency: 'TWD', avg_monthly_salary: 45000, coffee: 120,  fuel_liter: 35,  rent_1br: 18000 },
  HK: { currency: 'HKD', avg_monthly_salary: 18000, coffee: 60,   fuel_liter: 22,  rent_1br: 12000 },
  SG: { currency: 'SGD', avg_monthly_salary: 5000,  coffee: 7,    fuel_liter: 3,   rent_1br: 2800  },
  AU: { currency: 'AUD', avg_monthly_salary: 6500,  coffee: 5,    fuel_liter: 2,   rent_1br: 2200  },
  NZ: { currency: 'NZD', avg_monthly_salary: 5500,  coffee: 6,    fuel_liter: 3,   rent_1br: 2500  },
  US: { currency: 'USD', avg_monthly_salary: 5800,  coffee: 6,    fuel_liter: 1,   rent_1br: 1900  },
  CA: { currency: 'CAD', avg_monthly_salary: 5000,  coffee: 5,    fuel_liter: 2,   rent_1br: 2000  },
  GB: { currency: 'GBP', avg_monthly_salary: 3200,  coffee: 4,    fuel_liter: 2,   rent_1br: 1800  },
  DE: { currency: 'EUR', avg_monthly_salary: 4200,  coffee: 3,    fuel_liter: 2,   rent_1br: 1300  },
  FR: { currency: 'EUR', avg_monthly_salary: 3600,  coffee: 3,    fuel_liter: 2,   rent_1br: 1100  },
};

// ─── On-Ramp Spreads per country ──────────────────────────────────────────────
// spread_pct is the percentage above market rate charged by the method

const DEFAULT_ONRAMP: OnRampOption[] = [
  { method: 'Binance P2P',    spread_pct: 1.7,  rating: 'best'      },
  { method: 'Coinbase',       spread_pct: 3.5,  rating: 'average'   },
  { method: 'Local Broker',   spread_pct: 10.0, rating: 'expensive' },
  { method: 'Bank Transfer',  spread_pct: 2.1,  rating: 'good'      },
];

export const ONRAMP_CONFIG: Record<string, OnRampOption[]> = {
  NG: [
    { method: 'Binance P2P',    spread_pct: 2.2,  rating: 'best'      },
    { method: 'Bybit P2P',      spread_pct: 2.5,  rating: 'good'      },
    { method: 'Local Broker',   spread_pct: 12.0, rating: 'expensive' },
    { method: 'Bank Transfer',  spread_pct: 5.0,  rating: 'average'   },
  ],
  MA: [
    { method: 'Binance P2P',    spread_pct: 1.8,  rating: 'best'      },
    { method: 'Local Exchange', spread_pct: 4.0,  rating: 'average'   },
    { method: 'Local Broker',   spread_pct: 9.0,  rating: 'expensive' },
    { method: 'Bank Transfer',  spread_pct: 2.5,  rating: 'good'      },
  ],
  BR: [
    { method: 'Binance P2P',    spread_pct: 1.5,  rating: 'best'      },
    { method: 'Mercado Bitcoin', spread_pct: 2.8, rating: 'good'      },
    { method: 'Coinbase',        spread_pct: 3.5, rating: 'average'   },
    { method: 'Bank Transfer',  spread_pct: 2.1,  rating: 'good'      },
  ],
  IN: [
    { method: 'CoinDCX',        spread_pct: 1.2,  rating: 'best'      },
    { method: 'WazirX',         spread_pct: 1.5,  rating: 'good'      },
    { method: 'Coinbase',       spread_pct: 3.5,  rating: 'average'   },
    { method: 'Bank Transfer',  spread_pct: 2.0,  rating: 'good'      },
  ],
  ID: [
    { method: 'Indodax',        spread_pct: 1.5,  rating: 'best'      },
    { method: 'Binance P2P',    spread_pct: 2.0,  rating: 'good'      },
    { method: 'Tokocrypto',     spread_pct: 2.5,  rating: 'good'      },
    { method: 'Bank Transfer',  spread_pct: 3.0,  rating: 'average'   },
  ],
  TR: [
    { method: 'Binance TR',     spread_pct: 1.0,  rating: 'best'      },
    { method: 'BtcTurk',        spread_pct: 1.5,  rating: 'good'      },
    { method: 'Paribu',         spread_pct: 2.0,  rating: 'good'      },
    { method: 'Bank Transfer',  spread_pct: 2.5,  rating: 'average'   },
  ],
  AR: [
    { method: 'Binance P2P',    spread_pct: 2.0,  rating: 'best'      },
    { method: 'Ripio',          spread_pct: 3.5,  rating: 'average'   },
    { method: 'Local Broker',   spread_pct: 15.0, rating: 'expensive' },
    { method: 'Blue Dollar',    spread_pct: 5.0,  rating: 'average'   },
  ],
  EG: [
    { method: 'Binance P2P',    spread_pct: 2.5,  rating: 'best'      },
    { method: 'Local Exchange', spread_pct: 5.0,  rating: 'average'   },
    { method: 'Local Broker',   spread_pct: 11.0, rating: 'expensive' },
    { method: 'Bank Transfer',  spread_pct: 3.5,  rating: 'good'      },
  ],
  KE: [
    { method: 'Binance P2P',    spread_pct: 2.0,  rating: 'best'      },
    { method: 'Paxful',         spread_pct: 3.0,  rating: 'good'      },
    { method: 'Local Broker',   spread_pct: 10.0, rating: 'expensive' },
    { method: 'M-Pesa Crypto',  spread_pct: 2.8,  rating: 'good'      },
  ],
  GH: [
    { method: 'Binance P2P',    spread_pct: 2.5,  rating: 'best'      },
    { method: 'Paxful',         spread_pct: 3.5,  rating: 'average'   },
    { method: 'Local Broker',   spread_pct: 12.0, rating: 'expensive' },
    { method: 'Bank Transfer',  spread_pct: 4.0,  rating: 'average'   },
  ],
  VN: [
    { method: 'Binance P2P',    spread_pct: 1.5,  rating: 'best'      },
    { method: 'Remitano',        spread_pct: 2.5, rating: 'good'      },
    { method: 'Local Broker',   spread_pct: 8.0,  rating: 'expensive' },
    { method: 'Bank Transfer',  spread_pct: 2.0,  rating: 'good'      },
  ],
  PH: [
    { method: 'Coins.ph',       spread_pct: 1.8,  rating: 'best'      },
    { method: 'Binance P2P',    spread_pct: 2.0,  rating: 'good'      },
    { method: 'PDAX',           spread_pct: 2.5,  rating: 'good'      },
    { method: 'Bank Transfer',  spread_pct: 3.0,  rating: 'average'   },
  ],
  PK: [
    { method: 'Binance P2P',    spread_pct: 2.5,  rating: 'best'      },
    { method: 'Local Exchange', spread_pct: 5.0,  rating: 'average'   },
    { method: 'Local Broker',   spread_pct: 12.0, rating: 'expensive' },
    { method: 'Bank Transfer',  spread_pct: 4.0,  rating: 'average'   },
  ],
  // Default fallback for all other countries
  _default: DEFAULT_ONRAMP,
};

export function getOnRampOptions(countryCode: string): OnRampOption[] {
  return ONRAMP_CONFIG[countryCode] ?? ONRAMP_CONFIG['_default'];
}

export function getPPPData(countryCode: string) {
  return PPP_DATA[countryCode] ?? null;
}
