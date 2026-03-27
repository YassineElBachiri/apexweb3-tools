import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEO_PAIRS } from '@/lib/seo-params';
import { getConverterMetadata } from '@/lib/seo-meta';
import { getConverterJsonLd } from '@/lib/seo-jsonld';
import JsonLd from '@/components/JsonLd';
import SeoContentBlock from '@/components/seo/SeoContentBlock';
import { ConverterCard } from '@/components/converter/ConverterCard';

interface PageProps {
  params: Promise<{ from: string; to: string }>;
}

export const revalidate = 60; // ISR
export const dynamicParams = true;

export async function generateStaticParams() {
  return SEO_PAIRS;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { from, to } = await params;
  return getConverterMetadata(from, to);
}

export default async function ConverterSeoPage({ params }: PageProps) {
  const { from, to } = await params;

  if (!from || !to) return notFound();

  // Try to grab live rate for exact HTML embedding
  let rateStr = 'an updated value';
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from},${to}&vs_currencies=usd`, { next: { revalidate: 60 } });
    if (res.ok) {
       const data = await res.json();
       const fromPrice = data[from]?.usd || 0;
       const toPrice = data[to]?.usd || 0;
       if (fromPrice && toPrice) {
         const rate = fromPrice / toPrice;
         rateStr = rate.toLocaleString('en-US', { maximumFractionDigits: 6 });
       }
    }
  } catch {}

  const jsonLd = getConverterJsonLd(from, to, rateStr);

  return (
    <>
      <JsonLd schema={jsonLd} />
      <div className="max-w-4xl mx-auto py-8">
        <ConverterCard />
        <SeoContentBlock 
          type="converter" 
          from={from} 
          to={to} 
          rate={rateStr} 
        />
      </div>
    </>
  );
}
