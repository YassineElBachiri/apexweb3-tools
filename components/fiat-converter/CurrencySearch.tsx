'use client';

/**
 * CurrencySearch — Searchable currency selector with region grouping and pin management.
 * Shows flag + country + currency code. Pinned currencies appear first.
 */

import { useState, useRef, useEffect } from 'react';
import { Search, Pin, X } from 'lucide-react';
import { useFiat } from '@/lib/fiat-context';
import { ALL_CURRENCIES, REGION_LABELS, REGION_ORDER } from '@/lib/country-config';
import type { Region } from '@/types/fiat';

interface CurrencySearchProps {
  onClose: () => void;
}

export function CurrencySearch({ onClose }: CurrencySearchProps) {
  const [query, setQuery] = useState('');
  const { prefs, togglePin } = useFiat();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const pinned = prefs.pinnedCurrencies;

  const filtered = query.trim()
    ? ALL_CURRENCIES.filter(c =>
        c.code.toLowerCase().includes(query.toLowerCase()) ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_CURRENCIES;

  const pinnedCurrencies = filtered.filter(c => pinned.includes(c.code));
  const unpinnedByRegion = REGION_ORDER.reduce((acc, reg) => {
    const currencies = filtered.filter(c => c.region === reg && !pinned.includes(c.code));
    if (currencies.length) acc[reg] = currencies;
    return acc;
  }, {} as Partial<Record<Region, typeof filtered>>);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search size={16} className="text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search currency, country, or code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-zinc-500 hover:text-zinc-300">
              <X size={14} />
            </button>
          )}
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 ml-1">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto px-3 py-2">
          {/* Pinned section */}
          {pinnedCurrencies.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 py-1.5">
                📌 Pinned ({pinned.length}/3)
              </div>
              <div className="grid grid-cols-1 gap-0.5">
                {pinnedCurrencies.map(c => (
                  <CurrencyItem
                    key={c.code}
                    currency={c}
                    isPinned={true}
                    onPin={() => togglePin(c.code)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* By region */}
          {Object.entries(unpinnedByRegion).map(([region, currencies]) => (
            currencies && currencies.length > 0 && (
              <div key={region} className="mb-3">
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 py-1.5">
                  {REGION_LABELS[region as Region]}
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {currencies.map(c => (
                    <CurrencyItem
                      key={c.code}
                      currency={c}
                      isPinned={false}
                      onPin={() => togglePin(c.code)}
                      canPin={pinned.length < 3}
                    />
                  ))}
                </div>
              </div>
            )
          ))}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-zinc-600 text-sm">No currencies found</div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-zinc-800 text-[11px] text-zinc-600">
          Click 📌 to pin up to 3 currencies as hero cards
        </div>
      </div>
    </div>
  );
}

// ─── Currency Item ─────────────────────────────────────────────────────────────

function CurrencyItem({
  currency, isPinned, onPin, canPin = true,
}: {
  currency: typeof ALL_CURRENCIES[0];
  isPinned: boolean;
  onPin: () => void;
  canPin?: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-default">
      <span className="text-lg flex-shrink-0">{currency.flag}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-zinc-200">{currency.country}</span>
        <span className="text-xs text-zinc-500 ml-2">{currency.name}</span>
      </div>
      <span className="text-xs font-mono font-bold text-zinc-400">{currency.code}</span>
      <button
        onClick={onPin}
        title={isPinned ? 'Unpin' : canPin ? 'Pin' : 'Max 3 pins'}
        disabled={!isPinned && !canPin}
        className={`transition-colors ${
          isPinned
            ? 'text-amber-400 hover:text-amber-300'
            : canPin
            ? 'text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100'
            : 'text-zinc-700 opacity-0 group-hover:opacity-100 cursor-not-allowed'
        }`}
      >
        <Pin size={13} />
      </button>
    </div>
  );
}
