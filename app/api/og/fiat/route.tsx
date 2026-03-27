import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { capitalize } from '@/lib/seo-params';
import { ALL_CURRENCIES } from '@/lib/country-config';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crypto = searchParams.get('crypto') || 'bitcoin';
    const countryStr = searchParams.get('country') || 'morocco';

    const cCrypto = capitalize(crypto);
    const cCountry = capitalize(countryStr);
    
    const countryConfig = ALL_CURRENCIES.find(c => c.country.toLowerCase() === countryStr.toLowerCase());
    const currencyCode = countryConfig?.code || 'USD';
    let flagCode = 'us';
    
    // Quick map for simple IS0 3166-1 alpha-2 resolution (just guessing based on flag emojis, ideally we'd pass cc directly)
    // But since we just want a placeholder if it fails, let's try to extract from flag CDN using a simplified approach
    // We will just use the country config name to map to iso codes, but to keep it safe and functional we can 
    // rely on a static banner or simple generic fallback if country code is too hard to parse from the name.
    
    // For now we'll fetch a mock or generic live price for the design.
    let priceStr = 'Live Rate';
    try {
       const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currencyCode.toLowerCase()}`);
       if (res.ok) {
           const data = await res.json();
           const val = data[crypto]?.[currencyCode.toLowerCase()];
           if (val) priceStr = new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).format(val);
       }
    } catch {}

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            backgroundImage: 'linear-gradient(to bottom right, #18181b, #09090b)',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo / Branding */}
          <div style={{ position: 'absolute', top: 40, left: 40, display: 'flex', alignItems: 'center', color: '#10b981', fontSize: 32, fontWeight: 800 }}>
            ApexWeb3
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 96, fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center' }}>
               1 {crypto.toUpperCase().substring(0,3)} = {priceStr}
            </div>
            
            <div style={{ marginTop: 20, fontSize: 48, fontWeight: 600, color: '#a1a1aa' }}>
              {cCrypto} price in {cCountry}
            </div>
            
            <div style={{ marginTop: 40, fontSize: 32, color: '#52525b', fontWeight: 500 }}>
               Updated just now • apexweb3.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
