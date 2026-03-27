import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEO_CRYPTOS, SEO_COUNTRIES } from '@/lib/seo-params';
import { getFiatMetadata } from '@/lib/seo-meta';
import { getFiatJsonLd } from '@/lib/seo-jsonld';
import { getOnRampOptions, getPPPData } from '@/lib/fiat-data';
import { ALL_CURRENCIES } from '@/lib/country-config';
import JsonLd from '@/components/JsonLd';
import SeoContentBlock from '@/components/seo/SeoContentBlock';
import { FiatConverter } from '@/components/fiat-converter/FiatConverter';

interface PageProps {
  params: Promise<{ crypto: string; country: string }>;
}

export const revalidate = 60; // ISR
export const dynamicParams = true; // allow non-pre-rendered paths

export async function generateStaticParams() {
  const params = [];
  for (const crypto of SEO_CRYPTOS) {
    for (const country of SEO_COUNTRIES) {
      params.push({ crypto, country });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { crypto, country } = await params;
  return getFiatMetadata(crypto, country);
}

export default async function FiatSeoPage({ params }: PageProps) {
  const { crypto, country } = await params;
  
  if (!crypto || !country) return notFound();

  const countryConfig = ALL_CURRENCIES.find(c => c.country.toLowerCase() === country.toLowerCase());
  const currencyCode = countryConfig?.code || 'USD';

  // Try to estimate real-time rate for the JSON-LD + Content Block silently on the server.
  let rateStr = 'an updated value';
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currencyCode.toLowerCase()}`, { next: { revalidate: 60 } });
    if (res.ok) {
       const data = await res.json();
       const val = data[crypto]?.[currencyCode.toLowerCase()];
       if (val) rateStr = new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).format(val);
    }
  } catch {}

  // Resolve best on-ramp
  const onRampOptions = getOnRampOptions(countryConfig?.code || '_default');
  const bestOnRamp = onRampOptions.find(o => o.rating === 'best')?.method || onRampOptions[0].method;

  // Resolve PPP String
  const ppp = getPPPData(countryConfig?.code || 'US');
  let pppString = 'Local purchasing power impacts are significant...';
  if (ppp) {
     pppString = `In ${countryConfig?.name || country}, a standard monthly salary averages around ${ppp.avg_monthly_salary} ${currencyCode}. Local comparisons include roughly ${ppp.coffee} ${currencyCode} for a coffee or ${ppp.rent_1br} ${currencyCode} for 1br rent.`;
  }

  const jsonLd = getFiatJsonLd(crypto, countryConfig?.name || country, currencyCode, rateStr, bestOnRamp, pppString);

  return (
    <>
      <JsonLd schema={jsonLd} />
      <div className="max-w-4xl mx-auto py-8 lg:py-16">
        <FiatConverter />
        <SeoContentBlock 
          type="fiat" 
          crypto={crypto} 
          country={country} 
          currencyCode={currencyCode} 
          bestOnRamp={bestOnRamp}
          rate={rateStr}
          pppString={pppString} 
        />
      </div>
    </>
  );
}
