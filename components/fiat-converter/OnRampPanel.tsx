'use client';

/**
 * OnRampPanel — Collapsible table comparing on-ramp methods for the user's country.
 * Shows spread, effective price, total cost, and a "best method" highlight.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useFiat } from '@/lib/fiat-context';
import { getOnRampOptions } from '@/lib/fiat-data';
import { getCountryConfigByCurrency } from '@/lib/country-config';

function formatCurrency(n: number, code: string): string {
  if (!n || isNaN(n)) return '—';
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(n);
}

const RATING_COLORS: Record<string, string> = {
  best:      'bg-green-900/50 text-green-300 border-green-800',
  good:      'bg-blue-900/40 text-blue-300 border-blue-800',
  average:   'bg-zinc-800 text-zinc-300 border-zinc-700',
  expensive: 'bg-red-900/40 text-red-300 border-red-800',
};

const RATING_LABELS: Record<string, string> = {
  best:      '⭐ Best',
  good:      'Good',
  average:   'Average',
  expensive: 'Expensive',
};

interface OnRampPanelProps {
  className?: string;
}

export function OnRampPanel({ className = '' }: OnRampPanelProps) {
  const [open, setOpen] = useState(false);
  const { prefs, result } = useFiat();

  const homeCurrency = prefs.homeCurrency;
  const countryConfig = getCountryConfigByCurrency(homeCurrency);
  const countryCode = countryConfig?.code ?? prefs.homeCountry;
  const options = getOnRampOptions(countryCode);

  if (!result) return null;
  const baseLocalAmount = result.rates[homeCurrency] ?? 0;
  if (baseLocalAmount === 0) return null;

  // Calculate effective cost for each method
  const rows = options.map(opt => ({
    ...opt,
    effectivePrice: baseLocalAmount * (1 + opt.spread_pct / 100),
    totalCost: baseLocalAmount * (1 + opt.spread_pct / 100),
  }));

  // Best = lowest total cost
  const bestTotal = Math.min(...rows.map(r => r.totalCost));
  const worstTotal = Math.max(...rows.map(r => r.totalCost));
  const bestMethod = rows.find(r => r.totalCost === bestTotal);
  const worstMethod = rows.find(r => r.totalCost === worstTotal);
  const savings = worstTotal - bestTotal;

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden ${className}`}>
      {/* Collapsed trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-5 py-4 text-left hover:bg-zinc-900/40 transition-colors"
      >
        {open ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
        <div className="flex-1">
          <span className="text-sm font-semibold text-zinc-200">What it costs to actually buy this</span>
          <span className="block text-xs text-zinc-500 mt-0.5">On-ramp cost comparison for {countryConfig?.name ?? 'your country'}</span>
        </div>
        {!open && bestMethod && (
          <span className="text-xs text-green-400 font-medium">
            Best: {bestMethod.method} ({bestMethod.spread_pct}%)
          </span>
        )}
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-zinc-500 border-b border-zinc-800">
                  <th className="text-left py-2 font-medium">Method</th>
                  <th className="text-right py-2 font-medium">Spread</th>
                  <th className="text-right py-2 font-medium">You Pay</th>
                  <th className="text-right py-2 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr
                    key={row.method}
                    className={`border-b border-zinc-800/50 last:border-0 ${
                      row.totalCost === bestTotal ? 'bg-green-900/10' : ''
                    }`}
                  >
                    <td className="py-3 font-medium text-zinc-200">{row.method}</td>
                    <td className="py-3 text-right text-amber-400 font-mono text-xs">
                      +{row.spread_pct}%
                    </td>
                    <td className="py-3 text-right text-zinc-100 font-semibold">
                      {formatCurrency(row.totalCost, homeCurrency)}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${RATING_COLORS[row.rating]}`}>
                        {RATING_LABELS[row.rating]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Savings callout */}
          {savings > 0 && bestMethod && worstMethod && bestMethod.method !== worstMethod.method && (
            <div className="mt-4 rounded-lg bg-green-900/20 border border-green-900/50 px-4 py-3">
              <p className="text-xs text-green-300">
                💡 You&apos;d save{' '}
                <span className="font-bold">{formatCurrency(savings, homeCurrency)}</span>{' '}
                by using <span className="font-bold">{bestMethod.method}</span> instead of{' '}
                <span className="font-bold">{worstMethod.method}</span>
              </p>
            </div>
          )}

          <p className="text-[11px] text-zinc-600 mt-3 italic">
            Spreads are approximate — actual rates vary by volume, market conditions, and provider.
          </p>
        </div>
      )}
    </div>
  );
}
