import { capitalize } from '@/lib/seo-params';

interface SeoContentBlockProps {
  type: 'converter' | 'fiat';
  crypto?: string;
  country?: string;
  currencyCode?: string;
  from?: string;
  to?: string;
  rate?: string;
  bestOnRamp?: string;
  pppString?: string;
}

export default function SeoContentBlock({
  type,
  crypto,
  country,
  currencyCode,
  from,
  to,
  rate,
  bestOnRamp,
  pppString,
}: SeoContentBlockProps) {
  if (type === 'converter' && from && to && rate) {
    const cFrom = capitalize(from);
    const cTo = capitalize(to);
    return (
      <article className="mt-16 pt-8 border-t border-zinc-800/50 text-zinc-400 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-200 mb-3 text-balance">
            {cFrom} to {cTo} exchange rate today
          </h2>
          <p className="leading-relaxed">
            The instant, live conversion rate for {cFrom} against {cTo} is currently <strong>{rate}</strong>. Our custom real-time tracker aggregates pricing data so you know exactly what your {cFrom} will net you when swapped to {cTo}.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">How to convert {cFrom} to {cTo}</h3>
          <p className="leading-relaxed">
            Use the interactive ApexWeb3 converter panel above to simulate your transaction. You can toggle between Live conversions and Historical conversions to see past performance, or try out the multi-coin Basket tool for portfolio-wide calculations.
          </p>
        </div>
      </article>
    );
  }

  if (type === 'fiat' && crypto && country && currencyCode) {
    const cCrypto = capitalize(crypto);
    const cCountry = capitalize(country);
    return (
      <article className="mt-16 pt-8 border-t border-zinc-800/50 text-zinc-400 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-200 mb-3 text-balance">
            {cCrypto} price in {cCountry} today ({currencyCode})
          </h2>
          <p className="leading-relaxed">
            As of today, 1 {cCrypto} is worth approximately <strong>{rate} {currencyCode}</strong> inside {cCountry}. This localized value fluctuates alongside global {cCrypto} market volatility combined with Forex exchange rates for the {currencyCode}.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">How to buy {cCrypto} in {cCountry}</h3>
          <p className="leading-relaxed">
            When trying to convert your local fiat to crypto, different on-ramp providers charge different spreads or fees. Our database suggests that using <strong>{bestOnRamp}</strong> typically provides the lowest-fee avenue for residents of {cCountry}.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">Purchasing power comparison</h3>
          <p className="leading-relaxed">
            To put this in perspective: {pppString}
          </p>
        </div>
      </article>
    );
  }

  return null;
}
