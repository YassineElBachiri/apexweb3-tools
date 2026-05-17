import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { eventType, email, metadata, utmSource, utmCampaign, utmContent, isSubscribed } = data;

    // TODO: Connect this to Prisma / Drizzle DB once configured
    // Example Prisma Logic:
    /*
    import { db } from '@/lib/db';
    
    // 1. Resolve User ID if email is provided or if they are subscribed (via session)
    let userId = null;
    if (email) {
      const user = await db.user.findUnique({ where: { email } });
      if (user) userId = user.id;
    }

    // 2. Insert Event
    await db.event.create({
      data: {
        userId,
        email,
        eventType,
        eventSource: utmSource || "direct",
        utmCampaign,
        metadata,
      }
    });

    // 3. Update User Aggregates
    if (eventType === 'job_click' && email) {
      await db.user.update({
        where: { email },
        data: { jobClickCount: { increment: 1 } }
      });
    }
    */

    // For now, log the analytics telemetry
    console.log('[Tracking Analytics Capture] ->', {
      eventType,
      source: utmSource || 'direct',
      campaign: utmCampaign || 'none',
      content: utmContent || 'none',
      isSubscribed,
      metadata: metadata || {}
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Track] Error:', error);
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 });
  }
}
