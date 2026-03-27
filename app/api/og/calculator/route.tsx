import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { capitalize } from '@/lib/seo-params';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const coin = searchParams.get('coin') || 'crypto';

    const cCoin = capitalize(coin);
    
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
               {cCoin} Average Entry
            </div>
            
            <div style={{ marginTop: 20, fontSize: 48, fontWeight: 600, color: '#a1a1aa' }}>
              Average Cost & DCA Calculator
            </div>
            
            <div style={{ marginTop: 40, fontSize: 32, color: '#52525b', fontWeight: 500 }}>
               Track your Break-Even & Exit Strategy
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
