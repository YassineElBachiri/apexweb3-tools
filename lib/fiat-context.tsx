'use client';

/**
 * React context for shared fiat converter state.
 * Handles geolocation, localStorage persistence, and live price fetching.
 */

import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef,
} from 'react';
import type { ConversionResult, UserPreferences, GeoData } from '@/types/fiat';
import { ALL_VS_CURRENCIES } from '@/lib/country-config';

const STORAGE_KEY = 'apexweb3_fiat_prefs';
const GEO_CACHE_KEY = 'apexweb3_geo';
const REFRESH_INTERVAL = 60_000; // 60s

const DEFAULT_PREFS: UserPreferences = {
  pinnedCurrencies: ['USD', 'EUR', 'GBP'],
  homeCurrency: 'USD',
  homeCountry: 'US',
  lastCrypto: 'bitcoin',
  lastAmount: 1,
};

interface FiatContextValue {
  prefs: UserPreferences;
  updatePrefs: (partial: Partial<UserPreferences>) => void;
  togglePin: (currency: string) => void;
  geo: GeoData | null;
  result: ConversionResult | null;
  loading: boolean;
  error: string | null;
  secondsAgo: number;
  refetch: () => void;
  coin: string;
  setCoin: (id: string) => void;
  amount: number;
  setAmount: (n: number) => void;
}

const FiatContext = createContext<FiatContextValue | null>(null);

export function FiatProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [coin, setCoinState] = useState('bitcoin');
  const [amount, setAmountState] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Hydrate from localStorage ──────────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserPreferences;
        setPrefs(parsed);
        setCoinState(parsed.lastCrypto || 'bitcoin');
        setAmountState(parsed.lastAmount || 1);
      }
    } catch {}
    // Geolocation (cached 24h)
    detectGeo();
  }, []);

  async function detectGeo() {
    try {
      const cached = localStorage.getItem(GEO_CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 86_400_000) { // 24h
          applyGeo(data);
          return;
        }
      }
      const res = await fetch('/api/fiat?action=geo');
      if (!res.ok) return;
      const data: GeoData = await res.json();
      localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
      applyGeo(data);
    } catch {}
  }

  function applyGeo(data: GeoData) {
    setGeo(data);
    // Apply geo-detected currency only if user hasn't manually customized their home country
    // We check localStorage for a "userCustomized" flag set when they manually change location
    const isCustomized = (() => { try { return !!localStorage.getItem('apexweb3_geo_customized'); } catch { return false; } })();
    if (!isCustomized) {
      setPrefs(prev => {
        const updated = {
          ...prev,
          homeCountry: data.country_code,
          homeCurrency: data.currency,
          pinnedCurrencies: [
            data.currency,
            ...DEFAULT_PREFS.pinnedCurrencies.filter(c => c !== data.currency),
          ].slice(0, 3),
        };
        persistPrefs(updated);
        return updated;
      });
    }
  }

  function persistPrefs(p: UserPreferences) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  }

  function updatePrefs(partial: Partial<UserPreferences>) {
    setPrefs(prev => {
      const updated = { ...prev, ...partial };
      persistPrefs(updated);
      return updated;
    });
  }

  function togglePin(currency: string) {
    setPrefs(prev => {
      let pins = [...prev.pinnedCurrencies];
      if (pins.includes(currency)) {
        pins = pins.filter(c => c !== currency);
      } else if (pins.length < 3) {
        pins.push(currency);
      } else {
        // Replace last pin
        pins[2] = currency;
      }
      const updated = { ...prev, pinnedCurrencies: pins };
      persistPrefs(updated);
      return updated;
    });
  }

  function setCoin(id: string) {
    setCoinState(id);
    updatePrefs({ lastCrypto: id });
  }

  function setAmount(n: number) {
    setAmountState(n);
    updatePrefs({ lastAmount: n });
  }

  // ── Fetch prices ───────────────────────────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [priceRes, sparkRes] = await Promise.all([
        fetch(`/api/fiat?action=prices&coinId=${coin}&currencies=${ALL_VS_CURRENCIES}`),
        fetch(`/api/fiat?action=sparkline&coinId=${coin}`),
      ]);

      if (!priceRes.ok) throw new Error('Price fetch failed');
      const priceData = await priceRes.json();
      const coinData = priceData[coin] ?? {};

      const rates: Record<string, number> = {};
      const change24h: Record<string, number> = {};

      for (const [key, val] of Object.entries(coinData)) {
        if (key.endsWith('_24h_change')) {
          const code = key.replace('_24h_change', '').toUpperCase();
          change24h[code] = val as number;
        } else {
          rates[key.toUpperCase()] = (val as number) * amount;
        }
      }

      let sparklinePrices: number[] = [];
      if (sparkRes.ok) {
        const sparkData = await sparkRes.json();
        sparklinePrices = sparkData.prices ?? [];
      }

      const sparklines: Record<string, number[]> = {};
      for (const code of Object.keys(rates)) {
        const usdRate = rates['USD'] ? rates['USD'] / amount : 0;
        const localRate = usdRate > 0 ? (rates[code] / amount) / usdRate : 1;
        sparklines[code] = sparklinePrices.map(p => p * localRate);
      }

      setResult({
        crypto: coin,
        amount,
        rates,
        priceUSD: rates['USD'] ? rates['USD'] / amount : 0,
        change24h,
        sparklines,
        updatedAt: Date.now(),
      });
      setSecondsAgo(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fetch error');
    } finally {
      setLoading(false);
    }
  }, [coin, amount]);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchPrices();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchPrices]);

  // Seconds-ago counter
  useEffect(() => {
    const t = setInterval(() => setSecondsAgo(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [result]);

  return (
    <FiatContext.Provider value={{
      prefs, updatePrefs, togglePin,
      geo, result, loading, error, secondsAgo, refetch: fetchPrices,
      coin, setCoin, amount, setAmount,
    }}>
      {children}
    </FiatContext.Provider>
  );
}

export function useFiat() {
  const ctx = useContext(FiatContext);
  if (!ctx) throw new Error('useFiat must be used within FiatProvider');
  return ctx;
}
