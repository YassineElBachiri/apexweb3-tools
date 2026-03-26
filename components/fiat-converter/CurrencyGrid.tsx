'use client';

/**
 * CurrencyGrid — Tier 2 regional grid for all non-pinned currencies.
 * Groups by region with collapsible sections. Each cell shows flag, code, amount, 24h change chip.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, Pin } from 'lucide-react';
import { useFiat } from '@/lib/fiat-context';
import { ALL_CURRENCIES, REGION_LABELS, REGION_ORDER } from '@/lib/country-config';
import type { Region } from '@/types/fiat';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCompact(n: number, code: string): string {
  if (!n || isNaN(n)) return '—';
  if (n >= 1_000_000) {
    return new Intl.NumberFormat('en', { style: 'currency', currency: code, maximumFractionDigits: 1 }).format(n / 1_000_000) + 'M';
  }
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: n >= 100 ? 0 : n >= 1 ? 2 : 4,
    minimumFractionDigits: 0,
  }).format(n);
}

// ─── Currency Cell ─────────────────────────────────────────────────────────────

function CurrencyCell({ code }: { code: string }) {
  const { result, prefs, togglePin } = useFiat();
  const meta = ALL_CURRENCIES.find(c => c.code === code);
  if (!meta) return null;

  const amount = result?.rates[code] ?? null;
  const change = result?.change24h[code] ?? null;
  const isPinned = prefs.pinnedCurrencies.includes(code);
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-3 py-3 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-150">
      {/* Flag + code */}
      <span className="text-xl flex-shrink-0">{meta.flag}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-zinc-500 truncate">{code}</div>
        <div className="text-sm font-semibold text-zinc-100">
          {amount !== null ? formatCompact(amount, code) : <span className="text-zinc-600">—</span>}
        </div>
      </div>

      {/* 24h change chip */}
      {change !== null && (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
          isPositive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
        }`}>
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </span>
      )}

      {/* Pin button — appears on hover */}
      <button
        onClick={() => togglePin(code)}
        title={isPinned ? 'Unpin' : 'Pin to top'}
        className={`opacity-0 group-hover:opacity-100 transition-opacity ml-1 ${
          isPinned ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'
        }`}
      >
        <Pin size={12} />
      </button>
    </div>
  );
}

// ─── Region Section ────────────────────────────────────────────────────────────

function RegionSection({ region }: { region: Region }) {
  const [open, setOpen] = useState(true);
  const { prefs } = useFiat();
  const pinned = prefs.pinnedCurrencies;

  // Only show non-pinned currencies of this region
  const currencies = ALL_CURRENCIES
    .filter(c => c.region === region && !pinned.includes(c.code))
    .map(c => c.code);

  if (currencies.length === 0) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors w-full text-left"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {REGION_LABELS[region]}
        <span className="ml-auto text-xs text-zinc-600">{currencies.length}</span>
      </button>

      {open && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {currencies.map(code => (
            <CurrencyCell key={code} code={code} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Currency Grid ─────────────────────────────────────────────────────────────

interface CurrencyGridProps {
  className?: string;
}

export function CurrencyGrid({ className = '' }: CurrencyGridProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {REGION_ORDER.map(region => (
        <RegionSection key={region} region={region} />
      ))}
    </div>
  );
}
