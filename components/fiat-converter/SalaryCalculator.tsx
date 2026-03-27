'use client';

/**
 * SalaryCalculator — "How long to afford it?" reverse mode.
 * Shows months to save, progress visualization, and secondary insights.
 */

import { useState, useMemo } from 'react';
import { useFiat } from '@/lib/fiat-context';
import { getCountryConfigByCurrency } from '@/lib/country-config';
import { getPPPData } from '@/lib/fiat-data';

// ─── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ filledMonths, totalMonths }: { filledMonths: number; totalMonths: number }) {
  const displayTotal = Math.max(totalMonths, 12);
  const cells = Array.from({ length: displayTotal }, (_, i) => i < filledMonths);

  return (
    <div className="flex flex-wrap gap-1 mt-4">
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`h-6 flex-1 min-w-[18px] max-w-[32px] rounded-sm transition-colors duration-300 ${
            filled ? 'bg-emerald-500' : 'bg-zinc-800 border border-zinc-700'
          }`}
          title={`Month ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Input helpers ─────────────────────────────────────────────────────────────

function NumericInput({
  value, onChange, prefix, placeholder, min = 0,
}: {
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  placeholder?: string;
  min?: number;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">{prefix}</span>
      )}
      <input
        type="number"
        min={min}
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm py-3 pr-4 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 transition-all ${prefix ? 'pl-10' : 'pl-4'}`}
      />
    </div>
  );
}

// ─── Salary Calculator ─────────────────────────────────────────────────────────

interface SalaryCalculatorProps {
  className?: string;
}

export function SalaryCalculator({ className = '' }: SalaryCalculatorProps) {
  const { prefs, result } = useFiat();
  const homeCurrency = prefs.homeCurrency;

  const [income, setIncome] = useState<number>(() => {
    const ppp = getPPPData(prefs.homeCountry);
    return ppp?.avg_monthly_salary ?? 3000;
  });
  const [savingsRate, setSavingsRate] = useState(20);

  const countryConfig = getCountryConfigByCurrency(homeCurrency);
  const localAmount = result?.rates[homeCurrency] ?? 0;

  const calc = useMemo(() => {
    if (!localAmount || !income) return null;
    const monthlySavings = income * (savingsRate / 100);
    const monthsNeeded = localAmount / monthlySavings;
    const totalToSave = localAmount;
    const cryptoPerMonth = monthlySavings / (localAmount / (result?.amount ?? 1));
    const monthsIf20Drop = totalToSave * 0.8 / monthlySavings;

    return {
      monthlySavings,
      monthsNeeded,
      totalToSave,
      cryptoPerMonth,
      monthsIf20Drop,
    };
  }, [income, savingsRate, localAmount, result]);

  function formatAmount(n: number) {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: homeCurrency,
      maximumFractionDigits: n >= 1000 ? 0 : 2,
    }).format(n);
  }

  const flag = countryConfig?.flag ?? '';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            {flag} Monthly Income ({homeCurrency})
          </label>
          <NumericInput
            value={income}
            onChange={setIncome}
            placeholder="Enter your income"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Savings Rate: <span className="text-emerald-400 font-semibold">{savingsRate}%</span>
          </label>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={savingsRate}
            onChange={e => setSavingsRate(parseInt(e.target.value))}
            className="w-full h-10 accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1 px-0.5">
            <span>5%</span><span>25%</span><span>50%</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {calc && localAmount > 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
          {/* Hero output */}
          <div className="text-center">
            <div className="text-5xl font-bold text-white">
              {calc.monthsNeeded < 1 ? (
                (calc.monthsNeeded * 30) < 1 ? '< 1 day' : `${(calc.monthsNeeded * 30).toFixed(0)} days`
              ) : (
                `${calc.monthsNeeded.toFixed(1)}`
              )}
              {calc.monthsNeeded >= 1 && (
                <span className="text-2xl text-zinc-400 ml-2">months</span>
              )}
            </div>
            <div className="text-sm text-zinc-500 mt-1">to save for your goal</div>
          </div>

          {/* Progress bar */}
          <ProgressBar
            filledMonths={Math.ceil(Math.min(calc.monthsNeeded, 48))}
            totalMonths={Math.min(Math.ceil(calc.monthsNeeded) + 3, 48)}
          />

          {/* Secondary insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-4 py-3">
              <div className="text-xs text-zinc-500">Monthly savings</div>
              <div className="text-lg font-semibold text-blue-400">{formatAmount(calc.monthlySavings)}</div>
            </div>
            <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-4 py-3">
              <div className="text-xs text-zinc-500">Total needed</div>
              <div className="text-lg font-semibold text-zinc-100">{formatAmount(calc.totalToSave)}</div>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-1.5 pt-1">
            <p className="text-xs text-zinc-400">
              📊 At current prices, your monthly savings of{' '}
              <span className="text-blue-400 font-medium">{formatAmount(calc.monthlySavings)}</span>{' '}
              buys ≈{' '}
              <span className="text-emerald-400 font-medium">
                {calc.cryptoPerMonth.toFixed(result?.amount === 1 ? 6 : 4)} {result?.crypto}
              </span>
              /month
            </p>
            {calc.monthsNeeded >= 1 && calc.monthsIf20Drop < calc.monthsNeeded && (
              <p className="text-xs text-zinc-400">
                📉 If {result?.crypto} drops 20%, you&apos;d reach your goal{' '}
                <span className="text-amber-400 font-medium">
                  {(calc.monthsNeeded - calc.monthsIf20Drop).toFixed(1)} months sooner
                </span>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 text-center text-zinc-600 text-sm">
          Enter your income and prices will calculate automatically
        </div>
      )}
    </div>
  );
}
