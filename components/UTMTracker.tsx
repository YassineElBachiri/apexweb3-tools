'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

export function UTMTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Capture UTM params from URL
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmContent = searchParams.get('utm_content');

    if (utmSource) {
      // 2. Store in localStorage for session persistence
      const utmData = {
        source: utmSource,
        medium: utmMedium || '',
        campaign: utmCampaign || '',
        content: utmContent || '',
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem('apex_utm_data', JSON.stringify(utmData));

      // 3. Track page view with UTMs
      trackEvent('page_view', { path: pathname, ...utmData });
    } else {
      // Track normal page view
      trackEvent('page_view', { path: pathname });
    }
  }, [searchParams, pathname]);

  return null;
}

// Utility to fire events
export function trackEvent(eventType: string, metadata: any = {}) {
  try {
    // Attempt to get persisted UTM data
    const storedUtm = localStorage.getItem('apex_utm_data');
    let utmData = {};
    if (storedUtm) {
      const parsed = JSON.parse(storedUtm);
      // Only keep UTM data if it's less than 30 days old
      const ageInDays = (new Date().getTime() - new Date(parsed.timestamp).getTime()) / (1000 * 3600 * 24);
      if (ageInDays < 30) {
        utmData = parsed;
      } else {
        localStorage.removeItem('apex_utm_data');
      }
    }

    // Get user email if they are subscribed
    const isSubscribed = localStorage.getItem('apex_subscribed') === '1';
    // Note: We'd ideally have an actual email or user ID here if logged in

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        metadata,
        utmSource: (utmData as any).source,
        utmCampaign: (utmData as any).campaign,
        utmContent: (utmData as any).content,
        isSubscribed
      }),
      // Fire and forget, don't wait for response
      keepalive: true
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to track event', e);
  }
}
