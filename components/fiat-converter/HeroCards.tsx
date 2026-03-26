'use client';

/**
 * HeroCards — Tier 1 pinned currency cards with sparklines and 24h change.
 * Shows up to 3 pinned currencies as large featured cards.
 */

import { useState } from 'react';
import { useFiat } from '@/lib/fiat-context';
import { ALL_CURRENCIES } from '@/lib/country-config';
import { TrendingUp, TrendingDown, Minus, Pin, X } from 'lucide-react';

interface HeroCardsProps {
  className?: string;
}

// ── Lightweight SVG Sparkline ──────────────────────────────────────────────────

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 120;
  const h = 36;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const color = positive ? '#22c55e' : '#ef4444';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
      <defs>
        <linearGradient id={`sg-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Format helpers ─────────────────────────────────────────────────────────────

function formatAmount(n: number, code: string): string {
  if (!n || isNaN(n)) return '—';
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: n >= 1000 ? 0 : n >= 1 ? 2 : 6,
    minimumFractionDigits: 0,
  }).format(n);
}

// ── Hero Card ──────────────────────────────────────────────────────────────────

function HeroCard({ code }: { code: string }) {
  const { result, loading, togglePin, prefs } = useFiat();
  const [expanded, setExpanded] = useState(false);

  const meta = ALL_CURRENCIES.find(c => c.code === code);
  if (!meta) return null;

  const amount = result?.rates[code] ?? null;
  const change = result?.change24h[code] ?? null;
  const sparkline = result?.sparklines[code] ?? [];
  const isPositive = (change ?? 0) >= 0;
  const isUpdating = loading;

  return (
    <div
      className={`relative rounded-2xl border p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200
        bg-gradient-to-br from-zinc-900/80 to-zinc-950 border-zinc-800
        hover:border-zinc-600 hover:shadow-lg hover:shadow-black/40
        ${isUpdating ? 'animate-pulse-once' : ''}`}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Unpin button */}
      <button
        className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-300 transition-colors z-10"
        onClick={e => { e.stopPropagation(); togglePin(code); }}
        title="Unpin"
      >
        <X size={14} />
      </button>

      {/* Header row */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{meta.flag}</span>
        <div>
          <div className="font-semibold text-zinc-100 text-sm">{meta.country}</div>
          <div className="text-zinc-500 text-xs">{code}</div>
        </div>
      </div>

      {/* Amount — hero display */}
      <div className="text-3xl font-bold text-white tracking-tight">
        {amount !== null ? formatAmount(amount, code) : <span className="text-zinc-600 text-xl">—</span>}
      </div>

      {/* Change + sparkline row */}
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-1.5">
          {change !== null ? (
            <>
              {isPositive ? (
                <TrendingUp size={14} className="text-green-400" />
              ) : change === 0 ? (
                <Minus size={14} className="text-zinc-500" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
              <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{change?.toFixed(2)}% 24h
              </span>
            </>
          ) : (
            <span className="text-zinc-600 text-xs">—</span>
          )}
        </div>
        <Sparkline values={sparkline} positive={isPositive} />
      </div>

      {/* Expanded: 30-day placeholder (uses sparkline scaled) */}
      {expanded && (
        <div className="mt-2 border-t border-zinc-800 pt-3">
          <div className="text-xs text-zinc-500 mb-2">7-day trend</div>
          <Sparkline
            values={sparkline}
            positive={isPositive}
          />
        </div>
      )}
    </div>
  );
}

// ── Hero Cards container ───────────────────────────────────────────────────────

export function HeroCards({ className = '' }: HeroCardsProps) {
  const { prefs } = useFiat();
  const pinned = prefs.pinnedCurrencies.filter(Boolean);

  if (pinned.length === 0) return null;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {pinned.map(code => (
        <HeroCard key={code} code={code} />
      ))}
    </div>
  );
}
