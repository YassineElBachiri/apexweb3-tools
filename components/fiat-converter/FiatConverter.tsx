'use client';

/**
 * FiatConverter — Main orchestrator component.
 * Handles mode toggle (Convert / How long to afford it?),
 * coin input, amount, and wires all sub-panels.
 */

import { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Settings } from 'lucide-react';
import { FiatProvider, useFiat } from '@/lib/fiat-context';
import { HeroCards } from './HeroCards';
import { CurrencyGrid } from './CurrencyGrid';
import { PurchasingPowerPanel } from './PurchasingPowerPanel';
import { OnRampPanel } from './OnRampPanel';
import { SalaryCalculator } from './SalaryCalculator';
import { CurrencySearch } from './CurrencySearch';
import { POPULAR_COINS } from '@/lib/constants';

// ─── Mode toggle ─────────────────────────────────────────────────────────────

type Mode = 'convert' | 'salary';

function ModeToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 p-1">
      {(['convert', 'salary'] as Mode[]).map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === m
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {m === 'convert' ? '⇄ Convert' : '⏱ How long to afford it?'}
        </button>
      ))}
    </div>
  );
}

// ─── Coin selector (searchable) ───────────────────────────────────────────────

function CoinSelector() {
  const { coin, setCoin } = useFiat();
  const current = POPULAR_COINS.find(c => c.id === coin);

  return (
    <select
      value={coin}
      onChange={e => setCoin(e.target.value)}
      className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-3 py-3 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 transition-all cursor-pointer"
    >
      {POPULAR_COINS.map(c => (
        <option key={c.id} value={c.id}>
          {c.name} ({c.symbol.toUpperCase()})
        </option>
      ))}
    </select>
  );
}

// ─── Amount input ─────────────────────────────────────────────────────────────

function AmountInput() {
  const { amount, setAmount } = useFiat();
  return (
    <input
      type="number"
      min={0}
      step="any"
      value={amount || ''}
      onChange={e => setAmount(parseFloat(e.target.value) || 0)}
      placeholder="Amount"
      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-lg font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 transition-all"
    />
  );
}

// ─── Status bar ───────────────────────────────────────────────────────────────

function StatusBar() {
  const { loading, error, secondsAgo, refetch, geo, prefs, updatePrefs } = useFiat();
  const [showGeoPicker, setShowGeoPicker] = useState(false);

  return (
    <div className="flex items-center justify-between text-xs text-zinc-500">
      <div className="flex items-center gap-2">
        {loading ? (
          <span className="flex items-center gap-1 text-emerald-500">
            <RefreshCw size={11} className="animate-spin" /> Updating…
          </span>
        ) : error ? (
          <span className="text-amber-500 flex items-center gap-1">
            ⚠ Stale — last updated {secondsAgo}s ago
          </span>
        ) : (
          <span>Updated {secondsAgo}s ago</span>
        )}
        <button
          onClick={refetch}
          className="hover:text-zinc-300 transition-colors"
          title="Refresh now"
        >
          <RefreshCw size={11} />
        </button>
      </div>

      {/* Geo override */}
      {geo && (
        <button
          onClick={() => setShowGeoPicker(true)}
          className="flex items-center gap-1 hover:text-zinc-300 transition-colors"
        >
          <MapPin size={11} />
          Not in {geo.country_name}? Change location
        </button>
      )}
    </div>
  );
}

// ─── Inner component (inside FiatProvider) ────────────────────────────────────

function FiatConverterInner() {
  const [mode, setMode] = useState<Mode>('convert');
  const [showCurrencySearch, setShowCurrencySearch] = useState(false);
  const { prefs, geo } = useFiat();

  return (
    <div className="space-y-6">
      {/* Geo banner (first load) */}
      {geo && (
        <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 border border-zinc-800 px-4 py-3">
          <span className="text-sm text-zinc-400">
            🌍 Showing prices in{' '}
            <span className="font-semibold text-zinc-100">{geo.country_name}</span>
            {' '}— your home currency is{' '}
            <span className="text-emerald-400 font-semibold">{prefs.homeCurrency}</span>
          </span>
          <button
            onClick={() => setShowCurrencySearch(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <Settings size={12} />
            Manage currencies
          </button>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex justify-center">
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      {/* Convert mode */}
      {mode === 'convert' && (
        <div className="space-y-6">
          {/* Inputs */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-500 mb-2">Amount</label>
                <AmountInput />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2">Cryptocurrency</label>
                <CoinSelector />
              </div>
            </div>

            <StatusBar />
          </div>

          {/* Hero cards (pinned) */}
          <HeroCards />

          {/* PPP panel */}
          <PurchasingPowerPanel />

          {/* On-ramp panel */}
          <OnRampPanel />

          {/* Regional grid */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-300">All Currencies</h3>
              <button
                onClick={() => setShowCurrencySearch(true)}
                className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                📌 Manage pins
              </button>
            </div>
            <CurrencyGrid />
          </div>
        </div>
      )}

      {/* Salary / reverse mode */}
      {mode === 'salary' && (
        <div className="space-y-6">
          {/* Still show coin selector + amount for target reference */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div className="text-sm font-semibold text-zinc-300 mb-1">Target goal</div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-500 mb-2">Amount</label>
                <AmountInput />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2">Cryptocurrency</label>
                <CoinSelector />
              </div>
            </div>
            <StatusBar />
          </div>

          <SalaryCalculator />
        </div>
      )}

      {/* Currency search modal */}
      {showCurrencySearch && (
        <CurrencySearch onClose={() => setShowCurrencySearch(false)} />
      )}
    </div>
  );
}

// ─── Exported component (wraps in provider) ───────────────────────────────────

export function FiatConverter() {
  return (
    <FiatProvider>
      <FiatConverterInner />
    </FiatProvider>
  );
}
