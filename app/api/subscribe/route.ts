import { NextResponse } from 'next/server';
import { subscribeToSubstack } from '@/lib/substack';
import { getSource } from '@/lib/substack-sources';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source } = body;

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
    
    const result = await subscribeToSubstack({
      email: trimmedEmail,
      utm_source: sourceData.utm_source,
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
