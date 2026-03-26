'use client';

/**
 * PurchasingPowerPanel — Shows what a crypto amount means in local purchasing power terms.
 * Uses static PPP benchmark data per country.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFiat } from '@/lib/fiat-context';
import { getPPPData } from '@/lib/fiat-data';
import { getCountryConfigByCurrency } from '@/lib/country-config';

// ─── SVG Icons (no external lib) ──────────────────────────────────────────────
function SalarySvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-zinc-400">
      <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 4V3a1 1 0 011-1h6a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function CoffeeSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-zinc-400">
      <path d="M3 5h8v6a3 3 0 01-3 3H6a3 3 0 01-3-3V5z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11 6h1a2 2 0 010 4h-1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 2s0 2 2 2 2 2 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function FuelSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-zinc-400">
      <rect x="2" y="4" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 6l3-2v8l-1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5 4V2h2v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function HomeSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-zinc-400">
      <path d="M2 7.5L8 2l6 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M4 6.5V14h3v-3h2v3h3V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Benchmark Row ─────────────────────────────────────────────────────────────
interface BenchmarkRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
function BenchmarkRow({ icon, label, value }: BenchmarkRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-zinc-800/50 last:border-0">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm text-zinc-400 flex-1">{label}</span>
      <span className="text-sm font-semibold text-zinc-100">{value}</span>
    </div>
  );
}

// ─── Panel ─────────────────────────────────────────────────────────────────────

interface PurchasingPowerPanelProps {
  className?: string;
}

export function PurchasingPowerPanel({ className = '' }: PurchasingPowerPanelProps) {
  const [open, setOpen] = useState(true);
  const { prefs, result } = useFiat();

  const homeCurrency = prefs.homeCurrency;
  const countryConfig = getCountryConfigByCurrency(homeCurrency);
  const countryCode = countryConfig?.code ?? prefs.homeCountry;
  const ppp = getPPPData(countryCode);

  if (!ppp || !result) return null;

  const localAmount = result.rates[homeCurrency] ?? 0;
  if (localAmount === 0) return null;

  const months_salary = localAmount / ppp.avg_monthly_salary;
  const coffees = localAmount / ppp.coffee;
  const liters_fuel = localAmount / ppp.fuel_liter;
  const months_rent = localAmount / ppp.rent_1br;

  const countryName = countryConfig?.name ?? prefs.homeCountry;
  const flag = countryConfig?.flag ?? '';
  const cryptoLabel = `${result.amount} ${result.crypto.charAt(0).toUpperCase() + result.crypto.slice(1)}`;

  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/40 transition-colors"
      >
        <div>
          <div className="text-sm font-semibold text-zinc-200">
            {flag} What this means in {countryName}
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">Purchasing power context</div>
        </div>
        {open ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-1">
          <p className="text-xs text-zinc-500 mb-4">In {countryName}, {cryptoLabel} equals roughly:</p>

          <BenchmarkRow
            icon={<SalarySvg />}
            label="months of average salary"
            value={months_salary >= 0.1 ? `${months_salary.toFixed(1)} months` : `${(months_salary * 30).toFixed(1)} days`}
          />
          <BenchmarkRow
            icon={<CoffeeSvg />}
            label="cups of coffee"
            value={coffees.toLocaleString('en', { maximumFractionDigits: 0 })}
          />
          <BenchmarkRow
            icon={<FuelSvg />}
            label="liters of fuel"
            value={liters_fuel.toLocaleString('en', { maximumFractionDigits: 0 })}
          />
          <BenchmarkRow
            icon={<HomeSvg />}
            label="months of rent (1-BR)"
            value={months_rent >= 0.1 ? `${months_rent.toFixed(1)} months` : `${(months_rent * 30).toFixed(1)} days`}
          />

          <p className="text-[11px] text-zinc-600 mt-4 italic">
            Estimates based on national averages — actual costs vary by city.
          </p>
        </div>
      )}
    </div>
  );
}
