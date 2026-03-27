import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { capitalize } from '@/lib/seo-params';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from') || 'bitcoin';
    const to = searchParams.get('to') || 'ethereum';

    const cFrom = capitalize(from);
    const cTo = capitalize(to);
    
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
               1 {from.toUpperCase().substring(0,3)} = Live Rate
            </div>
            
            <div style={{ marginTop: 20, fontSize: 48, fontWeight: 600, color: '#a1a1aa' }}>
              {cFrom} to {cTo} Converter
            </div>
            
            <div style={{ marginTop: 40, fontSize: 32, color: '#52525b', fontWeight: 500 }}>
               Live Rate • Updated just now
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
