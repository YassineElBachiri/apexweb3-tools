import { NextResponse } from 'next/server';
import { subscribeToBeehiiv } from '@/lib/beehiiv';
import { getSource } from '@/lib/beehiiv-sources';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source, referring_url } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    // Basic bot protection
    if (trimmedEmail.includes('test@test') || trimmedEmail.includes('example.com')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const sourceData = getSource(source || 'footer');
    
    const result = await subscribeToBeehiiv({
      email: trimmedEmail,
      utm_source: sourceData.utm_source,
      utm_medium: 'website',
      utm_campaign: sourceData.utm_source,
      referring_site: referring_url || 'https://www.apexweb3.com',
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: "You're in! Check your inbox." }, { headers: { 'Cache-Control': 'no-store' } });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Failed to subscribe' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

  } catch (error) {
    console.error('[API Subscribe] Error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
